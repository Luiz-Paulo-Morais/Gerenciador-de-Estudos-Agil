import { useState, useEffect } from 'react';
import cicloPomodoroApi from '../services/cicloPomodoroApi';

export default function usePomodoro() {
  const [cicloAtivo, setCicloAtivo] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [estaExecutando, setEstaExecutando] = useState(false);

  // Inicia um novo ciclo Pomodoro
  const iniciarCiclo = async (usuarioId, materiaId, sprintId, tarefaId, duracaoMinutos) => {
    try {
      const novoCiclo = await cicloPomodoroApi.criarCiclo(
        usuarioId,
        materiaId,
        sprintId,
        tarefaId,
        duracaoMinutos
      );
      
      setCicloAtivo(novoCiclo);
      setTempoRestante(duracaoMinutos * 60); // converte para segundos
      setEstaExecutando(true);
      
      return novoCiclo;
    } catch (error) {
      console.error("Falha ao iniciar ciclo:", error);
      throw error;
    }
  };

  // Conclui o ciclo ativo
  const concluirCiclo = async () => {
    if (!cicloAtivo) return false;

    try {
      await cicloPomodoroApi.concluirCiclo(cicloAtivo.id);
      setEstaExecutando(false);
      setCicloAtivo(null);
      return true;
    } catch (error) {
      console.error("Falha ao concluir ciclo:", error);
      return false;
    }
  };

  // Efeito para o cronômetro
  useEffect(() => {
    let intervalo;
    
    if (estaExecutando && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else if (estaExecutando && tempoRestante === 0) {
      concluirCiclo();
    }

    return () => clearInterval(intervalo);
  }, [estaExecutando, tempoRestante]);

  return {
    cicloAtivo,
    tempoRestante,
    estaExecutando,
    iniciarCiclo,
    concluirCiclo,
    pausarContinuar: () => setEstaExecutando(!estaExecutando)
  };
}