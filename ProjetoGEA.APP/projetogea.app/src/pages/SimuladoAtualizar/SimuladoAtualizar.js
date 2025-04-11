import { useEffect, useState, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import { useParams, useNavigate } from "react-router-dom"; // ✅ useParams para obter o ID com segurança
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./SimuladoAtualizar.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import MateriaApi from "../../services/materiaApi";
import SimuladoApi from "../../services/_simuladoApi";

const SimuladoAtualizar = () => {
  const { id } = useParams(); // ✅ Obtém o ID da URL
  const navigate = useNavigate();

  // 🔥 Obtém permissões do usuário logado
  const { podeEditar, podeVisualizarTudo} = usePermissao();

  // 🔥 Estado local
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    usuarioId: "",
  });
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [initialData, setInitialData] = useState(null);


  /** 🔍 Carrega os dados da matéria e dos usuários */
  const carregarDados = useCallback(async () => {
    try {
      if (podeVisualizarTudo) {
        console.log("🔹 Administrador: editando todos os simulados...");
      } else {
        console.log("🔹 Usuário Padrão: editando apenas seus simulados...");
      }
      const [simulado, listaUsuarios, listaMaterias] = await Promise.all([

        SimuladoApi.obterAsync(id),
        UsuarioApi.listarAsync(true),
        MateriaApi.listarAsync(true),
      ]);

      if (!simulado) {
        setMensagem({ tipo: "danger", texto: "Simulado não encontrado." });
        setTimeout(() => navigate("/simulado"), 800);
        return;
      }

      setUsuarios(listaUsuarios);
      setMaterias(listaMaterias);
      setFormData({
        nome: simulado.nome,
        dataAplicacao: simulado.dataAplicacao.split("T")[0],
        usuarioId: simulado.usuarioId,
        materiaId: simulado.materiaId,
        totalQuestoes: simulado.totalQuestoes,
        totalAcertos: simulado.totalAcertos,
      });
      setInitialData(simulado);

    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao buscar dados." });
    }
  }, [id, podeVisualizarTudo, navigate]);

  /** 🔄 Efeito para carregar os dados */
  useEffect(() => {
    if (id) carregarDados();
  }, [id, carregarDados]);

  useEffect(() => {
    if (formData.usuarioId) {
      MateriaApi.listarPorUsuarioAsync(formData.usuarioId, true)
        .then(setMaterias)
        .catch(console.error);
    }
  }, [formData.usuarioId]);

  /** 📌 Manipula mudanças nos campos */
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Valida o formulário */
  const isFormValid = () => {
    if (!initialData) return false;

    const { nome, dataAplicacao, usuarioId, materiaId,  totalQuestoes, totalAcertos} = formData;
    const nomeValido = nome.length >= 3 && nome.length <= 100;    
    const usuarioSelecionado = usuarioId !== "";
    const algumCampoAlterado =
      nome !== initialData.nome || dataAplicacao !== initialData.dataAplicacao || usuarioId !== initialData.usuarioId || materiaId !== initialData.materiaId || totalQuestoes !== initialData.totalQuestoes || totalAcertos !== initialData.totalAcertos;

    return nomeValido && usuarioSelecionado && algumCampoAlterado;
  };

  /** 🚀 Envia os dados atualizados */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    try {
      await SimuladoApi.atualizarAsync(id, formData.nome, formData.dataAplicacao, formData.usuarioId, formData.materiaId, formData.totalQuestoes, formData.totalAcertos);
      console.log("✅ Simulado enviado:", formData);
      setMensagem({ tipo: "success", texto: "Simulado atualizado com sucesso!" });
      setTimeout(() => navigate("/simulado"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao atualizar simulado." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.simuladoAtualizarContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Editar Simulado</h2>
          {mensagem.texto && <Alert className={styles.alertMessage} variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <Form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* Nome e Usuário na mesma linha */}
            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite nome do simulado"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={!podeEditar} // ❌ Impede edição caso não tenha permissão
                />
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <Form.Label>Usuário</Form.Label>
                <Form.Select
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleChange}
                  required
                  disabled={!podeVisualizarTudo} // ❌ Impede edição caso não tenha permissão
                >
                  <option value="">Selecione o usuário</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
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

            {/* Botões */}
            <div className={styles.buttonContainer}>
              {podeEditar && (<Button variant="success" type="submit" disabled={!isFormValid()} className={styles.buttonSalvar}>
                Salvar
              </Button>)}
              <Button variant="secondary" onClick={() => navigate("/simulado")} className={styles.buttonCancelar}>
                Cancelar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default SimuladoAtualizar;
