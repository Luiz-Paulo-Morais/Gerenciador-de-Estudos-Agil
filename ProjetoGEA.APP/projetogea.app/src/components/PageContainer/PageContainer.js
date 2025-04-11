import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../Header/Header";
import styles from "./PageContainer.module.css";

const PageContainer = ({ children }) => {
    const { usuario } = useContext(AuthContext); // ✅ Obtém o usuário do contexto

    return (
        <div className={styles.pageContainer}>
            {usuario && <Header usuario={usuario} />} {/* ✅ Passa os dados do usuário para o Header */}
            {children}
        </div>
    );
};

export default PageContainer;

