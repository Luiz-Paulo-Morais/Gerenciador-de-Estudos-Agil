import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // ✅ Certifique-se de que está correto

// 🔥 Definição dos Tipos de Usuário (baseado no backend)
const TIPOS_USUARIO = {
    ADMINISTRADOR: 0,
    DEFAULT: 1,
    CONVIDADO: 2
};

const usePermissao = (usuarioIdRecurso = null) => {
    const { usuario } = useContext(AuthContext); // ✅ Obtém usuário logado
    const tipoUsuario = usuario?.tipoUsuario; // ✅ Agora é um número (0,1,2)
    const usuarioLogadoId = usuario?.userId; // ✅ Obtém ID do usuário logado

    console.log("🚀 Debug - Usuário Logado:", { usuarioLogadoId, tipoUsuario, usuarioIdRecurso });

    /** 
     * 📌 📌 Lógica de permissões
     * - Administrador: Acesso total
     * - Default: Edita apenas seus próprios dados
     * - Convidado: Apenas visualização
     */
    const permissoes = {
        [TIPOS_USUARIO.ADMINISTRADOR]: {
            podeEditar: true,
            podeExcluir: true,
            podeCriar: true,
            podeVisualizarTudo: true, // ✅ Pode ver tudo
        },
        [TIPOS_USUARIO.DEFAULT]: {
            podeEditar: usuarioIdRecurso ? usuarioLogadoId === usuarioIdRecurso : true, // ✅ Se tiver usuárioId, só pode editar os seus próprios
            podeExcluir: usuarioIdRecurso ? usuarioLogadoId === usuarioIdRecurso : true,
            podeCriar: true,
            podeVisualizarTudo: false, // ❌ Não pode ver tudo
        },
        [TIPOS_USUARIO.CONVIDADO]: {
            podeEditar: false,
            podeExcluir: false,
            podeCriar: false,
            podeVisualizarTudo: false, // ❌ Não pode ver tudo
        }
    };

    return permissoes[tipoUsuario] || permissoes[TIPOS_USUARIO.CONVIDADO];
};

export default usePermissao;
