import { useState, useEffect, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao"; // ✅ Hook para permissões
import useAuth from "../../hooks/useAuth"; // ✅ Importa o contexto de autenticação
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Simulado.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import MateriaApi from "../../services/materiaApi";
import UsuarioApi from "../../services/usuarioApi";
import SimuladoApi from "../../services/_simuladoApi";
import Modal from "react-bootstrap/Modal";

const Simulado = () => {
  const navigate = useNavigate();
  const { podeEditar, podeCriar, podeVisualizarTudo } = usePermissao(); // ✅ Obtém permissões do usuário logado
  const { usuario } = useAuth(); // ✅ Obtém usuário logado
  const usuarioLogadoId = usuario?.userId; // ✅ Obtém o ID do usuário logado

  const [simulados, setSimulados] = useState([]);
  const [simuladoSelecionado, setSimuladoSelecionado] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const limparFiltro = filtro.length > 0;

  /** 🔍 Função para carregar os dados corretamente com base no usuário */
  const carregarDados = useCallback(async () => {
    try {
      const listaSimulados = podeVisualizarTudo
        ? await SimuladoApi.listarAsync(true)
        : await SimuladoApi.listarPorUsuarioAsync(usuarioLogadoId, true);

      const listaUsuarios = podeVisualizarTudo ? await UsuarioApi.listarAsync(true) : [];
      const listaMaterias = podeVisualizarTudo
        ? await MateriaApi.listarAsync(true)
        : await MateriaApi.listarPorUsuarioAsync(usuarioLogadoId, true);

      setSimulados(listaSimulados);
      setUsuarios(listaUsuarios);
      setMaterias(listaMaterias);
      setMateriasFiltradas(listaMaterias);
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    }
  }, [podeVisualizarTudo, usuarioLogadoId]);

  /** 🔄 Carrega os dados ao montar o componente */
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (podeVisualizarTudo && usuarioSelecionado) {
      const carregarMateriasUsuario = async () => {
        const materiasUsuario = await MateriaApi.listarPorUsuarioAsync(usuarioSelecionado, true);
        setMateriasFiltradas(materiasUsuario);
      };
      carregarMateriasUsuario();
    } else {
      setMateriasFiltradas(materias);
    }
  }, [usuarioSelecionado, materias, podeVisualizarTudo]);

  /** 📌 Mapeia usuários / matérias para facilitar a exibição na tabela */
  const materiasMap = materias.reduce((map, materia) => {
    map[materia.id] = materia.nome;
    return map;
  }, {});
  const usuariosMap = usuarios.reduce((map, usuario) => {
    map[usuario.id] = usuario.nome;
    return map;
  }, {});

  /** 🔍 Aplica os filtros conforme o usuário / materia selecionado(a) e o texto digitado */
  const simuladosFiltrados = simulados.filter((simulado) => {
    return (
      (usuarioSelecionado === "" || simulado.usuarioId === parseInt(usuarioSelecionado)) &&
      (materiaSelecionada === "" || simulado.materiaId === parseInt(materiaSelecionada)) &&
      (filtro === "" || simulado.nome.toLowerCase().includes(filtro) || simulado.dataAplicacao.toLowerCase().includes(filtro))
    );
  });

  /** 🎯 Manipuladores */
  const handleChangeFiltro = (e) => setFiltro(e.target.value.toLowerCase());
  const handleLimparBusca = () => setFiltro("");
  const handleChangeUsuario = (e) => setUsuarioSelecionado(e.target.value);
  const handleChangeMateria = (e) => setMateriaSelecionada(e.target.value);
  const handleEditar = (id) => navigate(`/simulado/atualizar/${id}`);
  const handleClickDeletar = (simulado) => {
    setSimuladoSelecionado(simulado);
    setMostrarModal(true);
  };

  /** 🚀 Exclui a matéria */
  const handleDeletar = async () => {
    try {
      await SimuladoApi.deletarAsync(simuladoSelecionado.id);
      setSimulados(simulados.filter((s) => s.id !== simuladoSelecionado.id));
    } catch (error) {
      console.error("❌ Erro ao deletar simulado", error);
    } finally {
      setMostrarModal(false);
      setSimuladoSelecionado(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.simuladoContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Simulados</h2>

          {/* 🔍 Barra de busca e seleção de usuário */}
          <div className={styles.searchContainer}>
            <Form.Control
              type="text"
              name="filtro"
              placeholder="Buscar simulado"
              value={filtro}
              onChange={handleChangeFiltro}
              className={styles.searchInput}
            />
            {limparFiltro && (
              <button className={styles.buttonLimparFiltro} onClick={handleLimparBusca}>X</button>
            )}

            {/* 🔹 Select de usuários - Somente Administrador pode ver */}
            {podeVisualizarTudo && (
              <Form.Select
                className={styles.selectSimulado}
                name="selectUsuario"
                value={usuarioSelecionado}
                onChange={handleChangeUsuario}>

                <option value="">Todos os Usuários</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </Form.Select>
            )}

            {/* 🔹 Select de matéria - Pode Editar*/}
            {podeEditar && (
              <Form.Select
                className={styles.selectSimulado}
                name="selectMateria"
                value={materiaSelecionada}
                onChange={handleChangeMateria}>

                <option value="">Todas as Matérias</option>
                {materiasFiltradas.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nome}
                  </option>
                ))}
              </Form.Select>
            )}

            {/* 🆕 Botão Criar Simulado - Só aparece se podeCriar */}
            {podeCriar && (
              <Button
                className={styles.addSimuladoButton}
                onClick={() => navigate("/simulado/novo")}>
                + Simulado
              </Button>
            )}
          </div>

          {/* 📋 Tabela de simulados */}
          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data Aplicação</th>
                  {podeVisualizarTudo && <th>Usuário</th>}
                  <th>Matéria</th>
                  <th>Total Questões</th>
                  <th>Total Acertos</th>
                  <th>Aproveitamento</th>
                  <th className={styles.tabela_colunaAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {simuladosFiltrados.map((simulado) => (
                  <tr key={simulado.id}>
                    <td>{simulado.nome}</td>
                    <td>{new Date(simulado.dataAplicacao).toLocaleDateString("pt-BR")}</td>
                    {podeVisualizarTudo && <td>{usuariosMap[simulado.usuarioId] ?? "Desconhecido"}</td>}
                    <td>{materiasMap[simulado.materiaId] ?? "Desconhecida"}</td>
                    <td>{simulado.totalQuestoes}</td>
                    <td>{simulado.totalAcertos}</td>
                    <td>{`${simulado.percentualAproveitamento.toFixed(2)}%`}</td>
                    <td className={styles.actionIcons}>
                      {podeEditar && <FaEdit onClick={() => handleEditar(simulado.id)} />}
                      {podeEditar && <FaTrash onClick={() => handleClickDeletar(simulado)}
                        aria-label={`Deletar simulado ${simulado.nome}`} />}
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
            Tem certeza que deseja deletar o simulado {simuladoSelecionado?.nome}?
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

export default Simulado;
