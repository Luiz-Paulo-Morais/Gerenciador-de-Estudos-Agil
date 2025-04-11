import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import styles from "./ModalSessaoEstudo.module.css";
import PomodoroTimer from "../PomodoroTimer/PomodoroTimer";
import CicloPomodoroApi from "../../services/cicloPomodoroApi";
import useAuth from "../../hooks/useAuth";

const ModalSessaoEstudo = ({ show, onClose, sprints, materias, tarefas = [], onSessaoCriada }) => {
  const { usuario } = useAuth();
  const userId = parseInt(usuario.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados do formulário
  const [sprintId, setSprintId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [tarefaId, setTarefaId] = useState("");
  const [duracao, setDuracao] = useState(25);

  // Estados do fluxo Pomodoro
  const [cicloAtivo, setCicloAtivo] = useState(null);
  const [modo, setModo] = useState('preparacao');

  // Filtra tarefas baseadas nos seletores
  const tarefasFiltradas = useCallback(() => {
    return tarefas.filter(t =>
      (!sprintId || String(t.sprintId) === String(sprintId)) &&
      (!materiaId || String(t.materiaId) === String(materiaId))
    );
  }, [tarefas, sprintId, materiaId]);

  // Reseta o formulário quando o modal é aberto/fechado
  useEffect(() => {
    if (show) {
      resetarFormulario();
    }
  }, [show]);

  const resetarFormulario = useCallback(() => {
    setSprintId("");
    setMateriaId("");
    setTarefaId("");
    setDuracao(25);
    setCicloAtivo(null);
    setModo('preparacao');
    setError(null);
  }, []);

  const handleIniciarSessao = useCallback(async () => {
    if (!sprintId || !materiaId) {
      setError("Selecione uma sprint e matéria");
      return;
    }

    setLoading(true);
    try {
      const novoCiclo = await CicloPomodoroApi.adicionarAsync(
        userId,
        materiaId,
        sprintId,
        tarefaId || null,
        duracao * 60,
        new Date().toISOString()
      );

      setCicloAtivo(novoCiclo);
      setModo('execucao');
    } catch (err) {
      console.error("Erro ao iniciar sessão:", err);
      setError(err.message || "Erro ao iniciar a sessão");
    } finally {
      setLoading(false);
    }
  }, [userId, materiaId, sprintId, tarefaId, duracao]);

  const handleConcluirSessao = useCallback(async (data) => {
    const tempoReal = typeof data === 'object' && data !== null ? data.tempoReal : data;
    if (!cicloAtivo) return;

    setLoading(true);
    try {

      await CicloPomodoroApi.concluirCicloAsync(cicloAtivo, tempoReal);

      setModo('conclusao');
      if (onSessaoCriada) onSessaoCriada();

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Erro ao concluir sessão:", err);
      setError(err.message || "Erro ao concluir a sessão");
    } finally {
      setLoading(false);
    }
  }, [cicloAtivo, onClose, onSessaoCriada]);

  const handleCancelarSessao = useCallback(async (data) => {
    const tempoDecorrido = typeof data === 'object' && data !== null ? data.tempoDecorrido : data;
    // Se não há ciclo ativo, apenas fecha o modal
    if (!cicloAtivo) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      if (tempoDecorrido > 0) {

        await CicloPomodoroApi.concluirCicloAsync(cicloAtivo, tempoDecorrido);
      } else {
        await CicloPomodoroApi.deletarAsync(cicloAtivo);
      }

      if (onSessaoCriada) onSessaoCriada();
      onClose();
    } catch (err) {
      console.error("Erro ao cancelar sessão:", err);
      setError(err.message || "Erro ao cancelar a sessão");
    } finally {
      setLoading(false);
    }
  }, [cicloAtivo, onClose, onSessaoCriada]);

  return (
    <Modal
      show={show}
      onHide={() => {
        if (modo === 'preparacao') {
          onClose(); // Permite fechar normalmente na fase de preparação
        } else if (cicloAtivo) {
          handleCancelarSessao(0); // Requer confirmação se houver sessão ativa
        } else {
          onClose(); // Fallback para outros casos
        }
      }}
      centered
      backdrop={modo !== 'preparacao' ? "static" : true}
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>
          {modo === 'execucao' ? 'Sessão em Andamento' :
            modo === 'conclusao' ? 'Sessão Concluída' : 'Nova Sessão de Estudo'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Spinner animation="border" className="m-auto" />}

        {modo === 'preparacao' && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Sprint</Form.Label>
              <Form.Select
                value={sprintId}
                onChange={(e) => setSprintId(parseInt(e.target.value))}
                disabled={loading}
              >
                <option value="">Selecione uma sprint</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} ({new Date(s.dataInicio).toLocaleDateString()} - {new Date(s.dataFim).toLocaleDateString()})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Matéria</Form.Label>
              <Form.Select
                value={materiaId}
                onChange={(e) => setMateriaId(parseInt(e.target.value))}
                disabled={!sprintId || loading}
              >
                <option value="">Selecione uma matéria</option>
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tarefa (opcional)</Form.Label>
              <Form.Select
                value={tarefaId}
                onChange={(e) => setTarefaId(parseInt(e.target.value))}
                disabled={!materiaId || loading}
              >
                <option value="">Nenhuma (estudo geral)</option>
                {tarefasFiltradas().map(t => (
                  <option key={t.id} value={t.id}>
                    {t.titulo} {t.prioridade && `(Prioridade: ${t.prioridade})`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duração (minutos)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="120"
                value={duracao}
                onChange={(e) => setDuracao(Math.max(1, Math.min(120, parseInt(e.target.value) || 25)))}
                disabled={loading}
              />
            </Form.Group>
          </Form>
        )}

        {modo === 'execucao' && cicloAtivo && (
          <div className={styles.pomodoroContainer}>
            <PomodoroTimer
              duracao={duracao}
              tarefa={tarefasFiltradas().find(t => t.id === tarefaId)}
              onConcluir={handleConcluirSessao}
              onCancelar={handleCancelarSessao}
            />
          </div>
        )}

        {modo === 'conclusao' && (
          <div className={styles.conclusaoContainer}>
            <h5 className="text-success">🎉 Sessão registrada com sucesso!</h5>
            {tarefaId && (
              <p className="mt-3">
                Progresso na tarefa: <strong>{tarefasFiltradas().find(t => t.id === tarefaId)?.titulo}</strong>
              </p>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {modo === 'preparacao' && (
          <>
            <Button variant="secondary" onClick={() => handleCancelarSessao(0)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleIniciarSessao}
              disabled={!sprintId || !materiaId || loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar'}
            </Button>
          </>
        )}

        {modo === 'execucao' && (
          <Button variant="secondary" onClick={() => handleCancelarSessao(0)} disabled={loading}>
            Cancelar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSessaoEstudo;