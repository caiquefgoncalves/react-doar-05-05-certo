import { useState, useEffect } from "react";
import css from "./Curtida.module.css";

export default function Curtida({ idAtualizacao, apiUrl, onStatusChange }) {
    const [curtido, setCurtido] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        verificarStatus();
    }, [idAtualizacao]);

    async function verificarStatus() {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/verificar_curtida/${idAtualizacao}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCurtido(data.curtido);
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    }

    async function toggleCurtir(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            const endpoint = curtido ? 'descurtir' : 'curtir';
            const response = await fetch(`${apiUrl}/${endpoint}/${idAtualizacao}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const novoStatus = !curtido;
                setCurtido(novoStatus);

                if (onStatusChange) {
                    onStatusChange(novoStatus);
                }
            }
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            className={css.curtida}
            onClick={toggleCurtir}
            disabled={loading}
            id={`btn-curtir-${idAtualizacao}`}
        >
            {loading ? (
                <span className={css.loader}></span>
            ) : curtido ? (
                <img className={css.coracao} src="/curtido.png" alt="Curtido" />
            ) : (
                <img className={css.coracao} src="/curtir.png" alt="Curtir" />
            )}
        </button>
    );
}