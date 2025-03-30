import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // ✅ Importa o contexto
import style from "./Login.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import ImgIlustracao from "../../components/ImgIlustracao/ImgIlustracao";
import { Link } from "react-router-dom";
import { MdLock, MdEmail } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";

export default function Login() {
    const navigate = useNavigate();
    const { setUsuario } = useContext(AuthContext); // ✅ Obtém a função para atualizar o usuário autenticado
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isFormValid = () => validarEmail(email) && senha.length >= 5 && senha.length <= 20;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5131/api/auth/login", {
                email,
                password: senha,
            }, { withCredentials: true });

            // ✅ Obtém o token e salva no cookie
            const token = response.data.token;
            Cookies.set("token", token, { expires: 1, secure: true, sameSite: "None" });

            // ✅ Define o token no cabeçalho global das requisições
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // ✅ Obtém os dados do usuário autenticado
            const userResponse = await axios.get("http://localhost:5131/api/auth/me", { withCredentials: true });

            // ✅ Atualiza o contexto com os dados do usuário
            setUsuario(userResponse.data);
            console.log("Usuário autenticado (tela-login):", userResponse.data);

            // ✅ Redireciona para a página inicial
            navigate("/home");

        } catch (error) {
            setError("Credenciais inválidas. Verifique seu email e senha.");
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
                    <p className={style.titleLogin}>Faça seu cadastro</p>
                    <p className={style.subTitleLogin}>Faça seu login</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            leftIcon={<MdEmail />}
                            name="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <Input
                            leftIcon={<MdLock />}
                            name="senha"
                            placeholder="Senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoComplete="current-password"
                        />
                        {error && <p className={style.errorMessage}>{error}</p>}
                        <Button title="Entrar" variant="secondary" type="submit" disabled={!isFormValid()} />
                    </form>
                    <div className={style.row}>
                        <p className={style.textCriarConta}>
                            Já tem uma conta? <Link to="/login/cadastro" className={style.criarConta}>
                                Criar Conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}