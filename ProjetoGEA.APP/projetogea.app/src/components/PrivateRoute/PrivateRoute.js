import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const PrivateRoute = () => {
    const { usuario, loading } = useContext(AuthContext);

    if (loading) return <p>Carregando...</p>; // ✅ Garante que só exibe a página após carregar os dados

    return usuario ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;