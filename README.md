# Gerenciador de Estudos Ágil

## 📌 Sobre o Projeto
O **Gerenciador de Estudos Ágil (GEA)** é um sistema projetado para auxiliar estudantes a organizar seus estudos utilizando a técnica Pomodoro e conceitos das metodologias ágeis, como Scrum. O objetivo é permitir que os usuários planejem suas matérias como sprints, acompanhem seu progresso e melhorem sua produtividade.

## 🚀 Tecnologias Utilizadas
O projeto utiliza as seguintes tecnologias:

### **Backend:**
- .NET Core (C#)
- Entity Framework Core
- SQL Server
- Arquitetura em Camadas (API, Aplicação, Domínio, Repositório, Serviços)

### **Frontend:**
- React.js
- React Router
- Axios para comunicação com a API
- TailwindCSS (opcional para estilização)

### **Outras Ferramentas:**
- GitHub para controle de versão e colaboração
- Postman/Swagger para testes de API
- Docker (opcional para gerenciamento de containers)

## 📋 Funcionalidades Principais (MVP)
- 📌 **Cadastro e autenticação de usuários** (JWT para segurança)
- 📅 **Planejamento de estudos** com estrutura baseada em Scrum
- ⏳ **Gestão de sessões de estudo** seguindo a técnica Pomodoro
- 📊 **Acompanhamento de desempenho** por sprint e matéria
- 📝 **Registro de simulados e notas**

## 🛠️ Como Configurar o Projeto
### **Pré-requisitos:**
- .NET SDK instalado
- Node.js instalado
- SQL Server configurado
- Git instalado

### **Passos para execução:**
1. **Clone o repositório:**
   ```sh
   git clone https://github.com/Luiz-Paulo-Morais/Gerenciador-de-Estudos-Agil.git
   cd gerenciador-de-estudos-agil
   ```

2. **Configuração do Backend:**
   - Acesse a pasta `ProjetoGEA.API/`
   - Configure a string de conexão no `appsettings.json`
   - Execute as migrations:
     ```sh
     dotnet ef database update
     ```
   - Inicie o backend:
     ```sh
     dotnet run
     ```

3. **Configuração do Frontend:**
   - Acesse a pasta `ProjetoGEA.APP/`
   - Instale as dependências:
     ```sh
     npm install
     ```
   - Inicie o frontend:
     ```sh
     npm start
     ```

## 🧩 Estrutura do Projeto
```
📦 gerenciador-de-estudos-agil
 ┣ 📂 Documentation
 ┣ 📂 ProjetoGEA.API (Backend)
 ┃ ┣ 📂 ProjetoGEA.API (Camada de Apresentação)
 ┃ ┣ 📂 ProjetoGEA.Aplicacao (Regras de Negócio)
 ┃ ┣ 📂 ProjetoGEA.Dominio (Modelos e Entidades)
 ┃ ┣ 📂 ProjetoGEA.Repositorio (Acesso ao Banco de Dados)
 ┃ ┗ 📂 ProjetoGEA.Servicos (Serviços e Lógica de Aplicação)
 ┣ 📂 ProjetoGEA.APP (Frontend)
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 assets (Recursos visuais)
 ┃ ┃ ┣ 📂 componentes (Componentes reutilizáveis)
 ┃ ┃ ┣ 📂 paginas (Páginas principais da aplicação)
 ┃ ┃ ┗ 📂 services (Chamadas à API)
 ┗ 📜 README.md
```

## 🏗️ Planejamento do Desenvolvimento
O desenvolvimento do projeto seguirá uma abordagem ágil com Sprints semanais:

1️⃣ **Semana 1:** Planejamento inicial, setup do ambiente e modelagem do banco de dados.  
2️⃣ **Semana 2:** Desenvolvimento do backend (API REST, autenticação e CRUD de usuários e matérias).  
3️⃣ **Semana 3:** Desenvolvimento do frontend (telas de login, dashboard e integração com backend).  
4️⃣ **Semana 4:** Refinamento, testes, ajustes finais e deploy.  

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir e aprimorar! 🚀

## 💬 Contato
Caso tenha dúvidas ou sugestões, entre em contato:
- ✉️ Email: [luiz.pmorais2012@gmail.com](mailto:luiz.pmorais2012@gmail.com)
- 🔗 GitHub: [Luiz-Paulo-Morais](https://github.com/Luiz-Paulo-Morais)

---
📝 **Gerenciador de Estudos Ágil** - Organize seus estudos de forma eficiente! 📚

