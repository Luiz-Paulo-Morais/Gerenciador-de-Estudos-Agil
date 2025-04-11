import { useState, useEffect } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./SimuladoNovo.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import MateriaApi from "../../services/materiaApi";
import SimuladoApi from "../../services/_simuladoApi";

const SimuladoNovo = () => {
  const { usuario } = useAuth();
  const { podeCriar, podeVisualizarTudo } = usePermissao();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    dataAplicacao: "",
    materiaId: "",
    totalQuestoes: "",
    totalAcertos: "",
    usuarioId: podeVisualizarTudo ? "" : usuario?.userId,
  });

  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (podeVisualizarTudo) {
      UsuarioApi.listarAsync(true).then(setUsuarios).catch(console.error);
    }
  }, [podeVisualizarTudo]);

  useEffect(() => {
    if (formData.usuarioId) {
      MateriaApi.listarPorUsuarioAsync(formData.usuarioId, true)
        .then(setMaterias)
        .catch(console.error);
    }
  }, [formData.usuarioId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.usuarioId || !formData.materiaId) {
      setMensagem({ tipo: "danger", texto: "Preencha todos os campos obrigatórios." });
      return;
    }

    const dadosSimulado = {
      ...formData,
      dataAplicacao: new Date(formData.dataAplicacao).toISOString(),
    };

    try {
      await SimuladoApi.criarAsync(dadosSimulado.nome, dadosSimulado.dataAplicacao, dadosSimulado.usuarioId, dadosSimulado.materiaId, dadosSimulado.totalQuestoes, dadosSimulado.totalAcertos);
      setMensagem({ tipo: "success", texto: "Simulado criado com sucesso!" });
      setTimeout(() => navigate("/simulado"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao criar simulado." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.novoSimuladoContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Novo Simulado</h2>
          {mensagem.texto && <Alert variant={mensagem.tipo} className={styles.alertMessage}>{mensagem.texto}</Alert>}

          <div className={styles.formContainer}>
            <Form onSubmit={handleSubmit}>

              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    placeholder="Digite nome do simulado" 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required />
                </Form.Group>

                {podeVisualizarTudo && (
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Usuário</Form.Label>
                    <Form.Select name="usuarioId" value={formData.usuarioId} onChange={handleChange} required>
                      <option value="">Selecione o usuário</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </div>

              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Data de Aplicação</Form.Label>
                  <Form.Control type="date" name="dataAplicacao" value={formData.dataAplicacao} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className={styles.formGroup}>
                  <Form.Label>Matéria</Form.Label>
                  <Form.Select name="materiaId" value={formData.materiaId} onChange={handleChange} required>
                    <option value="">Selecione a matéria</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Total de Questões</Form.Label>
                  <Form.Control type="number" name="totalQuestoes" min={1} max={100} value={formData.totalQuestoes} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className={styles.formGroup}>
                  <Form.Label>Total de Acertos</Form.Label>
                  <Form.Control type="number" name="totalAcertos" min={0} max={formData.totalQuestoes} value={formData.totalAcertos} onChange={handleChange} required />
                </Form.Group>
              </div>

              <div className={styles.buttonContainer}>
                <Button className={styles.buttonCriar} type="submit" disabled={!podeCriar}>Criar</Button>
                <Button className={styles.buttonCancelar} variant="secondary" onClick={() => navigate("/simulado")} >Cancelar</Button>
              </div>

            </Form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SimuladoNovo;
