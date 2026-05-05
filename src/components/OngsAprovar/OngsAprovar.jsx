import Botao from "../Botao/Botao.jsx";
import css from "./OngsAprovar.module.css"

export default function OngsAprovar({nomeong, data}) {
    return(
        <div className={css.card}>
            <h2 className={css.texto}>{nomeong}</h2>
            <h2 className={css.data}>{data}</h2>
            <div className={css.botao}>
                <Botao texto={'Analisar'} cor={'amarelo-menor'} pagina={'/aprovarReprovar'}/>
            </div>

        </div>
    )
}