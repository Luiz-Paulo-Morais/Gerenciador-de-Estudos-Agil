import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import MetaEstudoApi from "../../services/metaEstudoApi";
import MateriaApi from "../../services/materiaApi";
import SprintApi from "../../services/sprintApi";

const MetaEditModal = ({ show, onHide, meta, onSave }) => {
    const [formData, setFormData] = useState({
        horasPlanejadas: meta.horasPlanejadas,
        materiaId: meta.materiaId,
        sprintId: meta.sprintId
    });
    
    const [materias, setMaterias] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega matérias e sprints disponíveis
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [mats, sprints] = await Promise.all([
                    MateriaApi.listarPorUsuarioAsync(meta.usuarioId, true),
                    SprintApi.listarPorUsuarioAsync(meta.usuarioId, true)
                ]);
                setMaterias(mats);
                setSprints(sprints);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        
        if (show) {
            carregarDados();
        }
    }, [show, meta.usuarioId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'horasPlanejadas' ? Number(value) : value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await MetaEstudoApi.atualizarAsync(
                meta.id,
                meta.usuarioId, // Passando o usuarioId corretamente
                formData.sprintId,
                formData.materiaId,
                formData.horasPlanejadas
            );
            onSave();
            onHide();
        } catch (error) {
            console.error("Erro ao atualizar meta:", {
                message: error.message,
                response: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Meta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Matéria</Form.Label>
                        <Form.Select
                            name="materiaId"
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materias.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sprint</Form.Label>
                        <Form.Select
                            name="sprintId"
                            value={formData.sprintId}
                            onChange={handleChange}
                        >
                            {sprints.map(s => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Horas Planejadas</Form.Label>
                        <Form.Control
                            type="number"
                            name="horasPlanejadas"
                            value={formData.horasPlanejadas}
                            onChange={handleChange}
                            min="1"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MetaEditModal;