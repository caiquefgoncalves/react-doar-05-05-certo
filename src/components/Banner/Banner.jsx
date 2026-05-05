import css from "./Banner.module.css";
import Botao from "../Botao/Botao.jsx";
export default function Banner() {

    return (
        <section className={css.banner}>
            <div className={css.textos}>
                <h2 className={css.logo}>DOAR<span>+</span></h2>
                <h1 className={css.titulo}>Venha fazer a diferença e encontrar quem também faz!</h1>
                <p className={css.paragrafo}>Sempre quis contribuir mais nunca soube como? Acesse a Doar+ e doe agora!</p>
            </div>
            <div className={css.conheca}>
                <Botao pagina="/login" texto="Acesse a plataforma"  />
            </div>

        </section>
    )
}