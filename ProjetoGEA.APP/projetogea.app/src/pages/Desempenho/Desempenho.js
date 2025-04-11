import React from "react";
import { Container } from "react-bootstrap";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import useAuth from "../../hooks/useAuth";
import styles from "./Desempenho.module.css";

const Desempenho = () => {
  // Obtém o usuário autenticado
  const { usuario } = useAuth();

  console.log("🔍 Usuário logado pagina desenpenho:", usuario); // 👉 Verifique se aparece corretamente no console

  return (
    <PageContainer usuario={usuario}>
      <Container className={styles.desempenhoContainer}>        
        {/* Passa o usuário logado para o Dashboard */}
        <Dashboard usuario={usuario} />
      </Container>
    </PageContainer>
  );
};

export default Desempenho;
