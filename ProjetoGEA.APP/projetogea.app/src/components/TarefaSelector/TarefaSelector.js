import React from 'react';
import styles from './TarefaSelector.module.css';

export default function TarefaSelector({ tarefas, onSelect, onEstudoGeral }) {
  return (
    <div className={styles.container}>
      <h3>Selecione uma tarefa para focar:</h3>
      
      <div className={styles.tarefaList}>
        {tarefas.map(tarefa => (
          <div 
            key={tarefa.id} 
            className={styles.tarefaCard}
            onClick={() => onSelect(tarefa)}
          >
            <h4>{tarefa.titulo}</h4>
            <p>Sprint: {tarefa.sprintNome}</p>
            <p>Horas: {tarefa.horasRealizadas || 0}/{tarefa.horasEstimadas}</p>
            <span className={`${styles.prioridade} ${styles['prioridade-' + tarefa.prioridade]}`}>
              Prioridade: {tarefa.prioridade}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onEstudoGeral}
        className={styles.estudoGeralButton}
      >
        Ou inicie um estudo geral
      </button>
    </div>
  );
}