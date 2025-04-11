import { useEffect, useState, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./SprintAtualizar.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import SprintApi from "../../services/sprintApi";

const SprintAtualizar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { podeEditar, podeVisualizarTudo } = usePermissao();

  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    usuarioId: "",
    dataInicio: "",
    dataFim: "",
  });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [initialData, setInitialData] = useState(null);

  const carregarDados = useCallback(async () => {
    try {
      const [sprint, listaUsuarios] = await Promise.all([
        SprintApi.obterAsync(id),
        UsuarioApi.listarAsync(true),
      ]);

      if (!sprint) {
        setMensagem({ tipo: "danger", texto: "Sprint não encontrada." });
        setTimeout(() => navigate("/sprint"), 800);
        return;
      }

      setUsuarios(listaUsuarios);
      setFormData({
        nome: sprint.nome,
        usuarioId: sprint.usuarioId,
        dataInicio: sprint.dataInicio.split("T")[0],
        dataFim: sprint.dataFim.split("T")[0],
      });
      setInitialData(sprint);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao buscar dados." });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) carregarDados();
  }, [id, carregarDados]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    if (!initialData) return false;
    if (new Date(formData.dataFim) < new Date(formData.dataInicio)) {
      return false;
    }
    return (
      formData.nome.length >= 3 &&
      formData.usuarioId !== "" &&
      (formData.nome !== initialData.nome ||
        formData.usuarioId !== initialData.usuarioId ||
        formData.dataInicio !== initialData.dataInicio ||
        formData.dataFim !== initialData.dataFim)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    try {
      await SprintApi.atualizarAsync(id, formData.nome, formData.usuarioId, formData.dataInicio, formData.dataFim);
      setMensagem({ tipo: "success", texto: "Sprint atualizada com sucesso!" });
      setTimeout(() => navigate("/sprint"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao atualizar sprint." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.sprintAtualizarContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Editar Sprint</h2>
          {mensagem.texto && <Alert className={styles.alertMessage} variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <Form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required disabled={!podeEditar} />
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Usuário</Form.Label>
                <Form.Select name="usuarioId" value={formData.usuarioId} onChange={handleChange} required disabled={!podeVisualizarTudo}>
                  <option value="">Selecione o usuário</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Data de Início</Form.Label>
                <Form.Control type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Data de Fim</Form.Label>
                <Form.Control type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} required />
                {new Date(formData.dataFim) < new Date(formData.dataInicio) && (
                  <Alert variant="danger" className={styles.alertMessage}>
                    A data de fim não pode ser menor que a data de início.
                  </Alert>
                )}
              </Form.Group>
            </div>

            <div className={styles.buttonContainer}>
              {podeEditar && <Button variant="success" type="submit" disabled={!isFormValid()} className={styles.buttonSalvar}>Salvar</Button>}
              <Button variant="secondary" onClick={() => navigate("/sprint")} className={styles.buttonCancelar}>Cancelar</Button>
            </div>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default SprintAtualizar;
