import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import usePermissao from "../../hooks/usePermissao";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./UsuarioNovo.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";
import axios from "axios";

const UsuarioNovo = () => {
  const { podeVisualizarTudo } = usePermissao();
  const navigate = useNavigate();

  // 🔹 Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "", // 🔹 Alterado de "senha" para "password"
    tipoUsuario: ""
  });

  const [tiposUsuarios, setTiposUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  /** 🔄 Carrega os tipos de usuários usando useCallback */
  const carregarTiposUsuarios = useCallback(async () => {
    if (podeVisualizarTudo) {
      try {
        const listaTiposUsuarios = await UsuarioApi.listarTiposUsuarioAsync(true);
        setTiposUsuarios(listaTiposUsuarios);
      } catch (error) {
        console.error("Erro ao carregar tipos de usuários:", error);
      }
    }
  }, [podeVisualizarTudo]);

  useEffect(() => {
    carregarTiposUsuarios();
  }, [carregarTiposUsuarios]);

  // 🔹 Validações
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarSenha = (senha) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/.test(senha);

  const isFormValid = () =>
    formData.nome.length >= 3 &&
    formData.nome.length <= 100 &&
    validarEmail(formData.email) &&
    validarSenha(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    // 🔹 Criando objeto correto para a API
    const dadosUsuario = {
      ...formData,
      tipoUsuario: Number(formData.tipoUsuario) // 🔹 Convertendo para número
    };

    console.log("Enviando requisição com os dados:", dadosUsuario);

    try {
      await axios.post("http://localhost:5131/api/auth/register", dadosUsuario, { withCredentials: true });
      setMensagem({ tipo: "success", texto: "Usuário criado com sucesso!" });
      setTimeout(() => navigate("/usuario"), 800);
    } catch (error) {
      console.error("Erro ao criar usuário:", error.response?.data || error.message);
      setMensagem({ tipo: "danger", texto: "Erro ao criar usuário." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.novoUsuarioContainer}>
        <div className={styles.content}>
          <h2 className={styles.titulo}>Novo Usuário</h2>
          {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <div className={styles.formContainer}>
            <Form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Nome: 3 a 100 caracteres"
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email válido"
                  />
                </Form.Group>
              </div>
              <div className={styles.formRow}>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password" // 🔹 Alterado de "senha" para "password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mín. 6, Máx. 20, 1 Maiúscula, 1 Número, 1 Especial"
                  />
                </Form.Group>
                {podeVisualizarTudo && (
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Tipo Usuário</Form.Label>
                    <Form.Control
                      as="select"
                      name="tipoUsuario"
                      value={formData.tipoUsuario}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      {tiposUsuarios.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              </div>

              <div className={styles.buttonContainer}>
                {podeVisualizarTudo && (
                  <Button className={styles.buttonCriar} variant="success" type="submit" disabled={!isFormValid()}>
                    Criar
                  </Button>
                )}
                <Button className={styles.buttonCancelar} variant="secondary" onClick={() => navigate("/usuario")}>
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

export default UsuarioNovo;
