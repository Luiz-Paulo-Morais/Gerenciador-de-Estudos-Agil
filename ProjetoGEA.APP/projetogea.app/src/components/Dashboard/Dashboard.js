import React, { useState, useEffect } from "react";
import DashboardApi from "../../services/dashboardApi";
import MetaEstudoApi from "../../services/metaEstudoApi";
import SprintApi from "../../services/sprintApi";
import { Card, Row, Col, Spinner, Alert, Button, Form } from "react-bootstrap";
import MetaCreateModal from "./MetaCreateModal";
import MetaEditModal from "./MetaEditModal";

const Dashboard = ({ usuario }) => {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sprintSelecionada, setSprintSelecionada] = useState(null);
    const [sprints, setSprints] = useState([]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [metaSelecionada, setMetaSelecionada] = useState(null);

    const userId = parseInt(usuario.userId);

    // Carrega a lista de sprints do usuário
    useEffect(() => {
        const carregarSprints = async () => {
            try {
                console.log('Carregando sprints para o usuário:', userId);
                const sprints = await SprintApi.listarPorUsuarioAsync(userId, true);
                console.log('Sprints recebidas:', sprints);
                setSprints(sprints);
            } catch (error) {
                console.error("Erro ao carregar sprints:", error);
            }
        };

        carregarSprints();
    }, [userId]);

    // Carrega os dados do dashboard
    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            const sprintId = sprintSelecionada ? Number(sprintSelecionada) : null;
            console.log('Carregando dados do dashboard para:', { userId, sprintId });
            const dados = await DashboardApi.obterDadosConsolidados(userId, sprintId);
            console.log('Dados recebidos do dashboard:', dados);
            setDados(dados);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setError({
                message: "Falha ao carregar dados do dashboard",
                retry: carregarDados
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Efeito disparado - userId ou sprintSelecionada mudou:', { userId, sprintSelecionada });
        carregarDados();
    }, [userId, sprintSelecionada]);

    const handleSprintChange = (e) => {
        const value = e.target.value;
        setSprintSelecionada(value ? Number(value) : null);
    };

    const handleCriarMeta = () => setShowCreateModal(true);

    const handleEditarMeta = (meta) => {
        setMetaSelecionada(meta);
        setShowEditModal(true);
    };

    const handleDeletarMeta = async (metaId) => {
        try {
            await MetaEstudoApi.deletarAsync(metaId);
            carregarDados();
        } catch (error) {
            console.error("Erro ao deletar meta:", error);
            setError({
                message: "Falha ao deletar meta",
                retry: () => handleDeletarMeta(metaId)
            });
        }
    };

    const handleSalvarMeta = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        carregarDados();
    };

    if (loading && !dados) return <Spinner animation="border" />;
    console.log('Dados atuais no estado:', dados);

    return (
        <div className="container">
            <h2>Dashboard de Progresso</h2>

            <div className="d-flex align-items-center mb-3">
                <Form.Group className="me-3" style={{ flex: 1 }}>
                    <Form.Label>Filtrar por Sprint:</Form.Label>
                    <Form.Select value={sprintSelecionada || ""} onChange={handleSprintChange}>
                        <option value="">Todas Sprints</option>
                        {sprints.map(sprint => (
                            <option key={sprint.id} value={sprint.id}>
                                {sprint.nome} ({new Date(sprint.dataInicio).toLocaleDateString()} - {new Date(sprint.dataFim).toLocaleDateString()})
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="success" onClick={handleCriarMeta} style={{ marginTop: '28px' }}>
                    + Nova Meta
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="mb-3">
                    {error.message}
                    <Button variant="outline-danger" onClick={error.retry} className="ms-3">
                        Tentar novamente
                    </Button>
                </Alert>
            )}

            {dados && (
                <>
                    {/* Seção de Métricas Gerais */}
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Horas Planejadas</Card.Title>
                                    <Card.Text>{dados.metricas.horasPlanejadas}h</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Horas Realizadas</Card.Title>
                                    <Card.Text>{dados.metricas.horasRealizadas.toFixed(1)}h</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Eficiência</Card.Title>
                                    <Card.Text>{dados.metricas.eficiencia.toFixed(1)}%</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Tarefas Concluídas</Card.Title>
                                    <Card.Text>
                                        {dados.metricas.tarefasConcluidas} de {dados.tarefas.length}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Seção de Métricas de Simulados */}
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Simulados Realizados</Card.Title>
                                    <Card.Text>{dados.metricas.simulados.totalSimulados}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Taxa de Acerto</Card.Title>
                                    <Card.Text>
                                        {dados.metricas.simulados.taxaAcerto.toFixed(1)}%
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Melhor Desempenho</Card.Title>
                                    <Card.Text>
                                        {dados.metricas.simulados.melhorDesempenho.toFixed(1)}%
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Questões Respondidas</Card.Title>
                                    <Card.Text>{dados.metricas.simulados.totalQuestoes}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Seção de Metas */}
                    <h3>Metas</h3>
                    <Row>
                        {dados.metas.map(meta => (
                            <Col key={meta.id} md={4} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{meta.nomeMateria}</Card.Title>
                                        <Card.Text>
                                            Progresso: {meta.progresso.toFixed(1)}%<br />
                                            {meta.horasRealizadas.toFixed(1)}h de {meta.horasPlanejadas}h
                                        </Card.Text>
                                        <div className="progress mb-3">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${meta.progresso}%` }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleEditarMeta(meta)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeletarMeta(meta.id)}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Seção de Simulados */}
                    <h3>Últimos Simulados</h3>
                    {console.log('Simulados para exibição:', dados.simulados)}
                    {dados.simulados && dados.simulados.length > 0 ? (
                        <Row>
                            {dados.simulados
                                .sort((a, b) => new Date(b.dataAplicacao) - new Date(a.dataAplicacao))
                                .slice(0, 3)
                                .map(simulado => (
                                    <Col key={simulado.id} md={4} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{simulado.nome}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {simulado.materiaNome} • {simulado.dataFormatada}
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    <strong>{simulado.totalAcertos}/{simulado.totalQuestoes}</strong> questões<br />
                                                    <strong>{simulado.taxaAcerto.toFixed(1)}%</strong> de acerto
                                                </Card.Text>
                                                <div className="progress mb-2">
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${simulado.taxaAcerto}%` }}
                                                        aria-valuenow={simulado.taxaAcerto}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    ) : (
                        <Alert variant="info">
                            Nenhum simulado registrado ainda.
                        </Alert>
                    )}
                </>
            )}

            <MetaCreateModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSave={handleSalvarMeta}
                usuarioId={userId}
            />

            {metaSelecionada && (
                <MetaEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    meta={metaSelecionada}
                    onSave={handleSalvarMeta}
                />
            )}
        </div>
    );
};

export default Dashboard;