// src/components/DashboardDoador1/DashboardDoador1.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "../DashboardDaOng1/DashboardDaOng1.module.css";
import Acoes from "../Acoes/Acoes.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";
import SeloVoluntario from "../SeloVoluntario/SeloVoluntario.jsx";

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

    const [ongsSeguidas, setOngsSeguidas] = useState([]);
    const [loadingOngs, setLoadingOngs] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const ongsPorPagina = 3;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const tokenData = decodificarToken(token);
        if (!tokenData || tokenData.tipo !== 1) { localStorage.clear(); navigate('/login'); return; }

        const id = tokenData.id_usuarios;
        setIdDoador(id);

        const nome = localStorage.getItem('nome');
        if (nome) setNomeDoador(nome);

        buscarOngsSeguidas(token);
    }, []);

    const sucesso = localStorage.getItem('sucesso');
    useEffect(() => {
        if (sucesso) { setMensagem(sucesso); setTipoMensagem('sucesso'); localStorage.removeItem('sucesso'); }
    }, [sucesso]);

    async function buscarOngsSeguidas(token) {
        try {
            const response = await fetch(`${api_url}/minhas_ongs_seguidas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOngsSeguidas(data.ongs || []);
            }
        } catch (error) { console.error('Erro ao buscar ONGs seguidas:', error); }
        finally { setLoadingOngs(false); }
    }

    const totalPaginas = Math.ceil(ongsSeguidas.length / ongsPorPagina);
    const indiceInicio = (paginaAtual - 1) * ongsPorPagina;
    const ongsPaginaAtual = ongsSeguidas.slice(indiceInicio, indiceInicio + ongsPorPagina);

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

                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333', marginTop: '40px', marginBottom: '25px' }}>
                    Suas ONGs do <span style={{ color: '#000' }}>coração</span>
                </h2>

                {loadingOngs ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Carregando...</p>
                ) : ongsSeguidas.length === 0 ? (

                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>Você ainda não segue nenhuma ONG</p>


                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
                            {ongsPaginaAtual.map(ong => (
                                <Link to={`/ong/${ong.id}`} key={ong.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={ong.foto ? `${api_url}/uploads/Usuarios/${ong.foto}` : '/ong-icon.png'}
                                            alt={ong.nome}
                                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                            onError={(e) => { e.currentTarget.src = '/sem_imagem.webp'; }}
                                        />
                                        <SeloVoluntario idUsuario={idDoador} apiUrl={api_url} />
                                    </div>
                                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#333', textAlign: 'center' }}>{ong.nome}</span>
                                </Link>
                            ))}
                        </div>

                        {totalPaginas > 1 && (
                            <div className={css.paginacao}>
                                <button onClick={() => setPaginaAtual(p => p - 1)} disabled={paginaAtual === 1} className={css.botaoPagina}>← Anterior</button>
                                <span className={css.paginaInfo}>{paginaAtual} de {totalPaginas}</span>
                                <button onClick={() => setPaginaAtual(p => p + 1)} disabled={paginaAtual === totalPaginas} className={css.botaoPagina}>Próxima →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}