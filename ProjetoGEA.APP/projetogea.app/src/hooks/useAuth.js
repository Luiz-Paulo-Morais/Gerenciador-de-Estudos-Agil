import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Certifique-se de importar corretamente

const useAuth = () => {
    const { usuario, login, logout } = useContext(AuthContext); // ✅ Obtém os dados do contexto

    return {
        usuario,
        userId: usuario?.userId || null, // ✅ Obtém ID do usuário autenticado
        tipoUsuario: usuario?.tipoUsuario || null, // ✅ Obtém tipo do usuário
        login, // ✅ Método de login
        logout, // ✅ Método de logout
    };
};

export default useAuth;
