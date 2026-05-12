// src/components/EditarOng1/EditarOng1.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "./EditarOng1.module.css";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function EditarOng1({api}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const api_url = api;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [descBreve, setDescBreve] = useState('');
    const [descLonga, setDescLonga] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [codBanco, setCodBanco] = useState('');
    const [numAgencia, setNumAgencia] = useState('');
    const [numConta, setNumConta] = useState('');
    const [tipoConta, setTipoConta] = useState('');
    const [chavePix, setChavePix] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [fotoAtual, setFotoAtual] = useState('');
    const [loading, setLoading] = useState(true);
    const [msgTexto, setMsgTexto] = useState('');
    const [msgTipo, setMsgTipo] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const tokenData = decodificarToken(token);
        if (!tokenData) { localStorage.clear(); navigate('/login'); return; }
        if (tokenData.tipo !== 0 && !(tokenData.tipo === 2 && tokenData.id_usuarios === parseInt(id))) {
            navigate('/dashboardOng'); return;
        }
        buscarDadosOng();
    }, [id]);

    async function buscarDadosOng() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/buscar_ong_logada/${id}?token=${token}`, { method: 'GET', credentials: 'include' });
            if (response.status === 401) { localStorage.clear(); navigate('/login'); return; }
            if (response.ok) {
                const data = await response.json();
                const ong = data.ong;
                setNome(ong.nome || '');
                setEmail(ong.email || '');
                setDescBreve(ong.descricao_breve || '');
                setDescLonga(ong.descricao_longa || '');
                setLocalizacao(ong.localizacao || '');
                setCategoria(ong.categoria || '');
                setCodBanco(ong.cod_banco || '');
                setNumAgencia(ong.num_agencia || '');
                setNumConta(ong.num_conta || '');
                setTipoConta(ong.tipo_conta || '');
                setChavePix(ong.chave_pix || '');
                setCnpj(ong.cpf_cnpj || '');
                setFotoAtual(`${api_url}/uploads/Usuarios/${id}.jpeg`);
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    async function salvarEdicao() {
        // Validações em ordem (senha é opcional)
        if (!nome?.trim()) { setMsgTexto('O nome é obrigatório'); setMsgTipo('erro'); return; }
        if (!email?.trim()) { setMsgTexto('O email é obrigatório'); setMsgTipo('erro'); return; }
        if (!descBreve?.trim()) { setMsgTexto('A descrição breve é obrigatória'); setMsgTipo('erro'); return; }
        if (!localizacao?.trim()) { setMsgTexto('A localização é obrigatória'); setMsgTipo('erro'); return; }
        if (!codBanco?.trim()) { setMsgTexto('O código do banco é obrigatório'); setMsgTipo('erro'); return; }
        if (!numConta?.trim()) { setMsgTexto('O número da conta é obrigatório'); setMsgTipo('erro'); return; }
        if (!tipoConta) { setMsgTexto('Escolha um tipo de conta'); setMsgTipo('erro'); return; }
        if (!cnpj?.trim()) { setMsgTexto('O CNPJ é obrigatório'); setMsgTipo('erro'); return; }
        if (!categoria) { setMsgTexto('Escolha uma categoria'); setMsgTipo('erro'); return; }
        if (!descLonga?.trim()) { setMsgTexto('A descrição longa é obrigatória'); setMsgTipo('erro'); return; }
        if (!chavePix?.trim()) { setMsgTexto('A chave PIX é obrigatória'); setMsgTipo('erro'); return; }
        if (!numAgencia?.trim()) { setMsgTexto('O número da agência é obrigatório'); setMsgTipo('erro'); return; }

        const token = localStorage.getItem('token');
        const tokenData = decodificarToken(token);

        const form = new FormData();
        form.append('token', token);
        form.append('nome', nome?.trim() || '');
        form.append('email', email?.trim() || '');
        form.append('cpf_cnpj', String(cnpj || '').replace(/\D/g, ''));
        form.append('descricao_breve', descBreve || '');
        form.append('descricao_longa', descLonga || '');
        form.append('localizacao', localizacao || '');
        form.append('categoria', categoria || '');
        form.append('cod_banco', String(codBanco || '').replace(/\D/g, ''));
        form.append('num_agencia', String(numAgencia || '').replace(/\D/g, ''));
        form.append('num_conta', String(numConta || '').replace(/\D/g, ''));
        form.append('tipo_conta', tipoConta || '');
        form.append('chave_pix', chavePix || '');
        if (senha) form.append('senha', senha);
        if (confirmarSenha) form.append('confirmar_senha', confirmarSenha);
        if (fotoPerfil) form.append('foto_perfil', fotoPerfil);

        try {
            const response = await fetch(`${api_url}/editar_usuarios/${id}`, { method: 'PUT', credentials: 'include', body: form });
            const data = await response.json();
            setMsgTexto(data.message || data.error);
            setMsgTipo(response.ok ? 'sucesso' : 'erro');
            if (response.ok) {
                if (data.usuario && data.usuario.nome) localStorage.setItem('nome', data.usuario.nome);
                setTimeout(() => {
                    if (tokenData && tokenData.tipo === 0) navigate('/dashboardAdm');
                    else if (tokenData && tokenData.tipo === 2) navigate('/dashboardOng');
                    else navigate('/login');
                }, 2000);
            }
        } catch (error) { setMsgTexto('Erro de conexão'); setMsgTipo('erro'); }
    }

    if (loading) return <section className={css.containerSection}><p>Carregando...</p></section>;

    return (
        <section className={css.containerSection}>
            {msgTexto && <Mensagem tipo={msgTipo} texto={msgTexto} onClose={() => setMsgTexto('')} />}
            <div className={css.cadastroOng1}><Titulo titulo={'Editar ONG'} cor={'laranja'}/></div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Nome *'} type={'text'} input={nome} alterarInput={(e) => setNome(e.target.value)} required={true} />
                        <Input label={'Email *'} type={'text'} input={email} alterarInput={(e) => setEmail(e.target.value)} required={true} />
                        <Input label={'Descrição breve *'} type={'text'} input={descBreve} alterarInput={(e) => setDescBreve(e.target.value)} maxLength={30} required={true} />
                        <Input label={'Localização *'} type={'text'} input={localizacao} alterarInput={(e) => setLocalizacao(e.target.value)} required={true} />
                        <Input label={'Nova senha (opcional)'} type={'password'} input={senha} alterarInput={(e) => setSenha(e.target.value)} />
                        <Input label={'Código do banco *'} type={'text'} input={codBanco} alterarInput={(e) => setCodBanco(e.target.value.replace(/\D/g, ''))} maxLength={3} required={true} />
                        <Input label={'Número da conta *'} type={'text'} input={numConta} alterarInput={(e) => setNumConta(e.target.value.replace(/\D/g, ''))} maxLength={12} required={true} />
                        <Select label={'Tipo de conta *'} input={tipoConta} alterarInput={(e) => setTipoConta(e.target.value)} options={['Conta-corrente', 'Poupança', 'Conta salário', 'Conta digital', 'Conta PJ']} />
                    </div>
                    <div className={css.campos}>
                        <Input label={'CNPJ *'} type={'text'} input={cnpj} alterarInput={(e) => setCnpj(e.target.value)} mascara={'cnpj'} required={true} />
                        <Select label={'Categoria *'} input={categoria} alterarInput={(e) => setCategoria(e.target.value)} options={['Animal', 'Escolar', 'Comida', 'Outro']} />
                        <Input tamanho={'Big'} label={'Descrição longa *'} type={'text'} input={descLonga} alterarInput={(e) => setDescLonga(e.target.value)} textarea={true} maxLength={200} required={true} />
                        <Input label={'Confirmar senha'} type={'password'} input={confirmarSenha} alterarInput={(e) => setConfirmarSenha(e.target.value)} />
                        <Input label={'Chave PIX *'} type={'text'} input={chavePix} alterarInput={(e) => setChavePix(e.target.value)} required={true} />
                        <Input label={'Número da agência *'} type={'text'} input={numAgencia} alterarInput={(e) => setNumAgencia(e.target.value.replace(/\D/g, ''))} maxLength={5} required={true} />
                        <InputArquivo tamanho={'normal'} required={false} alterarInput={(e) => setFotoPerfil(e.target.files[0])} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={salvarEdicao} texto={'Salvar Alterações'} cor={'amarelo'}/>
                </div>
            </div>
        </section>
    );
}