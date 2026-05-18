import css from './Recomendacoes.module.css'
import BotaoSeguir from "../BotaoSeguir/BotaoSeguir.jsx";

export default function Recomendacoes({ongs}) {
    return (
        <div className={css.card}>
            <div>
                <h2>Recomendações</h2>
            </div>
            ongs.map(items => (
            <div className={css.ongs}>
                <div className={css.info}>
                    <img src={'/logo.png'} />
                    <p>Rotary</p>
                </div>
                <div className={css.botaoseguir}>
                    <BotaoSeguir />
                </div>
            </div>
            <div className={css.ongs}>
                <div className={css.info}>
                    <img src={'/logo.png'} />
                    <p>Tocando em frente</p>
                </div>
                <div className={css.botaoseguir}>
                    <BotaoSeguir />
                </div>
            </div>
        </div>
    )
}