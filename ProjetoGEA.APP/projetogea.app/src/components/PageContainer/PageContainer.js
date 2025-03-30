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

/*
import React from "react";
import styles from "./PageContainer.module.css";
import Header from "../Header/Header";

const PageContainer = ({ usuario, children }) => {
  return (
    <div className={styles.pageContainer}>
      <Header usuario={usuario} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PageContainer;
*/