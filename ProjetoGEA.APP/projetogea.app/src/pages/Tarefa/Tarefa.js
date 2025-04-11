import { useState, useEffect, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Tarefa.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import TarefaApi from "../../services/tarefaApi";
import MateriaApi from "../../services/materiaApi";
import UsuarioApi from "../../services/usuarioApi";
import SprintApi from "../../services/sprintApi";
import Modal from "react-bootstrap/Modal";

const Tarefa = () => {
  const navigate = useNavigate();
  const { podeEditar, podeCriar, podeVisualizarTudo } = usePermissao();
  const { usuario } = useAuth();
  const usuarioLogadoId = usuario?.userId;

  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [status, setStatus] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [materiaSelecionada, setMateriaSelecionada] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [sprintSelecionada, setSprintSelecionada] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  const [sprintsFiltradas, setSprintsFiltradas] = useState([]);

  const limparFiltro = filtro.length > 0;

  /** 🔍 Carrega os dados iniciais otimizando requisições */
  const carregarDados = useCallback(async () => {
    try {
      let listaTarefas, listaMaterias, listaStatus, listaUsuarios, listaSprints;

      if (podeVisualizarTudo) {
        listaTarefas = await TarefaApi.listarAsync(true);
        listaUsuarios = await UsuarioApi.listarAsync(true);
        setUsuarios(listaUsuarios);

        if (usuarioSelecionado) {
          listaMaterias = await MateriaApi.listarPorUsuarioAsync(usuarioSelecionado, true);
          listaSprints = await SprintApi.listarPorUsuarioAsync(usuarioSelecionado, true);
          listaStatus = await TarefaApi.listarStatusTarefaAsync();
        } else {
          listaMaterias = [];
          listaSprints = [];
          listaStatus = [];
        }
      } else {
        listaTarefas = await TarefaApi.listarPorUsuarioAsync(usuarioLogadoId, true);
        listaMaterias = await MateriaApi.listarPorUsuarioAsync(usuarioLogadoId, true);
        listaSprints = await SprintApi.listarPorUsuarioAsync(usuarioLogadoId, true);
        listaStatus = await TarefaApi.listarStatusTarefaAsync();
      }

      setTarefas(listaTarefas);
      setMaterias(listaMaterias);
      setSprints(listaSprints);
      setStatus(listaStatus);
      console.log("✅ Dados carregados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    }
  }, [podeVisualizarTudo, usuarioLogadoId, usuarioSelecionado]);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        if (podeVisualizarTudo) {
          setUsuarios(await UsuarioApi.listarAsync(true));
        }
        setMaterias(await MateriaApi.listarPorUsuarioAsync(usuarioSelecionado || usuarioLogadoId, true));
        setSprints(await SprintApi.listarPorUsuarioAsync(usuarioSelecionado || usuarioLogadoId, true));
        setStatus(await TarefaApi.listarStatusTarefaAsync());
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };
    carregarDadosIniciais();
    carregarDados();
  }, [usuarioSelecionado, carregarDados, podeVisualizarTudo, usuarioLogadoId]);

  useEffect(() => {
    if (podeVisualizarTudo && usuarioSelecionado) {
      (async () => {
        try {
          const materiasUsuario = await MateriaApi.listarPorUsuarioAsync(usuarioSelecionado, true);
          const sprintsUsuario = await SprintApi.listarPorUsuarioAsync(usuarioSelecionado, true);
          setMateriasFiltradas(materiasUsuario);
          setSprintsFiltradas(sprintsUsuario);
        } catch (error) {
          console.error("❌ Erro ao carregar matérias/sprints do usuário selecionado:", error);
        }
      })();
    } else {
      setMateriasFiltradas(materias);
      setSprintsFiltradas(sprints);
    }
  }, [usuarioSelecionado, podeVisualizarTudo, materias, sprints]);

  /** 📌 Mapeia usuários / matérias / sprints / status para facilitar a exibição na tabela */
  const materiasMap = materias.reduce((map, materia) => {
    map[materia.id] = materia.nome;
    return map;
  }, {});

  const sprintsMap = sprints.reduce((map, sprint) => {
    map[sprint.id] = sprint.nome;
    return map;
  }, {});

  const statusMap = status.reduce((map, s) => {
    map[s.id] = s.nome;
    return map;
  }, {});

  /** 🎯 Filtragem otimizada */
  const tarefasFiltradas = tarefas.filter((tarefa) =>
    (!usuarioSelecionado || materiasFiltradas.some(m => m.id === tarefa.materiaId)) &&
    (!usuarioSelecionado || sprintsFiltradas.some(m => m.id === tarefa.sprintId)) &&
    (!materiaSelecionada || tarefa.materiaId === parseInt(materiaSelecionada)) &&
    (!sprintSelecionada || tarefa.sprintId === parseInt(sprintSelecionada)) &&
    (!statusSelecionado || tarefa.status === parseInt(statusSelecionado)) &&
    (!filtro || tarefa.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      tarefa.descricao.toLowerCase().includes(filtro.toLowerCase()))
  );

  /** 🎯 Manipuladores */
  const handleChangeFiltro = (e) => setFiltro(e.target.value.toLowerCase());
  const handleLimparBusca = () => setFiltro("");
  const handleChangeUsuario = (e) => setUsuarioSelecionado(e.target.value);
  const handleChangeMateria = (e) => setMateriaSelecionada(e.target.value);
  const handleChangeSprint = (e) => setSprintSelecionada(e.target.value);
  const handleChangeStatus = (e) => setStatusSelecionado(e.target.value);
  const handleEditar = (id) => navigate(`/tarefa/atualizar/${id}`);
  const handleClickDeletar = (tarefa) => {
    setTarefaSelecionada(tarefa);
    setMostrarModal(true);
  };

  /** 🚀 Exclui a tarefa */
  const handleDeletar = async () => {
    try {
      await TarefaApi.deletarAsync(tarefaSelecionada.id);
      setTarefas(tarefas.filter((t) => t.id !== tarefaSelecionada.id));
    } catch (error) {
      console.error("❌ Erro ao deletar tarefa", error);
    } finally {
      setMostrarModal(false);
      setTarefaSelecionada(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.tarefaContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Tarefas</h2>
          <div className={styles.searchContainer}>
            <Form.Control
              type="text"
              placeholder="Buscar tarefa"
              value={filtro}
              onChange={handleChangeFiltro}
              className={styles.searchInput}
            />
            {limparFiltro && <button className={styles.buttonLimparFiltro} onClick={handleLimparBusca}>X</button>}

            {podeVisualizarTudo && (
              <Form.Select
                className={styles.selectTarefa}
                name="selectUsuario"
                value={usuarioSelecionado}
                onChange={handleChangeUsuario}>
                <option value="">Todos os Usuários</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                ))}
              </Form.Select>
            )}

            <Form.Select
              className={styles.selectTarefa}
              name="selectMateria"
              value={materiaSelecionada}
              onChange={handleChangeMateria}
              disabled={podeVisualizarTudo && !usuarioSelecionado}>
              <option value="">Todas as Matérias</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>{materia.nome}</option>
              ))}
            </Form.Select>

            <Form.Select
              className={styles.selectTarefa}
              name="selectSprint"
              value={sprintSelecionada}
              onChange={handleChangeSprint}
              disabled={podeVisualizarTudo && !usuarioSelecionado}>
              <option value="">Todas as Sprints</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>{sprint.nome}</option>
              ))}
            </Form.Select>

            <Form.Select
              className={styles.selectTarefa}
              name="selectStatus"
              value={statusSelecionado}
              onChange={handleChangeStatus}
              disabled={podeVisualizarTudo && !usuarioSelecionado}>
              <option value="">Todos os Status</option>
              {status.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </Form.Select>

            {podeCriar && (
              <Button
                className={styles.addTarefaButton}
                onClick={() => navigate("/tarefa/nova")}>+ Tarefa</Button>
            )}
          </div>

          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Matéria</th>
                  <th>Sprint</th>
                  <th>Status</th>
                  <th className={styles.tabela_colunaAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefasFiltradas.map((tarefa) => (
                  <tr key={tarefa.id}>
                    <td>{tarefa.titulo}</td>
                    <td>{tarefa.descricao}</td>
                    <td>{tarefa.nomeMateria || materiasMap[tarefa.materiaId] || "Desconhecida"}</td>
                    <td>{tarefa.nomeSprint || sprintsMap[tarefa.sprintId] || "Não definida"}</td>
                    <td>{statusMap[tarefa.status] || "Desconhecido"}</td>
                    <td className={styles.actionIcons}>
                      {podeEditar && <FaEdit onClick={() => handleEditar(tarefa.id)} />}
                      {podeEditar && <FaTrash onClick={() => handleClickDeletar(tarefa)} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* 🗑️ Modal de confirmação para exclusão */}
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.modalTitle}>Confirmar</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            Tem certeza que deseja deletar a tarefa {tarefaSelecionada?.titulo}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default Tarefa;