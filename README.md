<h1 align="center"> Next</h1>

<p align="center">
Projeto desenvolvido durante a disciplina de Programação Web e Mobile.
</p>

<p align="center">
  <a href="#-documentação">Documentação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="%EF%B8%8F-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-fluxo-do-sistema">Fluxo do Sistema</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="%EF%B8%8F-arquitetura-c4-model">Arquitetura (C4 Model)</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-rodar-o-projeto">Como Rodar o Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-estrutura-da-documentação">Estrutura da Documentação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-integrantes">Integrantes</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

<br>

<p align="center">
  <img alt="img" src="assets/logo-next.jpg" width="100%">
</p>

## 🌐 Documentação
- 📄 **Documentação em PDF**: [Clique aqui para acessar](documentacao/next_backend.pdf)

## 💻 Projeto

A Next é um sistema desenvolvido para gerenciamento e venda de carros seminovos, criado com o objetivo de aplicar conceitos avançados de Análise e Projeto de Software em um cenário real. Esta versão do projeto evoluiu a arquitetura original para um frontend em Next.js consumindo um backend serverless (Cloud Code) hospedado no Back4App, mantendo as boas práticas de desenvolvimento, organização e escalabilidade da aplicação.

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Next.js (App Router)
- React
- JavaScript
- Back4App (Parse Server / Cloud Code)
- MongoDB (gerenciado pelo Back4App)
- VS Code
- API Console (Back4App)
- Git e Github

## 🛠️ Funcionalidades

- Gestão de Inventário: Registo completo de veículos, incluindo marca, modelo, ano, preço e tipo.
- Módulo de Vendas: Fluxo estruturado para o registo de transações e histórico de negociações.
- Painel Administrativo: Visualização rápida de métricas de entrada e saída, facilitando o controlo do stock.
- Gestão de Usuários: Cadastro, login e controle de acesso da equipe comercial.
- Interface Otimizada: Foco na experiência do utilizador para agilizar o processo de gestão e venda.

## 🧭 Fluxo do Sistema

``` mermaid
flowchart LR

A[Cadastro de Veículo] --> B[Entrada no Inventário]
B --> C[Stock Disponível]
C --> D[Negociação / Reserva]
D --> E[Venda Confirmada]
E --> F[Atualização de Status: Vendido]
F --> G[Atualização do Painel Administrativo]
G --> H[Relatórios e Indicadores]
```

## 🏗️ Arquitetura (C4 Model)

## Contexto do Sistema

``` mermaid
flowchart LR

E[Empresário/Funcionário]  --> N[Next]


N --> DB[(Banco de Dados)]
N --> P[Processo de Registro]
N --> V[Vizualização dos dados]
```
## Containers

``` mermaid
flowchart LR

User[Usuário]

Frontend[Frontend Next.js]
Backend[Cloud Code - Back4App]
DB[(MongoDB)]

User --> Frontend
Frontend -- Parse SDK / Cloud Functions --> Backend
Backend --> DB
```

## Componentes

``` mermaid
flowchart LR

API[Cloud Functions]

Inventário[Gestão de Veículos]
Negociações[Registro de Vendas]
Usuarios[Gestão de Usuários]

DB[(MongoDB)]

API --> Inventário
API --> Negociações
API --> Usuarios

Inventário --> DB
Negociações --> DB
Usuarios --> DB
```

## 👨‍💻 Integrantes

<table>
  <tr>
    <td align="center">
      <img src="assets/Emerson.png" width="120px;" alt="Foto do Emerson"/><br>
      <a href="https://www.linkedin.com/in/emerson-willian-19984630b/" target="_blank">
        <sub><b>Emerson Dias</b></sub> <sub><b>RA:00000854559 </b></sub>
      </a>
    </td>
    <td align="center">
      <img src="assets/Clara.png" width="120px;" alt="Foto da Clara"/><br>
      <a href="https://www.linkedin.com/in/maria-clara-de-oliveira-barbosa-07457b364/" target="_blank">
        <sub><b>Maria Clara</b></sub> <sub><b>RA:00000855589 </b></sub>
      </a>
    </td>
    <td align="center">
      <img src="assets/Marcela.png" width="120px;" alt="Foto da Marcela"/><br>
      <a href= "https://www.linkedin.com/in/marcela-cristine-cantalice-santos-994309410/" target="_blank">
        <sub><b>Marcela Cantalice</b></sub> <sub><b>RA:00000853203 </b></sub>
      </a>
    </td>
    <td align="center">
      <img src="assets/Marcos.png" width="120px;" alt="Foto do Marcos"/><br>
      <a href="https://www.linkedin.com/in/marcos-dalyson-9457373b3?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank">
        <sub><b>Marcos Dalyson</b></sub> <sub><b>RA:00000854567 </b></sub>
      </a>
    </td>
    <td align="center">
      <img src="assets/Mateus.png" width="120px;" alt="Foto do Mateus"/><br>
      <a href="https://www.linkedin.com/in/mateus-oliveira-172492213" target="_blank">
        <sub><b>Mateus Oliveira</b></sub> <sub><b>RA:00000855658 </b></sub>
      </a>
    </td>
    </td>
  </tr>
</table>

## 📝 Licença

Esse projeto está sob a licença MIT.