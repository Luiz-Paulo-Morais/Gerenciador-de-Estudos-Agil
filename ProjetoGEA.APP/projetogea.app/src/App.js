import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Home from './pages/Home/Home';
import Usuario from './pages/Usuario/Usuario';
import UsuarioNovo from './pages/UsuarioNovo/UsuarioNovo';
import UsuarioAtualizar from './pages/UsuarioAtualizar/UsuarioAtualizar';
import Materia from './pages/Materia/Materia';
import MateriaNova from './pages/MateriaNova/MateriaNova';
import MateriaAtualizar from './pages/MateriaAtualizar/MateriaAtualizar';
import Simulado from './pages/Simulado/Simulado';
import SimuladoNovo from './pages/SimuladoNovo/SimuladoNovo';
import SimuladoAtualizar from './pages/SimuladoAtualizar/SimuladoAtualizar';
import Sprint from './pages/Sprint/Sprint';
import SprintNovo from './pages/SprintNovo/SprintNovo';
import SprintAtualizar from './pages/SprintAtualizar/SprintAtualizar';
import Tarefa from './pages/Tarefa/Tarefa';
import TarefaNova from './pages/TarefaNova/TarefaNova';
import TarefaAtualizar from './pages/TarefaAtualizar/TarefaAtualizar';
import SessaoEstudo from './pages/SessaoEstudo/SessaoEstudo';
import Desempenho from './pages/Desempenho/Desempenho';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
            <Route path='/usuario' element={<Usuario />} />
            <Route path='/usuario/novo' element={<UsuarioNovo />} />
            <Route path='/usuario/atualizar' element={<UsuarioAtualizar />} />
            <Route path='/materia' element={<Materia />} />
            <Route path='/materia/nova' element={<MateriaNova />} />
            <Route path='/materia/atualizar/:id' element={<MateriaAtualizar />} />
            <Route path='/simulado' element={<Simulado />} />
            <Route path='/simulado/novo' element={<SimuladoNovo />} />
            <Route path='/simulado/atualizar/:id' element={<SimuladoAtualizar />} />
            <Route path='/sprint' element={<Sprint />} />
            <Route path='/sprint/novo' element={<SprintNovo />} />
            <Route path='/sprint/atualizar/:id' element={<SprintAtualizar />} />
            <Route path='/tarefa' element={<Tarefa />} />
            <Route path='/tarefa/nova' element={<TarefaNova />} />
            <Route path='/tarefa/atualizar/:id' element={<TarefaAtualizar />} />
            <Route path='/sessaoEstudo' element={<SessaoEstudo />} />
            <Route path='/desempenho' element={<Desempenho />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
