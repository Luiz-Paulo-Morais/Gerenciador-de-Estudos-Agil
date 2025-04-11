import { useEffect, useState, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./TarefaAtualizar.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import MateriaApi from "../../services/materiaApi";
import SprintApi from "../../services/sprintApi";
import TarefaApi from "../../services/tarefaApi";

const TarefaAtualizar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { podeEditar, podeVisualizarTudo } = usePermissao();

  const [usuario, setUsuario] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [status, setStatus] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    usuarioId: "",
    materiaId: "",
    sprintId: "",
    status: "",
  });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [initialData, setInitialData] = useState(null);


  /**
   * Carrega os dados iniciais da tarefa e do usuário relacionado.
   */
  const carregarDados = useCallback(async () => {
    try {
      const tarefa = await TarefaApi.obterAsync(id);
      if (!tarefa) {
        setMensagem({ tipo: "danger", texto: "Tarefa não encontrada." });
        setTimeout(() => navigate("/tarefa"), 800);
        return;
      }
  
      // Extrai corretamente o usuarioId do objeto retornado pela API
      const { usuarioId } = await TarefaApi.ObterUsuarioIdPorTarefaAsync(id);
      const usuarioIdValido = typeof usuarioId === "number" ? usuarioId : null;
      if (podeVisualizarTudo) {
        UsuarioApi.obterAsync(usuarioIdValido).then(setUsuario).catch(console.error);
      }
  
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        usuarioId: usuarioIdValido,
        materiaId: tarefa.materiaId || "",
        sprintId: tarefa.sprintId || "",
        status: typeof tarefa.status === "number" ? tarefa.status : parseInt(tarefa.status),
      });
  
      setInitialData(tarefa);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setMensagem({ tipo: "danger", texto: "Erro ao buscar dados." });
    }
  }, [id, navigate, podeVisualizarTudo]);
  


  useEffect(() => {
    if (id) carregarDados();
  }, [id, carregarDados]);


  /**
   * Carrega as matérias e sprints apenas quando o usuário for definido.
   */
  useEffect(() => {
    const carregarMateriasEStatus = async () => {
      if (formData.usuarioId && typeof formData.usuarioId === "number") {
        try {
          const [materiasList, sprintsList, statusList] = await Promise.all([
            MateriaApi.listarPorUsuarioAsync(formData.usuarioId, true),
            SprintApi.listarPorUsuarioAsync(formData.usuarioId, true),
            TarefaApi.listarStatusTarefaAsync(),
          ]);
          setMaterias(materiasList);
          setSprints(sprintsList);
          setStatus(statusList);
        } catch (error) {
          console.error("Erro ao carregar matérias ou sprints:", error);
        }
      }
    };

    carregarMateriasEStatus();
  }, [formData.usuarioId]);


  const handleChange = ({ target: { name, value } }) => {
    const novoValor = name === "status" ? parseInt(value) : value;
  
    setFormData((prev) => ({
      ...prev,
      [name]: novoValor
    }));    
  };
  
  

  const isFormValid = () => {
    if (!initialData) return false;
    const { titulo, descricao, materiaId, sprintId, status } = formData;
    return (
      titulo.length >= 3 &&
      descricao &&
      materiaId &&
      sprintId &&
      status !== "" &&
      (
        titulo !== initialData.titulo ||
        descricao !== initialData.descricao ||
        materiaId !== initialData.materiaId ||
        sprintId !== initialData.sprintId ||
        status !== Number(initialData.status)
      )
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }
    try {
      await TarefaApi.atualizarAsync(id, formData.titulo, formData.descricao, formData.materiaId, formData.sprintId, formData.status);
      setMensagem({ tipo: "success", texto: "Tarefa atualizada com sucesso!" });
      setTimeout(() => navigate("/tarefa"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao atualizar tarefa." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.tarefaAtualizarContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Editar Tarefa</h2>
          {mensagem.texto && <Alert className={styles.alertMessage} variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <Form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required disabled={!podeEditar} />
              </Form.Group>


              <Form.Group className={styles.formGroup}>
                <Form.Label>Usuário</Form.Label>
                <Form.Control
                  type="text"
                  name="usuarioId"
                  value={usuario.nome}
                  disabled />
              </Form.Group>

            </div>

            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Matéria</Form.Label>
                <Form.Select name="materiaId" value={formData.materiaId} onChange={handleChange} required>
                  {materias.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Sprint</Form.Label>
                <Form.Select name="sprint" value={formData.sprintId} onChange={handleChange} required>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                  {status.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <Form.Group className={styles.formGroup}>
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" name="descricao" value={formData.descricao} onChange={handleChange} required />
            </Form.Group>

            <div className={styles.buttonContainer}>
              <Button className={styles.buttonSalvar} variant="success" type="submit" disabled={!isFormValid()}>
                Salvar
              </Button>
              <Button className={styles.buttonCancelar} variant="secondary" onClick={() => navigate("/tarefa")}>Cancelar</Button>
            </div>

          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default TarefaAtualizar;
