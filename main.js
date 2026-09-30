const STATUS_VALIDOS = ["Disponível", "Vendido", "Reservado"];
const ANO_MINIMO = 1990;

function exigirLogin(request) {
  if (!request.user) {
    throw new Parse.Error(
      Parse.Error.OPERATION_FORBIDDEN,
      "É preciso estar autenticado.",
    );
  }
}

async function buscarVeiculo(vehicleId) {
  if (!vehicleId) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Informe o veículo.",
    );
  }

  return new Parse.Query(Parse.Object.extend("Vehicle")).get(vehicleId, {
    useMasterKey: true,
  });
}

function validarVeiculo(vehicle) {
  const marca = vehicle.get("marca");
  const modelo = vehicle.get("modelo");
  const ano = vehicle.get("ano");
  const preco = vehicle.get("preco");
  const tipo = vehicle.get("tipo");
  const status = vehicle.get("status");

  if (!marca || !String(marca).trim()) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Informe a marca do veículo.",
    );
  }

  if (!modelo || !String(modelo).trim()) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Informe o modelo do veículo.",
    );
  }

  if (!tipo || !String(tipo).trim()) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Informe o tipo do veículo.",
    );
  }

  const anoAtual = new Date().getFullYear();

  if (
    typeof ano !== "number" ||
    ano < ANO_MINIMO ||
    ano > anoAtual + 1
  ) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      `Ano inválido. Use um valor entre ${ANO_MINIMO} e ${anoAtual + 1}.`,
    );
  }

  if (typeof preco !== "number" || preco <= 0) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "O preço deve ser um número maior que zero.",
    );
  }

  if (status && !STATUS_VALIDOS.includes(status)) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      `Status inválido. Use um dos seguintes: ${STATUS_VALIDOS.join(", ")}.`,
    );
  }

  if (!status) {
    vehicle.set("status", "Disponível");
  }

  if (!vehicle.get("tipoPreco")) {
    vehicle.set("tipoPreco", "À vista");
  }
}

function serializeVehicle(vehicle) {
  return {
    id: vehicle.id,
    marca: vehicle.get("marca"),
    modelo: vehicle.get("modelo"),
    ano: vehicle.get("ano"),
    preco: vehicle.get("preco"),
    tipo: vehicle.get("tipo"),
    status: vehicle.get("status"),
    tipoPreco: vehicle.get("tipoPreco"),
    createdAt: vehicle.get("createdAt"),
  };
}

function serializeSale(sale) {
  const vehicle = sale.get("veiculo");

  return {
    id: sale.id,
    data: sale.get("data"),
    consultor: sale.get("consultor"),
    valorFinal: sale.get("valorFinal"),
    veiculo: vehicle
      ? {
          id: vehicle.id,
          marca: vehicle.get("marca"),
          modelo: vehicle.get("modelo"),
        }
      : null,
  };
}

Parse.Cloud.beforeSave("Vehicle", async (request) => {
  validarVeiculo(request.object);
});

Parse.Cloud.beforeSave("Sale", async (request) => {
  const sale = request.object;
  const valorFinal = sale.get("valorFinal");
  const veiculo = sale.get("veiculo");
  const consultor = sale.get("consultor");

  if (!veiculo) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "A venda precisa estar associada a um veículo.",
    );
  }

  if (!consultor || !String(consultor).trim()) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Informe o consultor responsável pela venda.",
    );
  }

  if (typeof valorFinal !== "number" || valorFinal <= 0) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "O valor final da venda deve ser maior que zero.",
    );
  }

  if (!sale.get("data")) {
    sale.set("data", new Date());
  }
});

Parse.Cloud.beforeSave(Parse.User, async (request) => {
  const user = request.object;

  if (!user.get("role")) {
    user.set("role", "Consultor");
  }
});

Parse.Cloud.define("registerUser", async (request) => {
  const { nome, email, senha, role } = request.params;

  if (!nome || !email || !senha) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Nome, e-mail e senha são obrigatórios.",
    );
  }

  const user = new Parse.User();

  user.set("username", email);
  user.set("email", email);
  user.set("password", senha);
  user.set("nome", nome);
  user.set("role", role || "Consultor");

  await user.signUp(null, {
    useMasterKey: true,
  });

  return {
    id: user.id,
    nome: user.get("nome"),
    email: user.get("email"),
    role: user.get("role"),
  };
});

Parse.Cloud.define("listUsers", async (request) => {
  exigirLogin(request);

  const query = new Parse.Query(Parse.User);

  query.limit(1000);

  const users = await query.find({
    useMasterKey: true,
  });

  return users.map((user) => ({
    id: user.id,
    nome: user.get("nome"),
    email: user.get("email"),
    role: user.get("role"),
  }));
});

Parse.Cloud.define("createVehicle", async (request) => {
  exigirLogin(request);

  const {
    marca,
    modelo,
    ano,
    preco,
    tipo,
    tipoPreco,
    status,
  } = request.params;

  const Vehicle = Parse.Object.extend("Vehicle");
  const vehicle = new Vehicle();

  vehicle.set("marca", marca);
  vehicle.set("modelo", modelo);
  vehicle.set("ano", Number(ano));
  vehicle.set("preco", Number(preco));
  vehicle.set("tipo", tipo);

  if (tipoPreco) {
    vehicle.set("tipoPreco", tipoPreco);
  }

  if (status) {
    vehicle.set("status", status);
  }

  const acl = new Parse.ACL();

  acl.setPublicReadAccess(true);
  acl.setRoleWriteAccess("Administrador", true);

  vehicle.setACL(acl);

  await vehicle.save(null, {
    useMasterKey: true,
  });

  return serializeVehicle(vehicle);
});

Parse.Cloud.define("listVehicles", async (request) => {
  const { busca, status } = request.params || {};

  const Vehicle = Parse.Object.extend("Vehicle");
  const query = new Parse.Query(Vehicle);

  query.descending("createdAt");
  query.limit(1000);

  if (status) {
    query.equalTo("status", status);
  }

  const results = await query.find({
    useMasterKey: true,
  });

  let vehicles = results.map(serializeVehicle);

  if (busca) {
    const termo = String(busca).toLowerCase();

    vehicles = vehicles.filter((vehicle) =>
      `${vehicle.marca} ${vehicle.modelo} ${vehicle.tipo}`
        .toLowerCase()
        .includes(termo),
    );
  }

  return vehicles;
});

Parse.Cloud.define("updateVehicleStatus", async (request) => {
  exigirLogin(request);

  const { vehicleId, status } = request.params;

  if (!STATUS_VALIDOS.includes(status)) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Status inválido.",
    );
  }

  const vehicle = await buscarVeiculo(vehicleId);

  vehicle.set("status", status);

  await vehicle.save(null, {
    useMasterKey: true,
  });

  return serializeVehicle(vehicle);
});

Parse.Cloud.define("reserveVehicle", async (request) => {
  exigirLogin(request);

  const vehicle = await buscarVeiculo(request.params.vehicleId);

  if (vehicle.get("status") !== "Disponível") {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Apenas veículos disponíveis podem ser reservados.",
    );
  }

  vehicle.set("status", "Reservado");

  await vehicle.save(null, {
    useMasterKey: true,
  });

  return serializeVehicle(vehicle);
});

Parse.Cloud.define("cancelReservation", async (request) => {
  exigirLogin(request);

  const vehicle = await buscarVeiculo(request.params.vehicleId);

  if (vehicle.get("status") !== "Reservado") {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "O veículo não está reservado.",
    );
  }

  vehicle.set("status", "Disponível");

  await vehicle.save(null, {
    useMasterKey: true,
  });

  return serializeVehicle(vehicle);
});

async function removerVeiculo(request) {
  exigirLogin(request);

  const vehicle = await buscarVeiculo(request.params.vehicleId);

  if (vehicle.get("status") === "Vendido") {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Não é possível excluir um veículo já vendido.",
    );
  }

  await vehicle.destroy({
    useMasterKey: true,
  });

  return { deleted: true };
}

Parse.Cloud.define("removeVehicle", removerVeiculo);
Parse.Cloud.define("deleteVehicle", removerVeiculo);

Parse.Cloud.define("registerSale", async (request) => {
  exigirLogin(request);

  const {
    vehicleId,
    consultor,
    valorFinal,
  } = request.params;

  const vehicle = await buscarVeiculo(vehicleId);

  if (vehicle.get("status") === "Vendido") {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Este veículo já foi vendido.",
    );
  }

  const Sale = Parse.Object.extend("Sale");
  const sale = new Sale();

  sale.set("veiculo", vehicle);
  sale.set("consultor", consultor);
  sale.set("valorFinal", Number(valorFinal));
  sale.set("data", new Date());

  await sale.save(null, {
    useMasterKey: true,
  });

  vehicle.set("status", "Vendido");

  await vehicle.save(null, {
    useMasterKey: true,
  });

  return serializeSale(sale);
});

Parse.Cloud.define("listSales", async () => {
  const Sale = Parse.Object.extend("Sale");
  const query = new Parse.Query(Sale);

  query.include("veiculo");
  query.descending("data");
  query.limit(1000);

  const results = await query.find({
    useMasterKey: true,
  });

  return results.map(serializeSale);
});

Parse.Cloud.define("dashboardStats", async () => {
  const Vehicle = Parse.Object.extend("Vehicle");
  const Sale = Parse.Object.extend("Sale");

  const [vehicles, sales] = await Promise.all([
    new Parse.Query(Vehicle)
      .limit(1000)
      .find({ useMasterKey: true }),

    new Parse.Query(Sale)
      .limit(1000)
      .find({ useMasterKey: true }),
  ]);

  const totalVeiculos = vehicles.length;

  const disponiveis = vehicles.filter(
    (vehicle) => vehicle.get("status") === "Disponível",
  ).length;

  const vendidos = vehicles.filter(
    (vehicle) => vehicle.get("status") === "Vendido",
  ).length;

  const reservados = vehicles.filter(
    (vehicle) => vehicle.get("status") === "Reservado",
  ).length;

  const agora = new Date();

  const vendasDoMes = sales.filter((sale) => {
    const data = sale.get("data");

    return (
      data &&
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    );
  });

  const receitaDoMes = vendasDoMes.reduce(
    (soma, sale) => soma + (sale.get("valorFinal") || 0),
    0,
  );

  const taxaConversao =
    totalVeiculos > 0
      ? (vendidos / totalVeiculos) * 100
      : 0;

  return {
    totalVeiculos,
    disponiveis,
    vendidos,
    reservados,
    vendasNoMes: vendasDoMes.length,
    receitaNoMes: receitaDoMes,
    taxaConversao: Number(taxaConversao.toFixed(1)),
  };
});
