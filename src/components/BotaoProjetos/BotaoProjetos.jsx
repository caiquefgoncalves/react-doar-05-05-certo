import { useNavigate } from "react-router-dom";
import css from "./BotaoProjetos.module.css";

export default function BotaoProjetos({ pagina, status = 1, projetoId, usuarioTipo }) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // ADM e ONG não podem interagir
        if (usuarioTipo === 0 || usuarioTipo === 2) return;

        if (status === 0) {
            // Dinheiro - vai para doação
            navigate(`/doar/${projetoId}`);
        } else {
            // Voluntariado - vai para mensagem
            navigate(`/voluntario/${projetoId}`);
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

    // Esconder botão para ADM e ONG
    if (usuarioTipo === 0 || usuarioTipo === 2) return null;

    return (
        <button type="button" className={cor} onClick={handleClick}>
            {textoBotao}
        </button>
    );
}