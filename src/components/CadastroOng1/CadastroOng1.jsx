// CadastroOng1.jsx
import Titulo from "../Titulo/Titulo.jsx";
import css from "./CadastroOng1.module.css"
import Input from "../Input/Input.jsx";
import BotaoAlternar from "../BotaoAlternar/BotaoAlternar.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";

export default function CadastroOng1({api}) {
    const api_url = api
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [descBreve, setDescBreve] = useState('')
    const [descLonga, setDescLonga] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [codBanco, setCodBanco] = useState('')
    const [numAgencia, setNumAgencia] = useState('')
    const [numConta, setNumConta] = useState('')
    const [tipoConta, setTipoConta] = useState('')
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    function alterarNome(e) { setNome(e.target.value) }
    function alterarEmail(e) { setEmail(e.target.value.replace(/\s/g, '')) }
    function alterarDescBreve(e) { setDescBreve(e.target.value) }
    function alterarDescLonga(e) { setDescLonga(e.target.value) }
    function alterarLocalizacao(e) { setLocalizacao(e.target.value) }
    function alterarCategoria(e) { setCategoria(e.target.value) }
    function alterarTipoConta(e) { setTipoConta(e.target.value) }
    function alterarCNPJ(e) { setCnpj(e.target.value) }
    function alterarCodBanco(e) { setCodBanco(e.target.value.replace(/\D/g, '')) }
    function alterarNumAgencia(e) { setNumAgencia(e.target.value.replace(/\D/g, '')) }
    function alterarNumConta(e) { setNumConta(e.target.value.replace(/\D/g, '')) }
    function alterarSenha(e) { setSenha(e.target.value) }
    function alterarConfirmarSenha(e) { setConfirmarSenha(e.target.value) }
    function alterarFotoPerfil(e) { if (e.target.files?.[0]) setFotoPerfil(e.target.files[0]) }

    async function criarOng() {
        let form = new FormData();
        form.append('nome', nome)
        form.append('cpf_cnpj', cnpj.replace(/\D/g, ''))
        form.append('email', email)
        form.append('senha', senha)
        form.append('confirmar_senha', confirmarSenha)
        form.append('tipo', 2)
        form.append('descricao_breve', descBreve)
        form.append('descricao_longa', descLonga)
        form.append('localizacao', localizacao)
        form.append('categoria', categoria)
        form.append('cod_banco', codBanco.replace(/\D/g, ''))
        form.append('num_agencia', numAgencia.replace(/\D/g, ''))
        form.append('num_conta', numConta.replace(/\D/g, ''))
        form.append('tipo_conta', tipoConta)
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

    return(
        <section className={css.containerSection}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.cadastroOng1}>
                <Titulo titulo={'Venha fazer parte da mudança!'} cor={'laranja'}/>
                <BotaoAlternar ong={true}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Nome'} type={'text'} placeholder={'Digite seu nome'} required={true} maxLength={254} input={nome} alterarInput={alterarNome} />
                        <Input label={'Email'} type={'text'} placeholder={'Digite seu email'} required={true} maxLength={254} input={email} alterarInput={alterarEmail} />
                        <Input label={'Descrição breve'} type={'text'} placeholder={'Descrição breve sobre sua ONG'} required={true} maxLength={30} input={descBreve} alterarInput={alterarDescBreve} />
                        <Input label={'Localização'} type={'text'} placeholder={'Digite sua localização'} required={true} maxLength={254} input={localizacao} alterarInput={alterarLocalizacao} />
                        <Input label={'Senha'} type={'password'} placeholder={'Crie uma senha'} required={true} maxLength={254} input={senha} alterarInput={alterarSenha} />
                        <Input label={'Código do banco'} type={'text'} placeholder={'Digite o código do banco'} required={true} maxLength={3} input={codBanco} alterarInput={alterarCodBanco} />
                        <Input label={'Número da conta'} type={'text'} placeholder={'Digite o número da conta'} required={true} input={numConta} alterarInput={alterarNumConta} maxLength={12} />
                        <Select label={'Tipo de conta'} options={['Escolha um tipo de conta', 'Conta-corrente', 'Poupança', 'Conta salário', 'Conta digital', 'Conta PJ']} input={tipoConta} alterarInput={alterarTipoConta} />
                    </div>
                    <div className={css.campos}>
                        <Input label={'CNPJ'} type={'text'} placeholder={'Digite o CNPJ'} required={true} input={cnpj} alterarInput={alterarCNPJ} mascara={'cnpj'} />
                        <Select label={'Categoria'} input={categoria} alterarInput={alterarCategoria} options={['Escolha uma categoria', 'Animal', 'Escolar', 'Comida', 'Outro']}/>
                        <Input tamanho={'Big'} label={'Descrição longa'} type={'text'} placeholder={'Descrição longa sobre sua ONG'} required={true} maxLength={254} textarea={true} alterarInput={alterarDescLonga} />
                        <Input label={'Confirmar senha'} type={'password'} placeholder={'Confirme sua senha'} required={true} maxLength={254} input={confirmarSenha} alterarInput={alterarConfirmarSenha} />
                        <Input label={'Número da agência'} type={'text'} placeholder={'Digite o número da sua agência'} required={true} maxLength={4} input={numAgencia} alterarInput={alterarNumAgencia} />
                        <InputArquivo tamanho={'big'} required={true} alterarInput={alterarFotoPerfil} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={criarOng} texto={'Cadastre-se'} cor={'rosa'}/>
                </div>
            </div>
        </section>
    )
}