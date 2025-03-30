import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePermissao from "../../hooks/usePermissao";
import { Form, Button, Alert } from "react-bootstrap";
import styles from "./UsuarioAtualizar.module.css";
import PageContainer from "../../components/PageContainer/PageContainer";
import UsuarioApi from "../../services/usuarioApi";

const UsuarioAtualizar = () => {
  const { podeVisualizarTudo } = usePermissao();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    tipoUsuario: "",
    dataCriacao: "",
  });
  const [tiposUsuarios, setTiposUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  /** 🔄 Carrega os tipos de usuários */
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
    if (!id) {
      setMensagem({ tipo: "danger", texto: "Usuário não encontrado." });
      setTimeout(() => navigate("/usuario"), 800);
      return;
    }

    const buscarDadosUsuario = async () => {
      try {
        const usuario = await UsuarioApi.obterAsync(id);
        setFormData({ ...usuario, senhaAtual: "", novaSenha: "" });
        setInitialData(usuario);
      } catch (error) {
        setMensagem({ tipo: "danger", texto: "Erro ao buscar usuário." });
      }
    };

    carregarTiposUsuarios();
    buscarDadosUsuario();
  }, [id, navigate, carregarTiposUsuarios]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarSenha = (senha) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/.test(senha);

  const isFormValid = () => {
    if (!initialData) return false;

    const { nome, email, senhaAtual, novaSenha, tipoUsuario } = formData;
    const nomeValido = nome.length >= 3 && nome.length <= 100;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const senhaValida = senhaAtual ? validarSenha(novaSenha) : true;
    const algumCampoAlterado = nome !== initialData.nome || email !== initialData.email || senhaAtual || tipoUsuario !== initialData.tipoUsuario;

    return nomeValido && emailValido && senhaValida && algumCampoAlterado;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setMensagem({ tipo: "danger", texto: "Verifique os campos e tente novamente." });
      return;
    }

    try {
      await UsuarioApi.atualizarAsync(id, formData.nome, formData.email, Number(formData.tipoUsuario));
      if (formData.senhaAtual) {
        await UsuarioApi.alterarSenhaAsync(id, formData.senhaAtual, formData.novaSenha);
      }
      setMensagem({ tipo: "success", texto: "Usuário atualizado com sucesso!" });
      setTimeout(() => navigate("/usuario"), 800);
    } catch (error) {
      setMensagem({ tipo: "danger", texto: "Erro ao atualizar usuário." });
    }
  };

  return (
    <PageContainer>
      <div className={styles.usuarioAtualizarContainer}>
        <h2 className={styles.titulo}>Editar Usuário</h2>
        {mensagem.texto && <Alert className={styles.alertMessage} variant={mensagem.tipo}>{mensagem.texto}</Alert>}
        <Form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formRow}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </div>
          <div className={styles.formRow}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Senha Atual</Form.Label>
              <Form.Control type="password" name="senhaAtual" value={formData.senhaAtual} onChange={handleChange} />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control
                type="password"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                disabled={!formData.senhaAtual}
                placeholder="Mín. 6 e máx. 20 caracteres, 1 maiúscula, 1 número e 1 símbolo"
              />
            </Form.Group>
          </div>
          {podeVisualizarTudo && ( // 🔹 Exibe o campo apenas para Administradores
            <div className={styles.formRow}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Tipo Usuário</Form.Label>
                <Form.Control as="select" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {tiposUsuarios.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Data de Cadastro</Form.Label>
                <Form.Control type="text" value={formData.dataCriacao ? new Date(formData.dataCriacao).toLocaleString("pt-BR") : "N/A"} disabled />
              </Form.Group>
            </div>
          )}

          <div className={styles.buttonContainer}>
            <Button variant="success" type="submit" disabled={!isFormValid()} className={styles.buttonSalvar}>Salvar</Button>
            <Button variant="secondary" onClick={() => navigate("/usuario")} className={styles.buttonCancelar}>Cancelar</Button>
          </div>
        </Form>
      </div>
    </PageContainer>
  );
};

export default UsuarioAtualizar;
