import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import css from "./CadastroAdm1.module.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";

export default function CadastroAdm1({api}) {
    const api_url = api
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [error, setError] = useState('');
    const sucesso = localStorage.getItem('sucesso');
    const navigate = useNavigate();

    if (sucesso) {
        localStorage.removeItem('sucesso');
    }

    function alterarNome(e) {
        setNome(e.target.value)
    }

    function alterarCPF(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')

        setCpf(valor)
    }

    function alterarTelefone(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setTelefone(valor)
    }

    function alterarEmail(e) {
        setEmail(e.currentTarget.value)
    }

    function alterarSenha(e) {
        setSenha(e.target.value)
    }

    function alterarConfirmarSenha(e) {
        setConfirmarSenha(e.target.value)
    }



    async function criarAdm({api}) {
        const api_url = api
        const form = new FormData();
        form.append('nome', nome)
        form.append('cpf_cnpj', cpf)
        form.append('telefone', telefone)
        form.append('email', email)
        form.append('senha', senha)
        form.append('confirmar_senha', confirmarSenha)
        form.append('tipo', 0)

        let retorno = await fetch(`${api_url}/criar_usuarios`, {
            method: 'POST',
            credentials: 'include',
            body: form
        })

        retorno = await retorno.json();


        if (retorno.message) {
            navigate('/ConfirmarEmail')
            localStorage.setItem('sucesso', retorno.message)
        }

        else {
            setError(retorno.error)
        }
    }

    return (
        <section className={css.secao}>
            <div>
                <Mensagem tipo={"sucesso"} texto={sucesso} onClose={() => setError('')}/>
                <Mensagem tipo={"erro"} texto={error} onClose={() => setError('')}/>
            </div>
            <div className={css.organizar}>
                <Titulo titulo={'Cadastro de Administrador'} cor={'azul-claro'} />
            </div>

            <div className={css.formulario}>
                <div>
                    <Input
                        label={'Nome'}
                        type={'text'}
                        placeholder={'Digite seu nome'}
                        required={true}
                        maxLength={254}
                        input={nome}
                        alterarInput={alterarNome}
                    />
                    <Input
                        label={'Senha'}
                        type={'password'}
                        placeholder={'Digite sua senha'}
                        required={true}
                        maxLength={254}
                        input={senha}
                        alterarInput={alterarSenha}
                    />
                    <Input
                        label={'Telefone'}
                        type={'text'}
                        placeholder={'Digite seu telefone'}
                        required={true}
                        maxLength={11}
                        input={telefone}
                        alterarInput={alterarTelefone}
                    />
                    <Input
                        label={'CPF'}
                        type={'text'}
                        placeholder={'Digite seu CPF'}
                        required={true}
                        maxLength={11}
                        input={cpf}
                        alterarInput={alterarCPF}
                    />

                </div>

                <div>
                    <Input
                        label={'Email'}
                        type={'text'}
                        placeholder={'Digite seu email'}
                        required={true}
                        maxLength={254}
                        input={email}
                        alterarInput={alterarEmail}

                    />

                    <Input
                        label={'Confirmar senha'}
                        type={'password'}
                        placeholder={'Confirme sua senha'}
                        required={true}
                        maxLength={254}
                        input={confirmarSenha}
                        alterarInput={alterarConfirmarSenha}
                    />

                    <InputArquivo
                        tamanho={'big'}
                        required={false}
                    />

                </div>
            </div>

            <div className={css.botao}>
                <Botao acao={criarAdm} texto={'Cadastrar'} cor={'rosa'} />
            </div>
        </section>
    );
}