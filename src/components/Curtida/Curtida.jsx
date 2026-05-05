import { useNavigate } from "react-router-dom";
import css from "./Curtida.module.css";

export default function Curtida({ acao, pagina, texto }) {
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

    return (
        <button type="button" className={css.curtida} onClick={handleClick}>
            <img className={css.coracao} src={'curtida.png'} alt="Curtida" />
        </button>
    );
}