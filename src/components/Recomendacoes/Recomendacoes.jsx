import { useState, useEffect } from 'react';
// Importamos o Link do react-router-dom para fazer a navegação
import { Link } from 'react-router-dom';
import css from './Recomendacoes.module.css';
import BotaoSeguir from "../BotaoSeguir/BotaoSeguir.jsx";

export default function Recomendacoes() {

    const api_url = "http://192.168.0.126:5000";

    const [ongs, setOngs] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);



    const buscarRecomendacoes = async () => {
        try {
            setCarregando(true);
            setErro(false);

            let url = `${api_url}/ongs_recomendacoes`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }

            const data = await response.json();

            if (data.ongs && data.ongs.length > 0) {
                setOngs(data.ongs);
            } else {
                setOngs(ongsMock);
            }
        } catch (error) {
            console.error("Erro ao buscar recomendações:", error);
            setErro(true);
            setOngs(ongsMock);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarRecomendacoes();
    }, []);

    function getImagemUrl(id) {
        return `${api_url}/uploads/Usuarios/${id}.jpeg`;
    }

    if (carregando) {
        return (
            <div className={css.card}>
                <div>
                    <h2>Recomendações</h2>
                </div>
                <div className={css.carregando}>
                    <div className={css.spinner}></div>
                    Carregando recomendações...
                </div>
            </div>
        );
    }

    return (
        <div className={css.card}>
            <div>
                <h2>Recomendações</h2>
            </div>
            {ongs.map((ong) => (
                <div key={ong.id} className={css.ongs}>


                    <Link to={`/ong/${ong.id}`} className={css.info} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                            src={getImagemUrl(ong.id)}
                            alt={ong.nome}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/logo.png';
                            }}
                        />
                        <p>{ong.nome}</p>
                    </Link>

                    <div className={css.botaoseguir}>
                        <BotaoSeguir
                            idOng={ong.id}
                            apiUrl={api_url}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}