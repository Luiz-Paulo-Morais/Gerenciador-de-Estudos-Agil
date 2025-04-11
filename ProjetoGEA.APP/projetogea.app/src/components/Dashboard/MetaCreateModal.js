import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import MetaEstudoApi from "../../services/metaEstudoApi";
import MateriaApi from "../../services/materiaApi";
import SprintApi from "../../services/sprintApi";
import "./MetaCreateModal.css";

const MetaCreateModal = ({ show, onHide, onSave, usuarioId }) => {
    const [horasPlanejadas, setHorasPlanejadas] = useState("");
    const [materias, setMaterias] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [materiaSelecionada, setMateriaSelecionada] = useState(null);
    const [sprintSelecionada, setSprintSelecionada] = useState(null);
    const [loading, setLoading] = useState(false);

    // Funções memoráveis com useCallback
    const carregarMaterias = useCallback(async () => {
        try {
            const response = await MateriaApi.listarPorUsuarioAsync(usuarioId, true);
            setMaterias(response);
        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
        }
    }, [usuarioId]);

    const carregarSprints = useCallback(async () => {
        try {
            const response = await SprintApi.listarPorUsuarioAsync(usuarioId, true);
            setSprints(response);
        } catch (error) {
            console.error("Erro ao carregar sprints:", error);
        }
    }, [usuarioId]);

    useEffect(() => {
        if (usuarioId && show) {
            carregarMaterias();
            carregarSprints();
        }
    }, [usuarioId, show, carregarMaterias, carregarSprints]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await MetaEstudoApi.AdicionarAsync(
                usuarioId,
                sprintSelecionada,
                materiaSelecionada,
                Number(horasPlanejadas)
            );
            onSave();
            onHide();
        } catch (error) {
            console.error("Erro ao criar meta", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Nova Meta de Estudo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Matéria</Form.Label>
                        <Form.Select
                            value={materiaSelecionada || ""}
                            onChange={(e) => setMateriaSelecionada(Number(e.target.value))}
                        >
                            <option value="">Selecione uma matéria</option>
                            {materias.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Sprint</Form.Label>
                        <Dropdown onSelect={(id) => setSprintSelecionada(Number(id))}>
                            <Dropdown.Toggle variant="secondary">
                                {sprints.find((s) => s.id === sprintSelecionada)?.nome || "Selecionar Sprint"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {sprints.map((s) => (
                                    <Dropdown.Item key={s.id} eventKey={s.id}>
                                        {s.nome}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    <Form.Group controlId="horasPlanejadas" className="mb-3">
                        <Form.Label>Horas Planejadas</Form.Label>
                        <Form.Control
                            type="number"
                            value={horasPlanejadas}
                            onChange={(e) => setHorasPlanejadas(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="modal-footer mt-3">
                        <Button variant="secondary" onClick={onHide} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !materiaSelecionada || !sprintSelecionada}
                        >
                            {loading ? "Salvando..." : "Criar"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MetaCreateModal;
