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
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
