const STATUS_VALIDOS = ["Disponível", "Vendido", "Reservado"];
const ANO_MINIMO = 1990;

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
