import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import css from "./FazerDoacao.module.css"

export default function FazerDoacao() {
    return(
        <section>
            <div className={css.titulo}>
                <Titulo titulo={'Realizar uma doação'} cor={'rosa'} />
            </div>
            <div className={css.container}>
                <div>
                    <Input label={'Valor à ser doado'} input={'Digite o valor'} />
                </div>
                <div className={css.botaoQr}>
                    <Botao cor={'vazadorosa'} texto={'Gerar o QR Code novamente'}/>
                </div>
            </div>
        </section>

    )
}