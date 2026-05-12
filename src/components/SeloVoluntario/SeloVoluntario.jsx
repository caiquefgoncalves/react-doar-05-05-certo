// src/components/SeloVoluntario/SeloVoluntario.jsx
import { useState, useEffect } from "react";

export default function SeloVoluntario({ idUsuario, apiUrl }) {
    const [isVoluntario, setIsVoluntario] = useState(false);

    useEffect(() => {
        verificarVoluntario();
    }, [idUsuario]);

    async function verificarVoluntario() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/verificar_voluntario/${idUsuario}`, {
                headers: { 'Authorization': `Bearer ${token || ''}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsVoluntario(data.voluntario);
            }
        } catch (error) {
            console.error('Erro ao verificar voluntário:', error);
        }
    }

    if (!isVoluntario) return null;

    return (
        <img
            src="/coracao_dourado.png"
            alt="Selo Voluntário"
            style={{
                width: '22px',
                height: '22px',
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                zIndex: 2
            }}
            title="Este usuário é voluntário!"
        />
    );
}