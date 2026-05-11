// src/components/Feed1/Feed1.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import css from "./Feed1.module.css";
import Curtida from "../Curtida/Curtida.jsx";

export default function Feed({ api }) {
    const navigate = useNavigate();
    const [atualizacoes, setAtualizacoes] = useState([]);
    const [todasAtualizacoes, setTodasAtualizacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtro, setFiltro] = useState('recentes'); // 'recentes', 'antigos', 'seguindo'

    const [pagina, setPagina] = useState(0);
    const [temMais, setTemMais] = useState(true);

    // Estados para comentários
    const [comentarios, setComentarios] = useState({});
    const [novoComentario, setNovoComentario] = useState({});
    const [mostrarComentarios, setMostrarComentarios] = useState({});
    const [usuarioTipo, setUsuarioTipo] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    const api_url = api;

    // Funções auxiliares
    function decodificarToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }

    function tokenExpirado(token) {
        try {
            const tokenData = decodificarToken(token);
            if (!tokenData || !tokenData.exp) return false;
            const agora = Math.floor(Date.now() / 1000);
            return agora >= tokenData.exp;
        } catch (error) {
            return true;
        }
    }

    function verificarUsuario() {
        const token = localStorage.getItem('token');
        if (token && !tokenExpirado(token)) {
            try {
                const payload = decodificarToken(token);
                if (payload) {
                    setUsuarioTipo(payload.tipo);
                    setUsuarioId(payload.id_usuarios);
                }
            } catch (error) {
                console.error('Erro ao decodificar token:', error);
            }
        }
    }

    useEffect(() => {
        // Verificar autenticação
        const token = localStorage.getItem('token');
        if (token && tokenExpirado(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('nome');
            localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
            navigate('/login');
            return;
        }

        verificarUsuario();
        setPagina(0);
        setTemMais(true);
        buscarAtualizacoes(0, false);
    }, []);

    async function buscarAtualizacoes(novaPagina = 0, append = false) {
        try {
            if (!append) setLoading(true);

            const token = localStorage.getItem('token');

            // Escolher a URL baseada no filtro
            let url;
            if (filtro === 'seguindo') {
                // Verificar se está logado como doador
                if (!token || usuarioTipo !== 1) {
                    alert('Faça login como doador para ver postagens das ONGs que você segue.');
                    setFiltro('recentes');
                    return;
                }
                url = `${api_url}/feed_favoritas?pagina=${novaPagina}&limite=4`;
            } else {
                // 'recentes' ou 'antigos'
                url = `${api_url}/feed_atualizacoes?filtro=${filtro}&pagina=${novaPagina}&limite=4&token=${token || ''}`;
            }

            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token || ''}`
                }
            });

            // Verificar se o token expirou
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('nome');
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }

            // Verificar permissão
            if (response.status === 403) {
                alert('Apenas doadores podem acessar este feed.');
                setFiltro('recentes');
                return;
            }

            const data = await response.json();

            if (data.atualizacoes) {
                if (append) {
                    setTodasAtualizacoes(prev => [...prev, ...data.atualizacoes]);
                } else {
                    setTodasAtualizacoes(data.atualizacoes);
                }

                if (data.atualizacoes.length < 4) {
                    setTemMais(false);
                }
            } else {
                if (!append) setTodasAtualizacoes([]);
                setTemMais(false);
            }
        } catch (error) {
            console.error('Erro ao buscar:', error);
            setTemMais(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let filtradas = todasAtualizacoes;

        if (busca.trim()) {
            const termo = busca.toLowerCase();
            filtradas = filtradas.filter(item =>
                (item.titulo && item.titulo.toLowerCase().includes(termo)) ||
                (item.texto && item.texto.toLowerCase().includes(termo)) ||
                (item.ong_nome && item.ong_nome.toLowerCase().includes(termo))
            );
        }

        setAtualizacoes(filtradas);
    }, [busca, todasAtualizacoes]);

    // Quando mudar o filtro, recarregar
    useEffect(() => {
        setPagina(0);
        setTemMais(true);
        buscarAtualizacoes(0, false);
    }, [filtro]);

    // Funções para comentários
    async function carregarComentarios(idAtualizacao) {
        if (comentarios[idAtualizacao]) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/comentarios/${idAtualizacao}`, {
                headers: {
                    'Authorization': `Bearer ${token || ''}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setComentarios(prev => ({
                    ...prev,
                    [idAtualizacao]: data.comentarios || []
                }));

                // Atualizar contador
                setTodasAtualizacoes(prev =>
                    prev.map(item => {
                        if (item.id === idAtualizacao) {
                            return {
                                ...item,
                                qtd_comentarios: data.total || data.comentarios?.length || 0
                            };
                        }
                        return item;
                    })
                );

                setAtualizacoes(prev =>
                    prev.map(item => {
                        if (item.id === idAtualizacao) {
                            return {
                                ...item,
                                qtd_comentarios: data.total || data.comentarios?.length || 0
                            };
                        }
                        return item;
                    })
                );
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
    }

    async function enviarComentario(idAtualizacao) {
        const texto = novoComentario[idAtualizacao]?.trim();
        if (!texto) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para comentar');
                return;
            }

            if (tokenExpirado(token)) {
                localStorage.removeItem('token');
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${api_url}/comentar/${idAtualizacao}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();

                setComentarios(prev => ({
                    ...prev,
                    [idAtualizacao]: [...(prev[idAtualizacao] || []), data.comentario]
                }));

                // Atualizar contador
                setTodasAtualizacoes(prev =>
                    prev.map(item => {
                        if (item.id === idAtualizacao) {
                            return {
                                ...item,
                                qtd_comentarios: (item.qtd_comentarios || 0) + 1
                            };
                        }
                        return item;
                    })
                );

                setAtualizacoes(prev =>
                    prev.map(item => {
                        if (item.id === idAtualizacao) {
                            return {
                                ...item,
                                qtd_comentarios: (item.qtd_comentarios || 0) + 1
                            };
                        }
                        return item;
                    })
                );

                setNovoComentario(prev => ({
                    ...prev,
                    [idAtualizacao]: ''
                }));
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao comentar');
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert('Erro ao conectar com o servidor');
        }
    }

    function toggleComentarios(idAtualizacao) {
        if (!mostrarComentarios[idAtualizacao]) {
            carregarComentarios(idAtualizacao);
        }
        setMostrarComentarios(prev => ({
            ...prev,
            [idAtualizacao]: !prev[idAtualizacao]
        }));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {}
    }

    // Função para mudar o filtro
    function handleMudarFiltro(novoFiltro) {
        if (novoFiltro === 'seguindo') {
            const token = localStorage.getItem('token');
            if (!token || tokenExpirado(token)) {
                alert('Faça login como doador para acessar este feed.');
                navigate('/login');
                return;
            }

            const payload = decodificarToken(token);
            if (!payload || payload.tipo !== 1) {
                alert('Apenas doadores podem acessar este feed.');
                return;
            }
        }

        setFiltro(novoFiltro);
    }

    if (loading && pagina === 0) {
        return (
            <section className={css.secao}>
                <MenuLateral />
                <div className={css.conteudo}>
                    <p style={{ textAlign: 'center', padding: '50px' }}>Carregando...</p>
                </div>
            </section>
        );
    }

    return (
        <div>
            <section className={css.secao}>
                <MenuLateral />
                <div className={css.conteudo}>

                    {/* Barra topo */}
                    <div className={css.barraTopo}>
                        <div className={css.buscaInput}>
                            <input
                                type="text"
                                placeholder="Busque por Atualizações"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={css.inputBusca}
                            />
                            <button className={css.btnBuscar}>🔍︎</button>
                        </div>

                        <div className={css.filtro}>
                            <span>Filtrar por:</span>
                            <select
                                value={filtro}
                                onChange={(e) => handleMudarFiltro(e.target.value)}
                                className={css.selectFiltro}
                            >
                                <option value="recentes">Mais recentes</option>
                                <option value="antigos">Mais antigos</option>
                                <option value="seguindo">Seguindo</option>
                            </select>
                        </div>
                    </div>

                   

                    {/* Lista */}
                    {atualizacoes.length === 0 ? (
                        <div className={css.vazio}>
                            {filtro === 'seguindo' ? (
                                <>
                                    <p>Nenhuma postagem das ONGs que você segue.</p>
                                    <p style={{ fontSize: '13px', color: '#999' }}>
                                        Siga ONGs para ver as novidades delas aqui!
                                    </p>
                                    <Link to="/ongs" style={{ color: '#167cbf', textDecoration: 'none', fontWeight: '600' }}>
                                        Encontrar ONGs
                                    </Link>
                                </>
                            ) : (
                                <p>Nenhuma atualização encontrada.</p>
                            )}
                        </div>
                    ) : (
                        atualizacoes.map(item => (
                            <div key={`att-${item.id}`} className={css.cardAtualizacao}>

                                <Link to={`/ong/${item.ong_id}`} className={css.header}>
                                    <img
                                        src={item.ong_foto ? `${api_url}/uploads/Usuarios/${item.ong_foto}` : '/ong-icon.png'}
                                        alt={item.ong_nome}
                                        className={css.fotoOng}
                                        onError={(e) => {
                                            e.currentTarget.src = '/sem_imagem.webp';
                                        }}
                                    />
                                    <div className={css.headerInfo}>
                                        <h3 className={css.nomeOng}>{item.ong_nome}</h3>
                                        <span className={css.data}>{item.data}</span>
                                    </div>
                                    <Curtida idAtualizacao={item.id} apiUrl={api_url} />
                                </Link>

                                <div className={css.corpo}>
                                    {item.foto && (
                                        <img
                                            src={`${api_url}/uploads/Atualizacoes/${item.foto}`}
                                            alt={item.titulo}
                                            onError={(e) => {
                                                e.currentTarget.src = '/sem_imagem.webp';
                                            }}
                                            className={css.fotoAtualizacao}
                                        />
                                    )}

                                    <div className={css.textoContainer}>
                                        <h2 className={css.tituloAtualizacao}>{item.titulo}</h2>
                                        <p className={css.infoPost}>
                                            {item.qtd_curtidas || 0} curtidas • {item.qtd_comentarios || 0} comentários
                                        </p>
                                        {item.texto && (
                                            <p className={css.textoAtualizacao}>{item.texto}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Seção de Comentários */}
                                <div className={css.comentariosSecao}>
                                    <button
                                        className={css.btnComentarios}
                                        onClick={() => toggleComentarios(item.id)}
                                    >
                                        💬 Comentários ({item.qtd_comentarios || 0})
                                    </button>

                                    {mostrarComentarios[item.id] && (
                                        <div className={css.comentariosContainer}>
                                            {comentarios[item.id]?.length > 0 ? (
                                                comentarios[item.id].map(comentario => (
                                                    <div key={comentario.id} className={css.comentario}>
                                                        <div className={css.comentarioHeader}>
                                                            <img
                                                                src={comentario.usuario_foto ? `${api_url}/uploads/Usuarios/${comentario.usuario_foto}` : '/user-icon.png'}
                                                                alt={comentario.usuario_nome}
                                                                className={css.comentarioFoto}
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/user-icon.png';
                                                                }}
                                                            />
                                                            <div className={css.comentarioInfo}>
                                                                <span className={css.comentarioNome}>
                                                                    {comentario.usuario_nome}
                                                                </span>
                                                                <span className={css.comentarioData}>
                                                                    {comentario.data_criacao}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className={css.comentarioTexto}>
                                                            {comentario.texto}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '10px' }}>
                                                    Nenhum comentário ainda. Seja o primeiro!
                                                </p>
                                            )}

                                            {usuarioTipo === 1 && (
                                                <div className={css.novoComentario}>
                                                    <input
                                                        type="text"
                                                        placeholder="Escreva um comentário..."
                                                        value={novoComentario[item.id] || ''}
                                                        onChange={(e) => setNovoComentario(prev => ({
                                                            ...prev,
                                                            [item.id]: e.target.value
                                                        }))}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                enviarComentario(item.id);
                                                            }
                                                        }}
                                                        className={css.inputComentario}
                                                    />
                                                    <button
                                                        onClick={() => enviarComentario(item.id)}
                                                        className={css.btnEnviarComentario}
                                                    >
                                                        Enviar
                                                    </button>
                                                </div>
                                            )}

                                            {usuarioTipo === 2 && (
                                                <p className={css.msgDoador}>Apenas doadores podem comentar.</p>
                                            )}

                                            {usuarioTipo === 0 && (
                                                <p className={css.msgDoador}>Administradores não podem comentar.</p>
                                            )}

                                            {!usuarioTipo && (
                                                <p className={css.msgLogin}>
                                                    <Link to="/login">Faça login</Link> como doador para comentar.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    )}

                    {temMais && (
                        <div className={'d-flex align-items-center justify-content-center'}>
                            <button
                                onClick={() => {
                                    const proximaPagina = pagina + 1;
                                    setPagina(proximaPagina);
                                    buscarAtualizacoes(proximaPagina, true);
                                }}
                                className={css.filtro}
                            >
                                {loading ? "Carregando..." : "Carregar mais"}
                            </button>
                        </div>
                    )}

                </div>
            </section>

            <button className={css.botaoVoltar} onClick={() => window.scrollTo(0, 0)}>
                ↑
            </button>
        </div>
    );
}