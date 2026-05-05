// src/components/DashboardDoador1/DashboardDoador1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "../DashboardDaOng1/DashboardDaOng1.module.css";
import Acoes from "../Acoes/Acoes.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function DashboardDoador1({ api }) {
    const navigate = useNavigate();
    const api_url = api;
    const [nomeDoador, setNomeDoador] = useState('');
    const [idDoador, setIdDoador] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const tokenData = decodificarToken(token);
        if (!tokenData || tokenData.tipo !== 1) { localStorage.clear(); navigate('/login'); return; }

        const id = tokenData.id_usuarios;
        console.log('ID Doador:', id); // Debug
        setIdDoador(id);

        const nome = localStorage.getItem('nome');
        if (nome) setNomeDoador(nome);
    }, []);

    const sucesso = localStorage.getItem('sucesso');
    useEffect(() => {
        if (sucesso) { setMensagem(sucesso); setTipoMensagem('sucesso'); localStorage.removeItem('sucesso'); }
    }, [sucesso]);

    function irParaEditar() {
        console.log('Navegando para editar doador ID:', idDoador);
        navigate(`/editarDoador/${idDoador}`);
    }

    return (
        <section className={css.secao}>
            <section className={css.menulateral}><MenuLateral/></section>
            <div className={css.conteudo}>
                <Mensagem tipo={tipoMensagem} texto={mensagem} onClose={() => setMensagem('')} />
                <div className={css.Titulo}><Titulo titulo={`Olá,`} cor={'saudacao'} span={nomeDoador} corSpan={'rosa-span'}/></div>
                <p className={css.acoesRapidas}>Ações rápidas</p>
                <div className={css.acoes}>
                    <Acoes cor={'amarelo'} texto={'Editar perfil'} pagina={`/editarDoador/${idDoador}`}/>
                </div>
            </div>
        </section>
    );
}