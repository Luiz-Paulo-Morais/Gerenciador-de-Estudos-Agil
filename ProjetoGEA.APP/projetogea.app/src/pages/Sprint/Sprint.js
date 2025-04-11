import { useState, useEffect, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Sprint.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import SprintApi from "../../services/sprintApi";
import UsuarioApi from "../../services/usuarioApi";
import Modal from "react-bootstrap/Modal";

const Sprint = () => {
  const navigate = useNavigate();
  const { podeEditar, podeCriar, podeVisualizarTudo } = usePermissao();
  const { usuario } = useAuth();
  const usuarioLogadoId = usuario?.userId;

  const [sprints, setSprints] = useState([]);
  const [sprintSelecionado, setSprintSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const limparFiltro = filtro.length > 0;

  const carregarDados = useCallback(async () => {
    try {
      const listaSprints = podeVisualizarTudo
        ? await SprintApi.listarAsync(true)
        : await SprintApi.listarPorUsuarioAsync(usuarioLogadoId, true);

      const listaUsuarios = podeVisualizarTudo ? await UsuarioApi.listarAsync(true) : [];
      
      setSprints(listaSprints);
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, [podeVisualizarTudo, usuarioLogadoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const usuariosMap = usuarios.reduce((map, usuario) => {
    map[usuario.id] = usuario.nome;
    return map;
  }, {});

  const sprintsFiltradas = sprints.filter((sprint) => {
    return (
      (usuarioSelecionado === "" || sprint.usuarioId === parseInt(usuarioSelecionado)) &&
      (filtro === "" || sprint.nome.toLowerCase().includes(filtro) || sprint.dataInicio.toLowerCase().includes(filtro) || sprint.dataFim.toLowerCase().includes(filtro))
    );
  });

  const handleChangeFiltro = (e) => setFiltro(e.target.value.toLowerCase());
  const handleLimparBusca = () => setFiltro("");
  const handleChangeUsuario = (e) => setUsuarioSelecionado(e.target.value);
  const handleEditar = (id) => navigate(`/sprint/atualizar/${id}`);
  const handleClickDeletar = (sprint) => {
    setSprintSelecionado(sprint);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    try {
      await SprintApi.deletarAsync(sprintSelecionado.id);
      setSprints(sprints.filter((s) => s.id !== sprintSelecionado.id));
    } catch (error) {
      console.error("Erro ao deletar sprint", error);
    } finally {
      setMostrarModal(false);
      setSprintSelecionado(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.sprintContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Sprints</h2>
          <div className={styles.searchContainer}>
            <Form.Control
              type="text"
              placeholder="Buscar sprint"
              value={filtro}
              onChange={handleChangeFiltro}
              className={styles.searchInput}
            />
            {limparFiltro && (
              <button className={styles.buttonLimparFiltro} onClick={handleLimparBusca}>X</button>
            )}
            {podeVisualizarTudo && (
              <Form.Select className={styles.selectSprint} value={usuarioSelecionado} onChange={handleChangeUsuario}>
                <option value="">Todos os Usuários</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                ))}
              </Form.Select>
            )}
            {podeCriar && (
              <Button className={styles.addSprintButton} onClick={() => navigate("/sprint/novo")}>+ Sprint</Button>
            )}
          </div>
          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  {podeVisualizarTudo && <th>Usuário</th>}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sprintsFiltradas.map((sprint) => (
                  <tr key={sprint.id}>
                    <td>{sprint.nome}</td>
                    <td>{new Date(sprint.dataInicio).toLocaleDateString("pt-BR")}</td>
                    <td>{new Date(sprint.dataFim).toLocaleDateString("pt-BR")}</td>
                    {podeVisualizarTudo && <td>{usuariosMap[sprint.usuarioId] ?? "Desconhecido"}</td>}
                    <td className={styles.actionIcons}>
                      {podeEditar && <FaEdit onClick={() => handleEditar(sprint.id)} />}
                      {podeEditar && <FaTrash onClick={() => handleClickDeletar(sprint)}
                      aria-label={`Deletar sprint ${sprint.nome}`}
                      />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.modalTitle}>Confirmar</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>Tem certeza que deseja deletar a sprint {sprintSelecionado?.nome}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default Sprint;
