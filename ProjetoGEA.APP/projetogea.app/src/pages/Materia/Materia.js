import { useState, useEffect, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao"; // ✅ Hook para permissões
import useAuth from "../../hooks/useAuth"; // ✅ Importa o contexto de autenticação
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Materia.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import MateriaApi from "../../services/materiaApi";
import UsuarioApi from "../../services/usuarioApi";
import Modal from "react-bootstrap/Modal";

const Materia = () => {
  const navigate = useNavigate();
  const { podeEditar, podeCriar, podeVisualizarTudo } = usePermissao(); // ✅ Obtém permissões do usuário logado
  const { usuario } = useAuth(); // ✅ Obtém usuário logado
  const usuarioLogadoId = usuario?.userId; // ✅ Obtém o ID do usuário logado

  const [materias, setMaterias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(""); // "" significa "Todos os usuários"
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);

  const limparFiltro = filtro.length > 0;

  /** 🔍 Função para carregar os dados corretamente com base no usuário */
  const carregarDados = useCallback(async () => {
    try {
      let listaMaterias;
      if (podeVisualizarTudo) {
        console.log("🔹 Administrador: buscando todas as matérias...");
        listaMaterias = await MateriaApi.listarAsync(true); // ✅ Administrador vê tudo
      } else {
        console.log("🔹 Usuário Padrão: buscando apenas suas matérias...");
        listaMaterias = await MateriaApi.listarPorUsuarioAsync(usuarioLogadoId, true); // ✅ Usuário vê só as suas
      }

      const listaUsuarios = await UsuarioApi.listarAsync(true);
      setMaterias(listaMaterias);
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    }
  }, [podeVisualizarTudo, usuarioLogadoId]);

  /** 🔄 Carrega os dados ao montar o componente */
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /** 📌 Mapeia usuários para facilitar a exibição na tabela */
  const usuariosMap = usuarios.reduce((map, usuario) => {
    map[usuario.id] = usuario.nome;
    return map;
  }, {});

  /** 🔍 Aplica os filtros conforme o usuário selecionado e o texto digitado */
  const materiasFiltradas = materias.filter((materia) => {
    const correspondeAoUsuario = usuarioSelecionado === "" || materia.usuarioId === parseInt(usuarioSelecionado);
    const correspondeAoFiltro = filtro === "" ||
      materia.nome.toLowerCase().includes(filtro) ||
      materia.descricao.toLowerCase().includes(filtro);

    return correspondeAoUsuario && correspondeAoFiltro;
  });

  /** 🎯 Manipuladores */
  const handleChangeFiltro = (e) => setFiltro(e.target.value.toLowerCase());
  const handleLimparBusca = () => setFiltro("");
  const handleChangeUsuario = (e) => setUsuarioSelecionado(e.target.value);
  const handleEditar = (id) => navigate(`/materia/atualizar/${id}`);
  const handleClickDeletar = (materia) => {
    setMateriaSelecionada(materia);
    setMostrarModal(true);
  };

  /** 🚀 Exclui a matéria */
  const handleDeletar = async () => {
    try {
      await MateriaApi.deletarAsync(materiaSelecionada.id);
      setMaterias(materias.filter((m) => m.id !== materiaSelecionada.id));
    } catch (error) {
      console.error("❌ Erro ao deletar matéria", error);
    } finally {
      setMostrarModal(false);
      setMateriaSelecionada(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.materiaContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Matérias</h2>

          {/* 🔍 Barra de busca e seleção de usuário */}
          <div className={styles.searchContainer}>
            <Form.Control
              type="text"
              name="filtro"
              placeholder="Buscar matéria"
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
                className={styles.selectUsuario} 
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

            {/* 🆕 Botão Criar Matéria - Só aparece se podeCriar */}
            {podeCriar && (
              <Button 
                className={styles.addMateriaButton} 
                onClick={() => navigate("/materia/nova")}>
                Nova Matéria
              </Button>
            )}
          </div>

          {/* 📋 Tabela de matérias */}
          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Usuário</th>
                  <th className={styles.tabela_colunaAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiasFiltradas.map((materia) => (
                  <tr key={materia.id}>
                    <td>{materia.nome}</td>
                    <td>{materia.descricao}</td>
                    <td>{usuariosMap[materia.usuarioId] ?? "Desconhecido"}</td>
                    <td className={styles.actionIcons}>
                      {podeEditar && <FaEdit onClick={() => handleEditar(materia.id)} />}
                      {podeEditar && <FaTrash onClick={() => handleClickDeletar(materia)} 
                        aria-label={`Deletar matéria ${materia.nome}`} />}
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
            Tem certeza que deseja deletar a matéria {materiaSelecionada?.nome}?
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

export default Materia;
