// src/components/BotaoSeguir/BotaoSeguir.jsx
import { useState, useEffect } from 'react';
import css from './BotaoSeguir.module.css';

export default function BotaoSeguir({ idOng, apiUrl, onStatusChange }) {
    const [seguindo, setSeguindo] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        verificarStatus();
    }, [idOng]);

    async function verificarStatus() {
        try {
            const response = await fetch(`${apiUrl}/verificar_seguindo/${idOng}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setSeguindo(data.seguindo);
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    }

    async function toggleSeguir(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setLoading(true);

        try {
            const endpoint = seguindo ? 'desseguir' : 'seguir';
            const response = await fetch(`${apiUrl}/${endpoint}/${idOng}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                const novoStatus = !seguindo;
                setSeguindo(novoStatus);

                if (onStatusChange) {
                    onStatusChange(novoStatus);
                }

                // Feedback visual
                const btn = document.getElementById(`btn-seguir-${idOng}`);
                if (btn) {
                    btn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 200);
                }
            } else {
                alert(data.error || 'Erro ao processar solicitação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            id={`btn-seguir-${idOng}`}
            className={`${css.botaoSeguir} ${seguindo ? css.seguindo : ''}`}
            onClick={toggleSeguir}
            disabled={loading}
            title={seguindo ? 'Deixar de seguir' : 'Seguir esta ONG'}
        >
            {loading ? (
                <span className={css.loader}></span>
            ) : (
                <>
                    {seguindo ? (
                        <>
                            <span>✓</span> Seguindo
                        </>
                    ) : (
                        <>
                            <span>+</span> Seguir
                        </>
                    )}
                </>
            )}
        </button>
    );
}