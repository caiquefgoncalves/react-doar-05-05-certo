import { useNavigate } from "react-router-dom";
import css from "./BotaoProjetos.module.css";

export default function BotaoProjetos({ acao, pagina, texto, status }) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();

        if (acao) {
            acao();
        }

        if (pagina) {
            navigate(pagina);
        }
    }
    var cor = "";
    var textoBotao = texto;

    if (status === 0) {
        cor = css.doacao;
        textoBotao = "Faça sua doação";
    } else if (status === 1) {
        cor = css.voluntario;
        textoBotao = "Seja um voluntário";
    }

    return (
        <button type="button" className={cor} onClick={handleClick}>
            {textoBotao}
        </button>
    );
}