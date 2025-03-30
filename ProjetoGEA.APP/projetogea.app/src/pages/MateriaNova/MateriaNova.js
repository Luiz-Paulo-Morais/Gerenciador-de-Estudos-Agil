import { useState, useEffect } from "react";
import usePermissao from "../../hooks/usePermissao";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./MateriaNova.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import MateriaApi from "../../services/materiaApi";

const MateriaNova = () => {
  const { usuario } = useAuth(); // 🔹 Obtém o usuário logado
  const { podeCriar, podeVisualizarTudo } = usePermissao(); // 🔹 Obtém permissões
  const navigate = useNavigate();
  
  // Estado dos campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    usuarioId: usuario?.tipoUsuario === 0 ? "" : usuario?.userId, // 🔹 Administrador escolhe, Default já tem seu próprio ID
  });

  const [usuarios, setUsuarios] = useState([]); // 🔹 Lista de usuários (apenas para admin)
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  /** 🔄 Carrega os usuários apenas para administradores */
  useEffect(() => {
    if (usuario?.tipoUsuario === 0) { // 🔹 Apenas Admin carrega a lista de usuários
      const carregarUsuarios = async () => {
        try {
          const listaUsuarios = await UsuarioApi.listarAsync(true);
          setUsuarios(listaUsuarios);
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
        }
      };
      carregarUsuarios();
    }
  }, [usuario]);

  /** 📌 Manipula mudanças nos campos */
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Valida os campos do formulário */
  const isFormValid = () => {
    return (
      formData.nome.length >= 3 &&
      formData.nome.length <= 100 &&
      formData.descricao.length >= 3 &&
      formData.descricao.length <= 250 &&
      formData.usuarioId
    );
  };

  /** 🚀 Envia os dados para criar uma nova matéria */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    try {
      await MateriaApi.criarAsync(formData.nome, formData.descricao, formData.usuarioId);
      setMensagem({ tipo: "success", texto: "Matéria criada com sucesso!" });
      setTimeout(() => navigate("/materia"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao criar matéria." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.novaMateriaContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Nova Matéria</h2>
          {mensagem.texto && <Alert variant={mensagem.tipo} className={styles.alertMessage}>{mensagem.texto}</Alert>}

          <div className={styles.formContainer}>
            <Form onSubmit={handleSubmit}>
              {/* Nome e Usuário */}
              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome: 3 a 100 caracteres"
                    required
                  />
                </Form.Group>

                {/* 🔹 Administrador pode selecionar o usuário, outros usuários têm campo desabilitado */}
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Usuário</Form.Label>
                  <Form.Select
                    name="usuarioId"
                    value={formData.usuarioId}
                    onChange={handleChange}
                    disabled={!podeVisualizarTudo} // 🔹 Apenas Admin pode alterar
                    required
                  >
                    {podeVisualizarTudo ? (
                      <>
                        <option value="">Selecione o usuário</option>
                        {usuarios.map((usuario) => (
                          <option key={usuario.id} value={usuario.id}>
                            {usuario.nome}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value={usuario?.userId}>{usuario?.nome}</option> // 🔹 Apenas exibe o próprio nome para Default
                    )}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Descrição */}
              <Form.Group className={styles.formGroup}>
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descricao"
                  placeholder="Digite a descrição... (3 a 250 caracteres)"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Botões */}
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.buttonCriar}
                  variant="success"
                  type="submit"
                  disabled={!isFormValid() || !podeCriar} // 🔹 Bloqueia botão se não puder criar
                >
                  Criar
                </Button>
                <Button
                  className={styles.buttonCancelar}
                  variant="secondary"
                  onClick={() => navigate("/materia")}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MateriaNova;
