import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUser, FaClipboardList, FaBook, FaTasks, FaChartLine } from "react-icons/fa";
import PageContainer from "../../components/PageContainer/PageContainer";
import styles from "./Home.module.css";

const funcionalidades = [
  { id: "usuario", titulo: "Usuário", icone: <FaUser />, rota: "/usuario" },
  { id: "materia", titulo: "Matéria", icone: <FaBook />, rota: "/materia" },
  { id: "simulado", titulo: "Simulado", icone: <FaClipboardList />, rota: "/simulado" },
  { id: "tarefa", titulo: "Tarefa", icone: <FaTasks />, rota: "/tarefa" },
  { id: "sprint", titulo: "Sprint", icone: <FaChartLine />, rota: "/sprint" },
];

const Home = () => {
  const navigate = useNavigate();
  const usuario = { id: 1, nome: "Luiz Paulo", foto: "" };

  return (
    <PageContainer usuario={usuario}>
      <Container className={styles.homeContainer}>
        <Row className="mt-4">
          {funcionalidades.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className={styles.card} onClick={() => navigate(item.rota)}>
                <Card.Body className="text-center">
                  <div className={styles.icon}>{item.icone}</div>
                  <Card.Title>{item.titulo}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </PageContainer>
  );
};

export default Home;
