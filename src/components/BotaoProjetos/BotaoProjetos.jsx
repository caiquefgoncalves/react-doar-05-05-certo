// src/components/BotaoProjetos/BotaoProjetos.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./BotaoProjetos.module.css";

const API_URL = "http://10.92.3.133:5000";

export default function BotaoProjetos({ status = 1, projetoId, usuarioTipo, apiUrl }) {
    const navigate = useNavigate();
    const [jaVoluntariou, setJaVoluntariou] = useState(false);
    const [loading, setLoading] = useState(true);

    const api = apiUrl || API_URL;

    useEffect(() => {
        if (status === 1 && usuarioTipo === 1 && projetoId) {
            verificarVoluntariado();
        } else {
            setLoading(false);
        }
    }, [projetoId, usuarioTipo]);

    async function verificarVoluntariado() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api}/verificar_voluntario_projeto/${projetoId}`, {
                headers: { 'Authorization': `Bearer ${token || ''}` }
            });
            if (response.ok) {
                const data = await response.json();
                setJaVoluntariou(data.voluntariou);
            }
        } catch (error) {
            console.error('Erro ao verificar voluntariado:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (usuarioTipo === 0 || usuarioTipo === 2) return;

        if (status === 0) {
            navigate(`/doar/${projetoId}`);
        } else if (status === 1 && !jaVoluntariou) {
            navigate(`/voluntario/${projetoId}`);
        }
    }


    if (loading) {
        return (
            <button type="button" className={css.voluntario} disabled>
                Carregando...
            </button>
        );
    }

    if (status === 1 && jaVoluntariou) {
        return (
            <button type="button" className={css.voluntariadoFeito} disabled>
                Voluntariado
            </button>
        );
    }

    return (
        <button type="button" className={status === 0 ? css.doacao : css.voluntario} onClick={handleClick}
                disabled={loading || usuarioTipo !== 1}
                title={usuarioTipo === 1
                    ? 'Contribuir'
                    : (usuarioTipo === 0 || usuarioTipo === 2)
                        ? 'Apenas doadores podem contribuir'
                        : 'Logue como doador para contribuir'}
        >
            {status === 0 ? "Faça sua doação" : "Seja um voluntário"}
        </button>
    );
}