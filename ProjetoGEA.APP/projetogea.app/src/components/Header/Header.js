import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaBars,
  FaUser,
  FaClipboardList,
  FaBook,
  FaTasks,
  FaChartLine,
  FaHome,
} from "react-icons/fa";
import styles from "./Header.module.css";
import logoSistema from "../../assets/logo01.png";
import logoUserDefault from "../../assets/userLogado.png";

const funcionalidades = [
  { nome: "Usuário", icone: <FaUser />, rota: "/usuario" },
  { nome: "Matéria", icone: <FaBook />, rota: "/materia" },
  { nome: "Simulado", icone: <FaClipboardList />, rota: "/simulado" },
  { nome: "Tarefa", icone: <FaTasks />, rota: "/tarefa" },
  { nome: "Sprint", icone: <FaChartLine />, rota: "/sprint" },
];

function DropdownMenu({ navigate }) {
  return (
    <nav className={styles.menuDropdown}>
      {funcionalidades.map((item) => (
        <div key={item.nome} className={styles.menuItem} onClick={() => navigate(item.rota)}>
          {item.icone}
          <span>{item.nome}</span>
        </div>
      ))}
    </nav>
  );
}

export default function Header({ usuario }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const handleLogoff = () => navigate("/");

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <FaHome className={styles.homeIcon} onClick={() => navigate("/home")} />
          <img src={logoSistema} alt="Logo" className={styles.logo} onClick={() => navigate("/home")} />
          <h1 className={styles.titulo}>Gerenciador de Estudos Ágil</h1>
        </div>

        <div className={styles.usuarioContainer}>
          <span className={styles.nomeUsuario}>{usuario.nome}</span>
          <img
            src={usuario.foto?.trim() ? usuario.foto : logoUserDefault}
            alt="Usuário"
            className={styles.fotoUsuario}
          />
          <FaBars className={styles.menuIcon} onClick={() => setMenuAberto(!menuAberto)} />
          <FaSignOutAlt className={styles.logoffIcon} onClick={handleLogoff} />

          {menuAberto && <DropdownMenu navigate={navigate} />}
        </div>
      </div>
    </header>
  );
}
