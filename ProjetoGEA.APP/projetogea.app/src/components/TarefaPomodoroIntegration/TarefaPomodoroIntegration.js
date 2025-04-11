import React, { useState } from 'react';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import TarefaSelector from '../TarefaSelector/TarefaSelector';
import styles from './TarefaPomodoroIntegration.module.css';

export default function TarefaPomodoroIntegration({ usuario, tarefas }) {
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [modo, setModo] = useState('selecao'); // 'selecao' | 'execucao' | 'conclusao'

  const handleSelecionarTarefa = (tarefa) => {
    setTarefaSelecionada(tarefa);
    setModo('execucao');
  };

  const handleConcluir = () => {
    setModo('conclusao');
    setTimeout(() => {
      setModo('selecao');
      setTarefaSelecionada(null);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {modo === 'selecao' && (
        <TarefaSelector 
          tarefas={tarefas} 
          onSelect={handleSelecionarTarefa}
          onEstudoGeral={() => setModo('execucao')}
        />
      )}

      {modo === 'execucao' && (
        <PomodoroTimer 
          usuario={usuario}
          tarefa={tarefaSelecionada}
          onConcluido={handleConcluir}
        />
      )}

      {modo === 'conclusao' && (
        <div className={styles.feedback}>
          <h3>🎉 Bom trabalho!</h3>
          {tarefaSelecionada && (
            <p>Você progrediu na tarefa: {tarefaSelecionada.titulo}</p>
          )}
          <p>O ciclo foi registrado com sucesso.</p>
        </div>
      )}
    </div>
  );
}