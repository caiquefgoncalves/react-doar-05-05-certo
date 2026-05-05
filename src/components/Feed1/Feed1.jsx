// src/components/Feed1/Feed1.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import css from "./Feed1.module.css";
import Curtida from "../Curtida/Curtida.jsx";

export default function Feed({api}) {
    const [atualizacoes, setAtualizacoes] = useState([]);
    const [todasAtualizacoes, setTodasAtualizacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtro, setFiltro] = useState('recentes');
    const api_url = api

    useEffect(() => {
        buscarAtualizacoes();
    }, []);

    async function buscarAtualizacoes() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${api_url}/feed_atualizacoes?filtro=${filtro}&token=${token || ''}`;
            console.log('Buscando:', url);

            const response = await fetch(url, { credentials: 'include' });
            const data = await response.json();
            console.log('Resposta feed:', data);

            if (data.atualizacoes) {
                setTodasAtualizacoes(data.atualizacoes);
                setAtualizacoes(data.atualizacoes);
            } else {
                setTodasAtualizacoes([]);
                setAtualizacoes([]);
            }
        } catch (error) {
            console.error('Erro ao buscar:', error);
            setTodasAtualizacoes([]);
            setAtualizacoes([]);
        } finally {
            setLoading(false);
        }
    }

    // Filtrar atualizações quando busca ou filtro mudar
    useEffect(() => {
        let filtradas = todasAtualizacoes;

        // Filtro por busca (pesquisa por título, texto ou nome da ONG)
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

    // Recarregar quando o filtro mudar
    useEffect(() => {
        buscarAtualizacoes();
    }, [filtro]);

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            // A busca já é feita em tempo real pelo useEffect
        }
    }

    if (loading) {
        return (
            <section className={css.secao}>
                <MenuLateral/>
                <div className={css.conteudo}>
                    <p style={{ textAlign: 'center', padding: '50px' }}>Carregando...</p>
                </div>
            </section>
        );
    }

    return (
        <section className={css.secao}>
            <MenuLateral/>
            <div className={css.conteudo}>
                {/* Barra de busca e filtro */}
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
                        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className={css.selectFiltro}>
                            <option value="recentes">Mais recentes</option>
                            <option value="antigos">Mais antigos</option>
                        </select>
                    </div>
                </div>

                {/* Contador */}
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                    {atualizacoes.length} atualização(ões) encontrada(s)
                </p>

                {/* Lista de atualizações */}
                {atualizacoes.length === 0 ? (
                    <div className={css.vazio}>
                        <p>Nenhuma atualização encontrada.</p>

                    </div>
                ) : (
                    atualizacoes.map(item => (
                        <div key={`att-${item.id}`} className={css.cardAtualizacao}>
                            {/* Cabeçalho da ONG */}
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
                                <Curtida/>
                            </Link>

                            {/* Conteúdo da atualização */}
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
                                    {item.texto && (
                                        <p className={css.textoAtualizacao}>{item.texto}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}