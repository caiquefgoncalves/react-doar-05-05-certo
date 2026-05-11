import { useNavigate } from "react-router-dom";
import css from "./Curtida.module.css";
import {useState} from "react";

export default function Curtida({curtidaInicial = false, totalInicial = 0 }) {
    const [curtido, setCurtido] = useState(curtidaInicial);
    const [totalCurtidas, setTotalCurtidas] = useState(totalInicial);

    function clicarCurtida(e) {
        e.preventDefault()
        if (curtidaInicial == true) {
            setCurtido(false);
            setTotalCurtidas(totalInicial + 1)
        }
        else {
            setCurtido(true);
            setTotalCurtidas(totalInicial - 1)
        }
    }

    return (
        <button className={css.curtida} onClick={clicarCurtida}>
            {curtido ? "❤️" : "🤍"}
        </button>
    );
}