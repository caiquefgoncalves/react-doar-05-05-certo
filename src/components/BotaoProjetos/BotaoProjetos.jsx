import { useNavigate } from "react-router-dom";
import css from "./BotaoProjetos.module.css";

export default function BotaoProjetos({pagina, status = 1 }) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();

        if (pagina) {
            navigate(pagina);
        }
    }
    var cor = "";
    var textoBotao = "";

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