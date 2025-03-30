import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    // 🔍 Função para buscar o usuário logado e armazenar no contexto
    const carregarUsuario = async () => {
        try {
            const response = await axios.get("http://localhost:5131/api/auth/me", {
                withCredentials: true,
            });
            
            if (response.data) {
                setUsuario(response.data); // ✅ Armazena nome, id e tipoUsuario                
            }
        } catch (error) {
            console.error("Erro ao buscar usuário autenticado", error);
            setUsuario(null);
        }
    };

    useEffect(() => {
        carregarUsuario();        
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};




/*import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5131/api/auth/me", { withCredentials: true })
            .then(response => {
                setUsuario(response.data);
                console.log("Usuário autenticado:", response.data);

            })
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
*/