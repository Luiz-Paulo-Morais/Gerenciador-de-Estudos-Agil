import { useState, useEffect } from 'react';
import styles from './PomodoroTimer.module.css';

const PomodoroTimer = ({ duracao, tarefa, onConcluir, onCancelar }) => {
  const [segundosRestantes, setSegundosRestantes] = useState(duracao * 60);
  const [pausado, setPausado] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0); // Novo estado

  // Resetar estados quando a duração muda
  useEffect(() => {
    setSegundosRestantes(duracao * 60);
    setPausado(false);
    setConcluido(false);
    setTempoDecorrido(0);
  }, [duracao]);

  useEffect(() => {
    let intervalo;
    
    if (!pausado && !concluido && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes(prev => {
          const novoValor = prev - 1;
          setTempoDecorrido(duracao * 60 - novoValor); // Atualiza tempo decorrido
          return novoValor;
        });
      }, 1000);
    } else if (segundosRestantes === 0 && !concluido) {
      setConcluido(true);
      onConcluir({
        tempoReal: duracao * 60, // Tempo total em segundos
        tempoDecorrido: duracao * 60 // Igual ao tempo real quando concluído
      });
    }

    return () => clearInterval(intervalo);
  }, [pausado, segundosRestantes, concluido, duracao, onConcluir]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  const handleCancelar = () => {
    onCancelar({
      tempoReal: tempoDecorrido, // Tempo realmente estudado
      tempoPlanejado: duracao * 60 // Tempo total planejado
    });
  };

  return (
    <div className={styles.container}>
      {tarefa && (
        <div className={styles.tarefaInfo}>
          <h5>Tarefa: {tarefa.titulo}</h5>
          {tarefa.prioridade && <span>Prioridade: {tarefa.prioridade}</span>}
          <div className={styles.tempoInfo}>
            <span>Tempo decorrido: {Math.floor(tempoDecorrido / 60)}:{String(tempoDecorrido % 60).padStart(2, '0')}</span>
          </div>
        </div>
      )}

      <div className={styles.timerDisplay}>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </div>

      <div className={styles.controls}>
        <button 
          onClick={() => setPausado(!pausado)}
          className={`${styles.controlButton} ${pausado ? styles.resumeButton : styles.pauseButton}`}
        >
          {pausado ? 'Continuar' : 'Pausar'}
        </button>
        
        <button 
          onClick={handleCancelar}
          className={`${styles.controlButton} ${styles.cancelButton}`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;