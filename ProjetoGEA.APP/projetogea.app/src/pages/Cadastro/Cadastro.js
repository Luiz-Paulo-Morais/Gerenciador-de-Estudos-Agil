import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Cadastro.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
//import { Alert } from "react-bootstrap";
import ImgIlustracao from "../../components/ImgIlustracao/ImgIlustracao";
import { MdLock, MdEmail, MdPerson } from "react-icons/md";
import axios from "axios";

export default function Cadastro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        tipoUsuario: 1, // 🔹 Sempre inicia como "Default"
    });
    const [error, setError] = useState("");
    //const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

    // 🔹 Validações
    const validarSenha = (senha) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/.test(senha);

    const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const nomeValido = (nome) => nome.length >= 3 && nome.length <= 100;

    const isFormValid = () =>
        nomeValido(formData.nome) &&
        emailValido(formData.email) &&
        validarSenha(formData.senha);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5131/api/auth/register", {
                nome: formData.nome,
                email: formData.email,
                password: formData.senha,
                tipoUsuario: formData.tipoUsuario
            });

            
            alert("Cadastro realizado com sucesso!");
            navigate("/login"); // 🔹 Redireciona para a tela de login

        } catch (error) {
            
            setError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
        }
    };

    return (

        <div className={style.container}>
            
            <div className={style.column}>
                <div className={style.logoContainer}>
                    <ImgIlustracao />
                </div>
            </div>

            <div className={style.column}>
                <div className={style.formContainer}>
                    < p className={style.titleLogin}>Criar Conta</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            leftIcon={<MdPerson />}
                            name="nome"
                            placeholder="Nome Completo"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            leftIcon={<MdEmail />}
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            leftIcon={<MdLock />}
                            name="senha"
                            placeholder="Senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                        />
                        {error && <p className={style.errorMessage}>{error}</p>}
                        <Button title="Cadastrar" variant="primary" type="submit" disabled={!isFormValid()} />
                    </form>
                    <div className={style.row}>
                        <p className={style.TextoConta}>
                            Já tem uma conta? <a href="/login" className={style.login}>Faça login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
