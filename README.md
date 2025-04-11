# Gerenciador de Estudos Ágil

![License](https://img.shields.io/github/license/Luiz-Paulo-Morais/gerenciador-de-estudos-agil)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Tech](https://img.shields.io/badge/stack-.NET%20%7C%20React-blue)

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Principais (MVP)](#-funcionalidades-principais-mvp)
- [Como Configurar o Projeto](#️-como-configurar-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Planejamento do Desenvolvimento](#-planejamento-do-desenvolvimento)
- [Diagrama Entidade-Relacionamento](#-diagrama-entidade-relacionamento)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 📌 Sobre o Projeto
O **Gerenciador de Estudos Ágil (GEA)** é um sistema projetado para auxiliar estudantes a organizar seus estudos utilizando a técnica Pomodoro e conceitos das metodologias ágeis, como Scrum. O objetivo é permitir que os usuários planejem suas matérias como sprints, acompanhem seu progresso e melhorem sua produtividade.

## 🚀 Tecnologias Utilizadas

### **Backend:**
- .NET Core (C#)
- Entity Framework Core
- SQL Server
- Arquitetura em Camadas (API, Aplicação, Domínio, Repositório, Serviços)

### **Frontend:**
- React.js
- React Router
- Axios
- Bootstrap

### **Outras Ferramentas:**
- GitHub
- Swagger/Postman
- Docker (opcional)

## 📋 Funcionalidades Principais (MVP)
- 📌 Cadastro e autenticação de usuários (JWT)
- 📅 Planejamento de estudos com estrutura Scrum
- ⏳ Gestão de sessões de estudo com Pomodoro
- 📊 Dashboard com acompanhamento de desempenho
- 📝 Registro de simulados com acertos e desempenho

## 🛠️ Como Configurar o Projeto

### **Pré-requisitos:**
- .NET SDK instalado
- Node.js instalado
- SQL Server configurado
- Git instalado

### **Passos:**
```bash
git clone https://github.com/Luiz-Paulo-Morais/Gerenciador-de-Estudos-Agil.git
cd gerenciador-de-estudos-agil
```

#### Backend:
```bash
cd ProjetoGEA.API
# Configure a string de conexão no appsettings.json
dotnet ef database update
dotnet run
```

#### Frontend:
```bash
cd ProjetoGEA.APP
npm install
npm start
```

## 🧩 Estrutura do Projeto
```
📦 gerenciador-de-estudos-agil
 ┣ 📂 Documentation
 ┣ 📂 ProjetoGEA.API
 ┃ ┣ 📂 API
 ┃ ┣ 📂 Aplicacao
 ┃ ┣ 📂 Dominio
 ┃ ┣ 📂 Repositorio
 ┃ ┗ 📂 Servicos
 ┣ 📂 ProjetoGEA.APP
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 assets
 ┃ ┃ ┣ 📂 componentes
 ┃ ┃ ┣ 📂 paginas
 ┃ ┃ ┗ 📂 services
 ┗ 📜 README.md
```

## 📅 Planejamento do Desenvolvimento

| Sprint | Entregas principais                                 |
|--------|-----------------------------------------------------|
| 1️⃣     | Metas + Pomodoro + Dashboard básico                 |
| 2️⃣     | Tarefas + integração com Pomodoro                   |
| 3️⃣     | Simulados + Gráficos de Desempenho                 |
| 4️⃣     | Padronização visual + melhoria na UX               |
| 5️⃣     | IA, novas técnicas de estudo e automações          |

## 🧠 Diagrama Entidade-Relacionamento

![Diagrama ER](https://raw.githubusercontent.com/Luiz-Paulo-Morais/Gerenciador-de-Estudos-Agil/main/Documentation/diagrama-er.png)

> Este diagrama representa a estrutura atualizada do sistema, com entidades conectadas de forma a refletir a lógica de planejamento, execução e avaliação de estudos.

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir e aprimorar! 🚀

## 💬 Contato
Caso tenha dúvidas ou sugestões, entre em contato:
- ✉️ Email: [luiz.pmorais2012@gmail.com](mailto:luiz.pmorais2012@gmail.com)
- 🔗 GitHub: [Luiz-Paulo-Morais](https://github.com/Luiz-Paulo-Morais)

---

📝 **Gerenciador de Estudos Ágil** - Organize seus estudos de forma eficiente! 📚

