import OngsAprovar from "../OngsAprovar/OngsAprovar.jsx";
import css from "./ListaAprovacoes.module.css";
import Titulo from "../Titulo/Titulo.jsx";

export default function ListaAprovacoes() {
    return (
        <section className={css.secao}>
            <div className={css.tituloprincipal}>
                <Titulo titulo={'Lista de Pendências'} cor={'preto'}/>
            </div>
            <div className={css.categorias}>
                <Titulo titulo={'Nome da ONG'} cor={'preto-subtitulo'}/>
                <Titulo titulo={'Data de Cadastro'} cor={'preto-subtitulo'}/>
                <Titulo titulo={'Ações'} cor={'preto-subtitulo'}/>
            </div>
            <div className={css.cards}>
                <OngsAprovar nomeong={'GRUPA'} data={'02/03/2026'}   />
                <OngsAprovar nomeong={'Gerando Falcões'} data={'04/03/2026'}  />
                <OngsAprovar nomeong={'Tocando em Frente'} data={'06/03/2026'}  />
                <OngsAprovar nomeong={'Amigos do Bem'} data={'07/03/2026'}  />
            </div>

        </section>
    )
}