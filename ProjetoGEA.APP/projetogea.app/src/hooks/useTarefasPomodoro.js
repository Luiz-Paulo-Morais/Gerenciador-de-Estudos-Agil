import { useState, useCallback } from "react";
import TarefaApi from "../services/tarefaApi";

const useTarefasPomodoro = (usuarioId) => {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarTarefas = useCallback(async (sprintId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = sprintId
        ? await TarefaApi.listarPorSprintAsync(sprintId, true)
        : await TarefaApi.listarPorUsuarioAsync(usuarioId, true);
      setTarefas(data);
    } catch (err) {
      setError(err);
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  return { 
    tarefas, 
    loading, 
    error, 
    carregarTarefas 
  };
};

export default useTarefasPomodoro;