import { useState, useEffect } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { Table, Button, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import styles from "./SessaoEstudo.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import ModalSessaoEstudo from "../../components/ModalSessaoEstudo/ModalSessaoEstudo";
import CicloPomodoroApi from "../../services/cicloPomodoroApi";
import MateriaApi from "../../services/materiaApi";
import SprintApi from "../../services/sprintApi";
import Modal from "react-bootstrap/Modal";
import useTarefasPomodoro from "../../hooks/useTarefasPomodoro";

const SessaoEstudo = () => {

  const { podeCriar, podeVisualizarTudo } = usePermissao();
  const { usuario } = useAuth();
  const usuarioLogadoId = usuario?.userId;
  const { tarefas, loading: loadingTarefas, carregarTarefas } = useTarefasPomodoro(usuarioLogadoId);

  const [sessoes, setSessoes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState("");
  const [sprintSelecionada, setSprintSelecionada] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSessao, setMostrarModalSessao] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState(null);

  const carregarSessoes = async () => {
    try {
      const listaSessoes = await (podeVisualizarTudo
        ? CicloPomodoroApi.listarAsync(true)
        : CicloPomodoroApi.listarPorUsuarioAsync(usuarioLogadoId, true));

      setSessoes(listaSessoes || []);
      return listaSessoes; // Adicionado retorno
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
      setSessoes([]);
      return []; // Retorna array vazio em caso de erro
    }
  };



  // Carregar dados iniciais
  useEffect(() => {
    const carregarTudo = async () => {
      try {
        // Corrigido: Agora passamos 3 promises para o Promise.all
        const [listaSessoes, listaMaterias, listaSprints] = await Promise.all([
          carregarSessoes(),
          MateriaApi.listarPorUsuarioAsync(usuarioLogadoId, true),
          SprintApi.listarPorUsuarioAsync(usuarioLogadoId, true),
        ]);

        // Já estamos setando sessoes dentro de carregarSessoes()
        setMaterias(listaMaterias || []);
        setSprints(listaSprints || []);
        
        await carregarTarefas();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setSessoes([]);
        setMaterias([]);
        setSprints([]);
      }
    };

    carregarTudo();
  }, [usuarioLogadoId, podeVisualizarTudo, carregarTarefas]);


  /** 📌 Mapeia matérias e sprints para facilitar a exibição */
  const materiasMap = materias.reduce((map, materia) => {
    map[materia.id] = materia.nome;
    return map;
  }, {});

  const sprintsMap = sprints.reduce((map, sprint) => {
    map[sprint.id] = sprint.nome;
    return map;
  }, {});

  /** 🎯 Filtragem otimizada */
  const sessoesFiltradas = (sessoes || []).filter((sessao) =>
    (!materiaSelecionada || sessao.materiaId === parseInt(materiaSelecionada)) &&
    (!sprintSelecionada || sessao.sprintId === parseInt(sprintSelecionada))
  );

  const handleDeletar = async () => {
    try {
      await CicloPomodoroApi.deletarAsync(sessaoSelecionada.id);
      setSessoes((prev) => prev.filter((s) => s.id !== sessaoSelecionada.id));
    } catch (error) {
      console.error("Erro ao deletar sessão", error);
    } finally {
      setMostrarModal(false);
      setSessaoSelecionada(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.sessaoContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Sessões de Estudo</h2>
          <div className={styles.filters}>
            <Form.Select
              className={styles.selectSessao}
              value={materiaSelecionada}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
            >
              <option value="">Todas as Matérias</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>{materia.nome}</option>
              ))}
            </Form.Select>

            <Form.Select
              className={styles.selectSessao}
              value={sprintSelecionada}
              onChange={(e) => setSprintSelecionada(e.target.value)}
            >
              <option value="">Todos os Sprints</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>{sprint.nome}</option>
              ))}
            </Form.Select>

            {podeCriar && (
              <Button className={styles.addButton} onClick={() => setMostrarModalSessao(true)}>
                + Sessão
              </Button>
            )}
          </div>

          <div className={styles.tableContainer}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Matéria</th>
                  <th>Sprint</th>
                  <th>Duração (min)</th>
                  <th>Data</th>
                  <th className={styles.tabela_colunaAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoesFiltradas.map((sessao) => (
                  <tr key={sessao.id}>
                    <td>{materiasMap[sessao.materiaId] || "-"}</td>
                    <td>{sprintsMap[sessao.sprintId] || "-"}</td>
                    <td>{sessao.duracao}</td>
                    <td>{new Date(sessao.dataRegistro).toLocaleDateString()}</td>
                    <td className={styles.actionIcons}>
                      <FaTrash onClick={() => { setSessaoSelecionada(sessao); setMostrarModal(true); }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.modalTitle}>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>Tem certeza que deseja deletar esta sessão de estudo?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
          </Modal.Footer>
        </Modal>

        <ModalSessaoEstudo
          show={mostrarModalSessao}
          onClose={() => setMostrarModalSessao(false)} // ✅ Aqui está o fix!
          onSessaoCriada={() => {
            carregarTarefas();
            carregarSessoes();
          }}
          materias={materias}
          sprints={sprints}
          tarefas={tarefas}
        />

      </div>
    </PageContainer>
  );
};

export default SessaoEstudo;
