import React from "react";
import { Card } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTasks, FaChartBar } from "react-icons/fa";
import styles from "./ImgIlustracao.module.css";
import logoSistema from "../../assets/logo02.png"; // Ajuste o caminho conforme necessário

const ImgIlustracao = () => {
  return (
    <Card className={styles.container}>
      <div className={styles.overlay}>
        <img src={logoSistema} alt="Gerenciador de Estudos Ágil" className={styles.logo} />
        <h2 className={styles.title}>Gerenciador de Estudos Ágil</h2>
        <ul className={styles.features}>
          <li>
            <FaCheckCircle className={styles.icon} /> Organização eficiente de tarefas
          </li>
          <li>
            <FaClock className={styles.icon} /> Técnica Pomodoro para produtividade
          </li>
          <li>
            <FaTasks className={styles.icon} /> Gestão ágil de sprints e estudos
          </li>
          <li>
            <FaChartBar className={styles.icon} /> Análise de desempenho
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default ImgIlustracao;
