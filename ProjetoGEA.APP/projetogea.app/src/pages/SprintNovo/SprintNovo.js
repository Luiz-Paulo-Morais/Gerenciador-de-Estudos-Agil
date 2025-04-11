import { useState, useEffect } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./SprintNovo.module.css";
import UsuarioApi from "../../services/usuarioApi";
import SprintApi from "../../services/sprintApi";
import PageContainer from "../../components/PageContainer/PageContainer";

const SprintNovo = () => {
  const { usuario } = useAuth();
  const { podeCriar, podeVisualizarTudo } = usePermissao();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    usuarioId: podeVisualizarTudo ? "" : usuario?.userId,
    dataInicio: "",
    dataFim: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    if (podeVisualizarTudo) {
      UsuarioApi.listarAsync(true).then(setUsuarios).catch(console.error);
    }
  }, [podeVisualizarTudo]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { nome, usuarioId, dataInicio, dataFim } = formData;

    const nomeValido = nome.length >= 3 && nome.length <= 25;
    const usuarioValido = podeVisualizarTudo ? usuarioId !== "" : true;
    const dataInicioValida = !!dataInicio;
    const dataFimValida = !!dataFim && new Date(dataFim) >= new Date(dataInicio);

    return nomeValido && usuarioValido && dataInicioValida && dataFimValida;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.usuarioId || !formData.dataInicio || !formData.dataFim) {
      setMensagem({ tipo: "danger", texto: "Preencha todos os campos obrigatórios." });
      return;
    }

    const dadosSprint = {
      ...formData,
      dataInicio: new Date(formData.dataInicio).toISOString(),
      dataFim: new Date(formData.dataFim).toISOString(),
    };

    try {
      await SprintApi.criarAsync(dadosSprint.nome, dadosSprint.usuarioId, dadosSprint.dataInicio, dadosSprint.dataFim);
      setMensagem({ tipo: "success", texto: "Sprint criada com sucesso!" });
      setTimeout(() => navigate("/sprint"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao criar sprint." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.novoSprintContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Nova Sprint</h2>
          {mensagem.texto && <Alert variant={mensagem.tipo} className={styles.alertMessage}>{mensagem.texto}</Alert>}

          <div className={styles.formContainer}>
            <Form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control 
                  type="text" name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                  placeholder="Nome: 3 a 25 caracteres"/>
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
                  <Form.Label>Data de Início</Form.Label>
                  <Form.Control type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className={styles.formGroup}>
                  <Form.Label>Data de Fim</Form.Label>
                  <Form.Control type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} required disabled={!formData.dataInicio} />
                  {formData.dataFim && new Date(formData.dataFim) < new Date(formData.dataInicio) && (
                    <Alert variant="danger" className={styles.alertMessage}>
                      A data de fim não pode ser menor que a data de início.
                    </Alert>
                  )}
                </Form.Group>
              </div>

              <div className={styles.buttonContainer}>
                <Button className={styles.buttonCriar} type="submit" disabled={!podeCriar || !isFormValid()}>Criar</Button>
                <Button className={styles.buttonCancelar} variant="secondary" onClick={() => navigate("/sprint")} >Cancelar</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SprintNovo;
