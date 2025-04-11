# 🎤 Sistema Gerenciador de Estudos Ágil (GEA)

---

## 📘 1. Introdução – Visão Geral do Sistema

O **Gerenciador de Estudos Ágil (GEA)** é uma aplicação web criada para ajudar estudantes a:

- Organizar seus estudos
- Planejar metas de aprendizado
- Registrar progresso
- Medir desempenho

---

## 📘 1.1 Técnicas Aplicadas

### 🔹 Técnica Pomodoro
> Método de gestão do tempo baseado em ciclos de **25 minutos de foco**, com **pausas curtas**.  
💡 Aumenta produtividade e concentração.

### 🔹 Metodologia Ágil – Scrum
> Planejamento baseado em **Sprints** (períodos curtos com metas definidas) e backlog de tarefas.  
💡 Melhora organização e adaptabilidade.

---

## 🧑‍🎓 O que o GEA permite:

✅ Criar **metas personalizadas** por matéria e sprint  
✅ Gerenciar tarefas e progresso  
✅ Registrar sessões de estudo com Pomodoro  
✅ Registrar simulados com correção  
✅ Visualizar **indicadores de desempenho**

---

## ⚙️ 2. Desenvolvimento – Organização e Funcionalidades

---

## 📁 2.1 Organização do Projeto

📦 Arquitetura em Camadas (Backend):  
- Domínio  
- Repositório  
- Aplicação  
- Serviços  
- API

📦 Frontend estruturado em componentes reutilizáveis.

---

## ✍️ 2.2 Padrão de Commits

| Tipo       | Descrição                        |
|------------|----------------------------------|
| feat       | Nova funcionalidade              |
| fix        | Correção de bug                  |
| refactor   | Refatoração sem alterar lógica   |
| style      | Ajustes visuais                  |
| docs       | Atualização de documentação      |
| test       | Adição de testes                 |
| chore      | Tarefas de manutenção            |
| build/ci   | Configuração de build ou deploy  |

---

## 🧠 2.3 Funcionalidades Principais

- 👤 Autenticação de usuários com permissões
- 📈 Criação e acompanhamento de metas de estudo
- ⏱ Registro de sessões com Pomodoro
- 📘 Registro de simulados
- 📊 Painel com progresso e desempenho

---

## 🛠️ 3. Backend – Estrutura e Lógica

---

## 🧱 3.1 Arquitetura em Camadas (GEA)

### 🔹 Domain Layer
> Núcleo do sistema  
📦 Entidades: `Usuario`, `Materia`, `Sprint`, `MetaEstudo`, `CicloPomodoro`, `Simulado`  
🔧 Interfaces: `IMetaEstudoAplicacao`, etc.

---

### 🔹 Repository Layer
> Acesso ao banco via EF Core  
🗃️ Repositórios: `UsuarioRepositorio`, `SprintRepositorio`  
🔁 Métodos: `AdicionarAsync()`, `ListarPorUsuarioAsync()`

---

### 🔹 Application Layer
> Orquestra a lógica de uso do sistema  
🧩 Casos de uso:  
- `CriarMetaEstudo()`  
- `IniciarSessaoPomodoro()`  
- `RegistrarSimuladoAsync()`

---

### 🔹 Service Layer
> Regras específicas e integrações externas  
📬 Exemplo: `NotificacaoService`, `DesempenhoService`

---

### 🔹 API Layer
> Exposição via endpoints REST  
🌐 Controllers:  
- `UsuarioController`  
- `SimuladoController`

🛣️ Rotas:  
- `GET /api/simulados/usuario/{id}`  
- `POST /api/metas`

---

## 🔐 3.2 Autenticação com JWT + Identity

- 🛡️ ASP.NET Identity para controle de usuários  
- 🔐 JWT para autenticação via token  
- ⚙️ `AuthService.cs`: login, registro, token  
- 🔄 `AuthController.cs`: endpoints públicos

---

## 💻 4. Frontend – Organização e Funcionalidade

---

## 🧩 4.1 Componentização com React

- ✅ Componentes reutilizáveis: `PageContainer`, `Header`, `CardMeta`, etc.  
- 🧼 Lógica e estilos padronizados  
- 🔁 Comunicação via Axios com backend

---

## 🌐 4.2 Autenticação no Frontend

- 🔄 `AuthContext`: contexto global de autenticação  
- ⚒️ `useAuth()` e `usePermissao()` para verificar status e permissões  
- 🔐 `PrivateRoute`: bloqueia acesso para usuários não logados

---

## 🧱 4.3 Padronização de Layout

- 💼 Todas as páginas usam `PageContainer`  
- 🔄 Layout responsivo e coeso  
- ✔️ Feedback visual (erros, sucesso, carregamento)

---

## 🚀 5. Conclusão – Melhorias Futuras

---

### 🧠 Melhorias previstas:

- ✉️ Recuperação de senha por e-mail  
- 📊 Gráficos de desempenho mais completos  
- ⏳ Novas técnicas de estudo (Revisão Espaçada, Feynman)  
- 🤖 Sugestões automáticas com IA  
- ⚙️ Stored Procedures e Views no banco

---

## 💬 Obrigado! Vamos estudar com agilidade! 🧠📚

---