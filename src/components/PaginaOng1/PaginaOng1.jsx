// src/components/PaginaOng1/PaginaOng1.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import css from "./PaginaOng1.module.css";

export default function PaginaOng1({api}) {
    const api_url = api
    const { id } = useParams();
    let [ong, setOng] = useState(null);
    let [projetos, setProjetos] = useState([]);
    let [qtdProjetos, setQtdProjetos] = useState('');
    let [qtdAtualizacoes, setQtdAtualizacoes] = useState('');
    let [atualizacoes, setAtualizacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    let [paginaProjetos, setPaginasProjetos] = useState(0);
    let [idsAbertos, setIdsAbertos] = useState("");
    let [paginaAtualizacoes, setPaginaAtualizacoes] = useState(0);

    // Detectar se é mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);

    // Quantidade de itens por página (dinâmico)
    const projetosPorPagina = isMobile ? 1 : 2;
    const atualizacoesPorPagina = isMobile ? 1 : 2;


    useEffect(() => {
        buscarDados();

        // Listener para redimensionamento
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 425);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    async function buscarDados() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/ver_ong_publica/${id}?token=${token || ''}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Dados ONG:', data);
                if (data.ong) setOng(data.ong);
                if (data.projetos) setProjetos(data.projetos);
                if (data.atualizacoes) setAtualizacoes(data.atualizacoes || []);
                if (data.qtd_projetos) setQtdProjetos(data.qtd_projetos || []);
                if (data.qtd_atualizacoes) setQtdAtualizacoes(data.qtd_atualizacoes);
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    if (loading) return (
        <section className={css.secao}>
            <div className={css.menulateral}>
                <MenuLateral/>
            </div>
            <div className={css.conteudo}><p>Carregando...</p></div>
        </section>
    );

    if (!ong) return (
        <section className={css.secao}>
            <div className={css.menulateral}>
                <MenuLateral/>
            </div>
            <div className={css.conteudo}><p>ONG não encontrada</p></div>
        </section>
    );

    const totalPaginasProjetos = Math.ceil(projetos.length / projetosPorPagina);

    const projetosPaginados = projetos.slice(
        paginaProjetos * projetosPorPagina,
        (paginaProjetos + 1) * projetosPorPagina
    );

    const proximaPaginaProjetos = () => {
        if (paginaProjetos < totalPaginasProjetos - 1) {
            setPaginasProjetos(p => p + 1);
        }
    };

    const paginaAnteriorProjetos = () => {
        if (paginaProjetos > 0) {
            setPaginasProjetos(p => p - 1);
        }
    };

    const totalPaginasAtualizacoes = Math.ceil(atualizacoes.length / atualizacoesPorPagina);

    const atualizacoesPaginadas = atualizacoes.slice(
        paginaAtualizacoes * atualizacoesPorPagina,
        (paginaAtualizacoes + 1) * atualizacoesPorPagina
    );

    const proximaPaginaAtualizacoes = () => {
        if (paginaAtualizacoes < totalPaginasAtualizacoes - 1) {
            setPaginaAtualizacoes(p => p + 1);
        }
    };

    const paginaAnteriorAtualizacoes = () => {
        if (paginaAtualizacoes > 0) {
            setPaginaAtualizacoes(p => p - 1);
        }
    };



    return (
        <section className={css.secao}>
            <div className={css.menulateral}>
                <MenuLateral/>
            </div>
            <div className={css.conteudo}>

                <div className={css.layoutDuasColunas}>

                    {/* Coluna Esquerda */}
                    <div className={css.colunaEsquerda}>
                        <div className={css.headerONG}>
                            {ong && (
                                <img
                                    className={css.imagem}
                                    src={`${api_url}/uploads/Usuarios/${ong.id}.jpeg`}
                                    alt={`Logo da ONG ${ong.nome}`}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/sem_imagem.webp';
                                    }}
                                />

                            )}
                            <div>
                                <h1 className={css.nome}>{ong.nome}</h1>
                                <p className={css.descBreve}>{ong.descricao_breve}</p>                    </div>
                        </div>


                        {/* Sobre Nós */}
                        <div className={css.secaoBox}>
                            <p className={css.sobrenos}>Sobre nós</p>
                            <p className={css.descLonga}>{ong.descricao_longa || 'Sem descrição detalhada.'}</p>
                        </div>

                        {/* Informações */}
                        <div className={css.secaoBox}>
                            <div className={css.infoGrid}>
                                <div>
                                    <span className={css.infoLabel}>Categoria</span>
                                    <p className={css.infoValor}>{ong.categoria || 'Não informada'}</p>
                                </div>
                                <div>
                                    <span className={css.infoLabel}>Localização</span>
                                    <p className={css.infoValor}>{ong.localizacao || 'Não informada'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Projetos da ONG */}
                        {projetos.length > 0 && (
                            <div className={css.secaoBox}>
                                <div className={css.headerAtualizacoes}>
                                    <p className={css.sobrenos}>Projetos ativos</p>
                                    {qtdProjetos == 0 && (
                                        <p className={css.texto}>Não há projetos</p>
                                    )}
                                    {qtdProjetos == 1 && (
                                        <p className={css.texto}>{qtdProjetos} projeto</p>
                                    )}
                                    {qtdProjetos > 1 && (
                                        <p className={css.texto}>{qtdProjetos} projetos</p>
                                    )}
                                </div>
                                <div className={css.projetosLista}>
                                    {/* MAPEANDO APENAS OS PAGINADOS */}
                                    {projetosPaginados.map(proj => (
                                        <Link to={`/projeto/${proj.id}`} key={proj.id} className={css.atualizacao}>
                                            <img
                                                className={css.attImagem}
                                                src={`${api_url}/uploads/Projetos/${proj.id}.jpeg`}
                                                alt={proj.titulo}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.currentTarget.src = '/sem_imagem.webp';
                                                }}
                                            />
                                            <h3 className={css.attTitulo}>{proj.titulo}</h3>
                                            <p className={css.attTexto}>{proj.descricao?.substring(0, 100)}...</p>
                                            <span className={css.tipoAjuda}>{proj.tipo_ajuda}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* CONTROLES DO CARROSSEL */}
                                {totalPaginasProjetos > 1 && (
                                    <div className={css.controlesCarrossel}>
                                        <button
                                            className={`${css.botaoCarrossel} ${paginaProjetos === 0 ? css.desabilitado : ''}`}
                                            onClick={paginaAnteriorProjetos}
                                            disabled={paginaProjetos === 0}
                                        > ← </button>

                                        <span className={css.paginaInfo}>
                                            {paginaProjetos + 1} de {totalPaginasProjetos}
                                        </span>

                                        <button
                                            className={`${css.botaoCarrossel} ${paginaProjetos === totalPaginasProjetos - 1 ? css.desabilitado : ''}`}
                                            onClick={proximaPaginaProjetos}
                                            disabled={paginaProjetos === totalPaginasProjetos - 1}
                                        > → </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Últimas atualizações da ONG */}
                        {atualizacoes.length > 0 && (
                            <div className={css.secaoBox}>
                                <div className={css.headerAtualizacoes}>
                                    <p className={css.sobrenos}>Últimas atualizações</p>
                                    {qtdAtualizacoes == 0 && (
                                        <p className={css.texto}>Não há atualizações</p>
                                    )}
                                    {qtdAtualizacoes == 1 && (
                                        <p className={css.texto}>{qtdAtualizacoes} atualização</p>
                                    )}
                                    {qtdAtualizacoes > 1 && (
                                        <p className={css.texto}>{qtdAtualizacoes} atualizações</p>
                                    )}
                                </div>
                                <div className={css.projetosLista}>
                                    {atualizacoesPaginadas.map(att => (
                                        <div key={att.id} className={css.atualizacao}>
                                            {att && (
                                                <img
                                                    className={css.attImagem}
                                                    src={`${api_url}/uploads/Atualizacoes/${att.id}.jpeg`}
                                                    alt={att.titulo}
                                                    onError={(e) => { e.target.onerror = null;
                                                        e.currentTarget.src = '/sem_imagem.webp';
                                                    }}
                                                />
                                            )}
                                            <h3 className={css.attTitulo}>{att.titulo}</h3>
                                            {att.texto && (
                                                <p className={css.attTexto}>
                                                    {/* Só corta e coloca "..." se o texto for maior que 100 E não estiver aberto */}
                                                    {idsAbertos === att.id || att.texto.length <= 100
                                                        ? att.texto
                                                        : att.texto.substring(0, 100) + "..."}

                                                    {/* O botão só aparece se o texto for maior que 100 caracteres */}
                                                    {att.texto.length > 100 && (
                                                        <button
                                                            onClick={() => setIdsAbertos(idsAbertos === att.id ? null : att.id)}
                                                            className={css.btnDoar}>
                                                            {idsAbertos === att.id ? "Ler menos" : "Ler mais"}
                                                        </button>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {totalPaginasAtualizacoes > 1 && (
                                    <div className={css.controlesCarrossel}>
                                        <button
                                            className={`${css.botaoCarrossel} ${paginaAtualizacoes === 0 ? css.desabilitado : ''}`}
                                            onClick={paginaAnteriorAtualizacoes}
                                            disabled={paginaAtualizacoes === 0}
                                        >
                                            ←
                                        </button>
                                        <span className={css.paginaInfo}>{paginaAtualizacoes + 1} de {totalPaginasAtualizacoes}</span>
                                        <button
                                            className={`${css.botaoCarrossel} ${paginaAtualizacoes === totalPaginasAtualizacoes - 1 ? css.desabilitado : ''}`}
                                            onClick={proximaPaginaAtualizacoes}
                                            disabled={paginaAtualizacoes === totalPaginasAtualizacoes - 1}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {atualizacoes.length === 0 && (
                            <div className={css.secaoBox}>
                                <p className={css.sobrenos}>Últimas atualizações</p>
                                <p className={css.semAtualizacoes}>Nenhuma atualização disponível no momento.</p>
                            </div>
                        )}


                    </div>


                    <div className={css.colunaDireita}>
                        <div className={css.cardApoie}>
                            <Titulo titulo={`Apoie o ${ong.nome} diretamente!`} cor={'preto'}/>


                            <div className={css.dadosBancarios}>
                                <p><strong>Instituição:</strong><br/>{ong.cod_banco || 'Não informado'}</p>
                                <p><strong>Agência:</strong><br/>{ong.num_agencia || 'Não informada'}</p>
                                <p><strong>Titular:</strong><br/>{ong.nome}</p>
                                <p><strong>CNPJ:</strong><br/>{ong.cpf_cnpj}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}