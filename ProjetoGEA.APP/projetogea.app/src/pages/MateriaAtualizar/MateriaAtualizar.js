import { useEffect, useState, useCallback } from "react";
import usePermissao from "../../hooks/usePermissao";
import { useParams, useNavigate } from "react-router-dom"; // ✅ useParams para obter o ID com segurança
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./MateriaAtualizar.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import MateriaApi from "../../services/materiaApi";

const MateriaAtualizar = () => {
  const { id } = useParams(); // ✅ Obtém o ID da URL
  const navigate = useNavigate();

  // 🔥 Obtém permissões do usuário logado
  const { podeEditar, podeVisualizarTudo} = usePermissao();

  // 🔥 Estado local
  const [usuarios, setUsuarios] = useState([]);
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
        console.log("🔹 Administrador: editando todas as matérias...");
      } else {
        console.log("🔹 Usuário Padrão: editando apenas suas matérias...");
      }
      const [materia, listaUsuarios] = await Promise.all([

        MateriaApi.obterAsync(id),
        UsuarioApi.listarAsync(true),
      ]);

      if (!materia) {
        setMensagem({ tipo: "danger", texto: "Matéria não encontrada." });
        setTimeout(() => navigate("/materia"), 1000);
        return;
      }

      setUsuarios(listaUsuarios);
      setFormData({
        nome: materia.nome,
        descricao: materia.descricao,
        usuarioId: materia.usuarioId,
      });
      setInitialData(materia);

    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao buscar dados." });
    }
  }, [id, podeVisualizarTudo, navigate]);

  /** 🔄 Efeito para carregar os dados */
  useEffect(() => {
    if (id) carregarDados();
  }, [id, carregarDados]);

  /** 📌 Manipula mudanças nos campos */
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Valida o formulário */
  const isFormValid = () => {
    if (!initialData) return false;

    const { nome, descricao, usuarioId } = formData;
    const nomeValido = nome.length >= 3 && nome.length <= 100;
    const descricaoValida = descricao.length >= 3 && descricao.length <= 250;
    const usuarioSelecionado = usuarioId !== "";
    const algumCampoAlterado =
      nome !== initialData.nome || descricao !== initialData.descricao || usuarioId !== initialData.usuarioId;

    return nomeValido && descricaoValida && usuarioSelecionado && algumCampoAlterado;
  };

  /** 🚀 Envia os dados atualizados */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    try {
      await MateriaApi.atualizarAsync(id, formData.nome, formData.descricao, formData.usuarioId);
      setMensagem({ tipo: "success", texto: "Matéria atualizada com sucesso!" });
      setTimeout(() => navigate("/materia"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao atualizar matéria." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.materiaAtualizarContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Editar Matéria</h2>
          {mensagem.texto && <Alert className={styles.alertMessage} variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <Form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* Nome e Usuário na mesma linha */}
            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite nome da matéria"
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

            {/* Descrição */}
            <div className={styles.formGroup}>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descricao"
                placeholder="Digite a descrição..."
                value={formData.descricao}
                onChange={handleChange}
                required
                disabled={!podeEditar} // ❌ Impede edição caso não tenha permissão
              />
            </div>

            {/* Botões */}
            <div className={styles.buttonContainer}>
              {podeEditar && (<Button variant="success" type="submit" disabled={!isFormValid()} className={styles.buttonSalvar}>
                Salvar
              </Button>)}
              <Button variant="secondary" onClick={() => navigate("/materia")} className={styles.buttonCancelar}>
                Cancelar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default MateriaAtualizar;
