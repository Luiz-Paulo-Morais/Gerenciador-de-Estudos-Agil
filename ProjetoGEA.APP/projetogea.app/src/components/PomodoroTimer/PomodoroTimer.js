import { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaTimes, 
  FaCheck, 
  FaCoffee, 
  FaClock, 
  FaTasks,
  FaFireAlt,
  FaRegClock
} from 'react-icons/fa';
import styles from './PomodoroTimer.module.css';

const PomodoroTimer = ({ duracao, tarefa, onConcluir, onCancelar }) => {
  // Configurações do Pomodoro
  const POMODORO_TIME = duracao * 60; // Tempo padrão em segundos
  const SHORT_BREAK_TIME = 5 * 60; // 5 minutos
  const LONG_BREAK_TIME = 15 * 60; // 15 minutos
  const POMODOROS_PER_SET = 4; // Quantos pomodoros antes de um longo descanso

  // Estados do Pomodoro
  const [segundosRestantes, setSegundosRestantes] = useState(POMODORO_TIME);
  const [pausado, setPausado] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [tipoSessao, setTipoSessao] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [pomodorosCompletos, setPomodorosCompletos] = useState(0);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  // Efeitos para controle do timer
  useEffect(() => {
    resetTimer();
  }, [tipoSessao, duracao]);

  useEffect(() => {
    let intervalo;
    
    if (!pausado && !concluido && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes(prev => {
          const novoValor = prev - 1;
          setTempoDecorrido(getTempoTotal() - novoValor);
          return novoValor;
        });
      }, 1000);
    } else if (segundosRestantes === 0 && !concluido) {
      setConcluido(true);
      handleSessaoCompleta();
    }

    return () => clearInterval(intervalo);
  }, [pausado, segundosRestantes, concluido]);

  // Funções auxiliares
  const getTempoTotal = () => {
    switch(tipoSessao) {
      case 'pomodoro': return POMODORO_TIME;
      case 'shortBreak': return SHORT_BREAK_TIME;
      case 'longBreak': return LONG_BREAK_TIME;
      default: return POMODORO_TIME;
    }
  };

  const resetTimer = () => {
    setSegundosRestantes(getTempoTotal());
    setPausado(false);
    setConcluido(false);
    setTempoDecorrido(0);
  };

  const handleSessaoCompleta = () => {
    if (tipoSessao === 'pomodoro') {
      const novosPomodoros = pomodorosCompletos + 1;
      setPomodorosCompletos(novosPomodoros);
      
      if (novosPomodoros % POMODOROS_PER_SET === 0) {
        setTipoSessao('longBreak');
      } else {
        setTipoSessao('shortBreak');
      }
      
      // Notifica o término do pomodoro
      onConcluir({
        tempoReal: POMODORO_TIME,
        tempoDecorrido: POMODORO_TIME,
        pomodorosCompletos: novosPomodoros
      });
    } else {
      // Terminou um descanso, volta para pomodoro
      setTipoSessao('pomodoro');
    }
  };

  const handleCancelar = () => {
    if (tipoSessao === 'pomodoro' && tempoDecorrido > 0) {
      setShowConfirmacao(true);
    } else {
      confirmarCancelamento();
    }
  };

  const confirmarCancelamento = () => {
    onCancelar({
      tempoReal: tempoDecorrido,
      tempoPlanejado: getTempoTotal(),
      pomodorosCompletos,
      tipoSessao
    });
    setShowConfirmacao(false);
  };

  const continuarSessao = () => {
    setShowConfirmacao(false);
  };

  const mudarSessao = (novoTipo) => {
    setTipoSessao(novoTipo);
  };

  // Formatação do tempo
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  return (
    <div className={styles.container}>
      {/* Modal de confirmação */}
      {showConfirmacao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4><FaTimes className={styles.warningIcon} /> Cancelar Pomodoro?</h4>
            <p>Você já completou {Math.floor(tempoDecorrido / 60)} minutos. Tem certeza que deseja cancelar?</p>
            <div className={styles.modalButtons}>
              <button 
                onClick={continuarSessao}
                className={styles.continueButton}
              >
                <FaCheck /> Continuar
              </button>
              <button 
                onClick={confirmarCancelamento}
                className={styles.confirmCancelButton}
              >
                <FaTimes /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controles de sessão */}
      <div className={styles.sessionControls}>
        <button
          onClick={() => mudarSessao('pomodoro')}
          className={`${styles.sessionButton} ${tipoSessao === 'pomodoro' ? styles.active : ''}`}
        >
          <FaTasks /> Pomodoro
        </button>
        <button
          onClick={() => mudarSessao('shortBreak')}
          className={`${styles.sessionButton} ${tipoSessao === 'shortBreak' ? styles.active : ''}`}
        >
          <FaCoffee /> Descanso Curto
        </button>
        <button
          onClick={() => mudarSessao('longBreak')}
          className={`${styles.sessionButton} ${tipoSessao === 'longBreak' ? styles.active : ''}`}
        >
          <FaClock /> Descanso Longo
        </button>
      </div>

      {/* Contador de Pomodoros */}
      <div className={styles.pomodoroCount}>
        {Array.from({ length: POMODOROS_PER_SET }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.pomodoroDot} ${i < pomodorosCompletos % POMODOROS_PER_SET ? styles.completed : ''}`}
          />
        ))}
      </div>

      {/* Informações da tarefa */}
      {tarefa && (
        <div className={styles.tarefaInfo}>
          <h5><FaTasks className={styles.taskIcon} /> {tarefa.titulo}</h5>
          {tarefa.prioridade && (
            <span className={styles.priority}>
              <FaFireAlt /> Prioridade: {tarefa.prioridade}
            </span>
          )}
          <div className={styles.tempoInfo}>
            <FaRegClock /> <span>Tempo decorrido: {Math.floor(tempoDecorrido / 60)}:{String(tempoDecorrido % 60).padStart(2, '0')}</span>
          </div>
        </div>
      )}

      {/* Display do timer */}
      <div className={`${styles.timerDisplay} ${tipoSessao === 'pomodoro' ? styles.pomodoro : tipoSessao === 'shortBreak' ? styles.shortBreak : styles.longBreak}`}>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </div>

      {/* Controles do timer */}
      <div className={styles.controls}>
        <button 
          onClick={() => setPausado(!pausado)}
          className={`${styles.controlButton} ${pausado ? styles.resumeButton : styles.pauseButton}`}
        >
          {pausado ? (
            <>
              <FaPlay /> Continuar
            </>
          ) : (
            <>
              <FaPause /> Pausar
            </>
          )}
        </button>
        
        <button 
          onClick={handleCancelar}
          className={`${styles.controlButton} ${styles.cancelButton}`}
        >
          <FaTimes /> {tipoSessao === 'pomodoro' ? 'Cancelar' : 'Pular'}
        </button>
      </div>

      {/* Status da sessão */}
      <div className={styles.sessionStatus}>
        {tipoSessao === 'pomodoro' ? (
          <span><FaFireAlt /> Trabalhando (#{pomodorosCompletos + 1})</span>
        ) : (
          <span><FaCoffee /> Descansando</span>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;