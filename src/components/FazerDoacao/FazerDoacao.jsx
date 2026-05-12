import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import css from "./FazerDoacao.module.css"
import {useState} from "react";
import {useParams} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function FazerDoacao({api}) {
    const api_url = api
    const token = localStorage.getItem("token")
    const { id } = useParams();
    let [valor, setValor] = useState("");
    let [pix, setPix] = useState("");
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    function altrerarValor(e) { setValor(e.target.value) }

    async function gerarQrCode() {
        let retorno = await fetch(`${api_url}/doar_projeto/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ valor }),
            credentials: 'include'
        });
        retorno = await retorno.json();

        if (retorno.message) {
            setPix(retorno.pix);
            setMensagem({ texto: retorno.message || 'QR code gerado com sucesso', tipo: 'sucesso' });

        } else {
            setMensagem({ texto: retorno.error || 'Valor inválido', tipo: 'erro' });
        }
    }

    return(
        <section>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.titulo}>
                <Titulo titulo={'Realizar uma doação'} cor={'rosa'} />
            </div>
            <div className={css.container}>
                <div className={"container d-flex justify-content-evenly align-items-center"}>
                    <div className={css.secao}>
                        <Input label={'Valor à ser doado'} placeholder={'Digite o valor'}
                               input={valor} alterarInput={altrerarValor}

                        />

                        {pix ? (
                            <>
                                <div className={css.botaoQr}>
                                    <Botao cor={'rosa'} texto={'Gerar o QR Code novamente'} acao={gerarQrCode}/>
                                </div>

                                <div className={css.botaoQr}>
                                    <Botao cor={'vazadorosa'} texto={'Voltar'} acao={gerarQrCode}/>
                                </div>
                            </>
                        ) : (
                            <div className={css.botaoQr}>
                                <Botao cor={'rosa'} texto={'Gerar o QR Code'} acao={gerarQrCode}/>
                            </div>
                        )}

                    </div>
                    {pix && (
                        <div className={css.qrCode}>

                            <img src={pix ? `${api_url}/uploads/Pix/${pix}` : '/sem_imagem.webp'} alt={`Pix`} onError={(e) => { e.target.onerror = null; e.currentTarget.src = '/sem_imagem.webp'; }} />

                        </div>
                    )}
                </div>
            </div>
        </section>

    )
}