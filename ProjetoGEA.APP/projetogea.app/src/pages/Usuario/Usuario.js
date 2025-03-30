import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Usuario.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import Modal from 'react-bootstrap/Modal';

const Usuario = () => {
  const navigate = useNavigate();
  const { podeEditar, podeVisualizarTudo } = usePermissao();
  const { usuario } = useAuth();
  const usuarioLogadoId = usuario?.userId;

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const limparFiltro = filtro.length > 0;

  const carregarUsuarios = useCallback(async () => {
    try {
      let listaUsuarios = [];

      if (podeVisualizarTudo) {
        console.log("🔹 Administrador: buscando todos os usuários...");
        listaUsuarios = await UsuarioApi.listarAsync(true);
      } else {
        console.log("🔹 Usuário Padrão: buscando apenas seu usuário...");
        const usuario = await UsuarioApi.obterAsync(usuarioLogadoId);
        listaUsuarios = Array.isArray(usuario) ? usuario : [usuario];
      }

      console.log("🔹 Lista final de usuários:", listaUsuarios);
      setUsuarios(listaUsuarios);
      setUsuariosFiltrados(listaUsuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários: ", error);
    }
  }, [podeVisualizarTudo, usuarioLogadoId]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleChangeFiltro = (e) => {
    const valor = e.target.value.toLowerCase();
    setFiltro(valor);

    if (!valor) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const filtrados = usuarios.filter((usuario) =>
      usuario.nome.toLowerCase().includes(valor) ||
      usuario.email.toLowerCase().includes(valor)
    );
    setUsuariosFiltrados(filtrados);
  };

  const handleLimparBusca = () => {
    setFiltro("");
    setUsuariosFiltrados(usuarios);
  };

  const handleEditar = (id) => {
    navigate(`/usuario/atualizar`, { state: { id } });
  };

  const handleClickDeletar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    try {
      await UsuarioApi.deletarAsync(usuarioSelecionado.id);
      const novaListaUsuarios = usuarios.filter(u => u.id !== usuarioSelecionado.id);
      setUsuarios(novaListaUsuarios);
      setUsuariosFiltrados(novaListaUsuarios);
    } catch (error) {
      console.error("Erro ao deletar usuário", error);
    } finally {
      handleFecharModal();
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setUsuarioSelecionado(null);
  };

  const usuariosParaExibir = podeVisualizarTudo
    ? usuariosFiltrados
    : usuariosFiltrados.filter(u => u.id === Number(usuarioLogadoId));  

  return (
    <PageContainer>
      <div className={styles.usuarioContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Usuários</h2>

          {/* 🔹 Buscar e criar usuários - Somente Administrador pode ver */}
          {podeVisualizarTudo && (
            <div className={styles.searchContainer}>
              <Form.Control
                type="text"
                name="filtro"
                placeholder="Buscar usuário por nome / email"
                value={filtro}
                onChange={handleChangeFiltro}
                className={styles.searchInput}
              />
              {limparFiltro && (
                <button className={styles.buttonLimparFiltro} onClick={handleLimparBusca}>X</button>
              )}
              <Button className={styles.addUserButton} onClick={() => navigate("/usuario/novo")}>
                Novo Usuário
              </Button>
            </div>
          )}
          {/* 📋 Tabela de usuários */}
          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th className={styles.tabela_colunaAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosParaExibir.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td className={styles.actionIcons}>
                      {podeEditar && <FaEdit onClick={() => handleEditar(usuario.id)} />}
                      {podeEditar && <FaTrash onClick={() => handleClickDeletar(usuario)} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        
        {/* 🗑️ Modal de confirmação para exclusão */}
        <Modal show={mostrarModal} onHide={handleFecharModal}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.modalTitle}>Confirmar</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            Tem certeza que deseja deletar o usuário {usuarioSelecionado?.nome}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleFecharModal}>Cancelar</Button>
            <Button variant='danger' onClick={handleDeletar}>Deletar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default Usuario;
