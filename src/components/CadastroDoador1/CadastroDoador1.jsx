// CadastroDoador1.jsx
import css from './CadastroDoador1.module.css'
import Titulo from "../Titulo/Titulo.jsx";
import BotaoAlternar from "../BotaoAlternar/BotaoAlternar.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";

export default function CadastroDoador1({api}) {
    const api_url = api
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    function alterarNome(e) { setNome(e.target.value) }
    function alterarCPF(e) { setCpf(e.target.value) }
    function alterarTelefone(e) { setTelefone(e.target.value) }
    function alterarEmail(e) { setEmail(e.target.value.replace(/\s/g, '')) }
    function alterarSenha(e) { setSenha(e.target.value) }
    function alterarConfirmarSenha(e) { setConfirmarSenha(e.target.value) }
    function alterarFotoPerfil(e) { if (e.target.files?.[0]) setFotoPerfil(e.target.files[0]) }

    async function criarDoador() {
        const form = new FormData();
        form.append('nome', nome)
        form.append('cpf_cnpj', cpf.replace(/\D/g, ''))
        form.append('telefone', telefone.replace(/\D/g, ''))
        form.append('email', email)
        form.append('senha', senha)
        form.append('confirmar_senha', confirmarSenha)
        form.append('tipo', 1)

        if (!fotoPerfil) {
            setMensagem({ texto: 'A foto de perfil é obrigatória', tipo: 'erro' });
            return;
        }
        form.append('foto_perfil', fotoPerfil);

        try {
            let retorno = await fetch(`${api_url}/criar_usuarios`, {
                method: 'POST', credentials: 'include', body: form
            })
            retorno = await retorno.json();
            if (retorno.message) {
                setMensagem({ texto: retorno.message, tipo: 'sucesso' });
                setTimeout(() => navigate('/ConfirmarEmail'), 2000);
            } else {
                setMensagem({ texto: retorno.error, tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão com o servidor', tipo: 'erro' });
        }
    }

    return (
        <section className={css.containerSection}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.organizar}>
                <Titulo titulo={'Venha fazer parte da mudança!'} cor={'rosa'} />
                <BotaoAlternar ong={false}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Nome'} type={'text'} placeholder={'Digite seu nome'} required={true} maxLength={254} input={nome} alterarInput={alterarNome} />
                        <Input label={'Senha'} type={'password'} placeholder={'Digite sua senha'} required={true} maxLength={254} input={senha} alterarInput={alterarSenha} />
                        <Input label={'Telefone'} type={'text'} placeholder={'Digite seu telefone'} required={true} input={telefone} alterarInput={alterarTelefone} mascara={'telefone'} />
                        <Input label={'Email'} type={'text'} placeholder={'Digite seu email'} required={true} maxLength={254} input={email} alterarInput={alterarEmail} />
                    </div>
                    <div className={css.campos}>
                        <Input label={'CPF'} type={'text'} placeholder={'Digite seu CPF'} required={true} input={cpf} alterarInput={alterarCPF} mascara={'cpf'} />
                        <Input label={'Confirmar senha'} type={'password'} placeholder={'Confirme sua senha'} required={true} maxLength={254} input={confirmarSenha} alterarInput={alterarConfirmarSenha} />
                        <InputArquivo tamanho={'big'} required={true} alterarInput={alterarFotoPerfil} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={criarDoador} texto={'Cadastre-se'} cor={'rosa'}/>
                </div>
            </div>
        </section>
    )
}