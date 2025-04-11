import { useState, useEffect } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./TarefaNova.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import MateriaApi from "../../services/materiaApi";
import SprintApi from "../../services/sprintApi";
import TarefaApi from "../../services/tarefaApi";
import UsuarioApi from "../../services/usuarioApi";

const TarefaNova = () => {
  const { usuario } = useAuth();
  const { podeCriar, podeVisualizarTudo } = usePermissao();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    materiaId: "",
    sprintId: ""
  });

  const [materias, setMaterias] = useState([]);
  const [sprints, setSprints] = useState([]);  
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (podeVisualizarTudo) {
      UsuarioApi.listarAsync(true).then(setUsuarios).catch(console.error);
    }
  }, [podeVisualizarTudo]);
  
  useEffect(() => {
    const carregarDadosUsuario = async (userId) => {
      try {
        const materiasUsuario = await MateriaApi.listarPorUsuarioAsync(userId, true);
        const sprintsUsuario = await SprintApi.listarPorUsuarioAsync(userId, true);
        
        setMaterias(materiasUsuario);
        setSprints(sprintsUsuario);        
      } catch (error) {
        console.error(error);
      }
    };

    if (podeVisualizarTudo && usuarioSelecionado) {
      carregarDadosUsuario(usuarioSelecionado);
    } else {
      carregarDadosUsuario(usuario.userId);
    }
  }, [usuarioSelecionado, usuario.userId, podeVisualizarTudo]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descricao || !formData.materiaId || !formData.sprintId) {
      setMensagem({ tipo: "danger", texto: "Preencha todos os campos obrigatórios." });
      return;
    }

    try {
      await TarefaApi.criarAsync(formData.titulo, formData.descricao, formData.materiaId, formData.sprintId);
      setMensagem({ tipo: "success", texto: "Tarefa criada com sucesso!" });
      setTimeout(() => navigate("/tarefa"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao criar tarefa." });
    }
  };

  const handleChangeUsuario = (e) => setUsuarioSelecionado(e.target.value);

  return (
    <PageContainer>
      <div className={styles.novaTarefaContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Nova Tarefa</h2>
          {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}
          <div className={styles.formContainer}>
            <Form onSubmit={handleSubmit}>

              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    placeholder="Digite o título... (3 a 100 caracteres)" 
                    type="text" 
                    name="titulo" 
                    value={formData.titulo} 
                    onChange={handleChange} 
                    required />
                </Form.Group>

                {podeVisualizarTudo && (
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Usuário</Form.Label>
                    <Form.Select 
                      name="usuarioId" 
                      value={usuarioSelecionado} 
                      onChange={handleChangeUsuario} 
                      required>
                      <option value="">Selecione o usuário</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </div>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Descrição</Form.Label>
                <Form.Control 
                  as="textarea"
                  placeholder="Digite a descrição... (3 a 250 caracteres)"
                  rows={4} 
                  name="descricao" 
                  value={formData.descricao} 
                  onChange={handleChange} required />
              </Form.Group>

              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Matéria</Form.Label>
                  <Form.Select 
                    name="materiaId" 
                    value={formData.materiaId} 
                    onChange={handleChange} 
                    required
                    disabled={podeVisualizarTudo && !usuarioSelecionado}
                    >
                    <option value="">Selecione a matéria</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>


                <Form.Group className={styles.formGroup}>
                  <Form.Label>Sprint</Form.Label>
                  <Form.Select 
                    name="sprintId" 
                    value={formData.sprintId} 
                    onChange={handleChange} 
                    required
                    disabled={podeVisualizarTudo && !usuarioSelecionado}
                    >
                    <option value="">Selecione o sprint</option>
                    {sprints.map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
               
              </div>
              <div className={styles.formRow}></div>

              <div className={styles.buttonContainer}>
                <Button className={styles.buttonCriar} type="submit" disabled={!podeCriar}>Criar</Button>
                <Button className={styles.buttonCancelar} variant="secondary" onClick={() => navigate("/tarefa")} >Cancelar</Button>
              </div>

            </Form>
          </div>
        </div>
      </div>
    </PageContainer>

  );
};

export default TarefaNova;
