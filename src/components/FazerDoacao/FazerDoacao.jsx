// src/components/FazerDoacao/FazerDoacao.jsx
import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import css from "./FazerDoacao.module.css"
import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function FazerDoacao({api}) {
    const api_url = api
    const token = localStorage.getItem("token")
    const { id } = useParams();
    const navigate = useNavigate();
    let [valor, setValor] = useState("");
    let [pix, setPix] = useState("");
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    function alterarValor(e) {
        let valorDigitado = e.target.value;

        // Remove tudo que não for número
        valorDigitado = valorDigitado.replace(/\D/g, '');

        // Converte para número e divide por 100 (centavos)
        const valorNumerico = parseFloat(valorDigitado) / 100;

        // Formata como moeda brasileira
        if (valorDigitado === '') {
            setValor('');
        } else {
            const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            setValor(valorFormatado);
        }
    }

    async function gerarQrCode() {
        // Remove a formatação (R$, pontos, vírgulas) e converte para número
        let valorNumerico = valor.replace(/\D/g, '');
        valorNumerico = parseFloat(valorNumerico) / 100;
        valorNumerico = Math.round(valorNumerico); // Garantir inteiro

        if (!valorNumerico || valorNumerico <= 0) {
            setMensagem({ texto: 'Digite um valor válido', tipo: 'erro' });
            return;
        }

        console.log('Enviando valor:', valorNumerico, typeof valorNumerico);

        let retorno = await fetch(`${api_url}/doar_projeto/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ valor: valorNumerico }),
            credentials: 'include'
        });
        retorno = await retorno.json();

        if (retorno.message) {
            setPix(retorno.pix);
            setMensagem({ texto: retorno.message || 'QR code gerado com sucesso', tipo: 'sucesso' });
        } else {
            setMensagem({ texto: retorno.error || 'Erro ao gerar QR code', tipo: 'erro' });
        }
    }

    return(
        <section className={css.geral}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.titulo}>
                <Titulo titulo={'Realizar uma doação'} cor={'rosa'} />
            </div>
            <div className={css.container}>
                <div className={css.informacoes}>
                    <div className={css.secao}>
                        <Input
                            label={'Valor a ser doado *'}
                            placeholder={'R$ 0,00'}
                            input={valor}
                            alterarInput={alterarValor}
                        />

                        {pix ? (
                            <>
                                <div className={css.botoes}>
                                    <div className={css.botaoQr}>
                                        <Botao
                                            cor={'vazadorosa2'}
                                            texto={'Gerar o QR Code novamente'}
                                            acao={gerarQrCode}
                                        />
                                    </div>
                                    <div className={css.botao}>
                                        <Botao cor={'rosa'} texto={'Concluído'} acao={() => navigate('/agradecimento')} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={css.botaoQr}>
                                <Botao
                                    cor={'rosa'}
                                    texto={'Gerar o QR Code'}
                                    acao={gerarQrCode}
                                />
                            </div>
                        )}

                    </div>
                    {pix && (
                        <div className={css.qrCode}>
                            <img
                                src={`${api_url}/uploads/Pix/${pix}`}
                                alt="QR Code PIX"
                                onError={(e) => { e.target.onerror = null; e.currentTarget.src = '/sem_imagem.webp'; }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}