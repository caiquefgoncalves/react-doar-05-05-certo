// src/components/EditarProjeto1/EditarProjeto1.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";
import css from "../CriarProjeto1/CriarProjeto1.module.css";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function EditarProjeto1({api}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const api_url = api;
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [tipoAjuda, setTipoAjuda] = useState('');
    const [status, setStatus] = useState('Ativo');
    const [foto, setFoto] = useState(null);
    const [fotoAtual, setFotoAtual] = useState('');
    const [loading, setLoading] = useState(true);
    const [msgTexto, setMsgTexto] = useState('');
    const [msgTipo, setMsgTipo] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const tokenData = decodificarToken(token);
        if (!tokenData || tokenData.tipo !== 2) { navigate('/login'); return; }
        buscarProjeto();
    }, [id]);

    async function buscarProjeto() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/buscar_projeto/${id}?token=${token}`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                if (data.projeto) {
                    setTitulo(data.projeto.titulo || '');
                    setDescricao(data.projeto.descricao || '');
                    setCategoria(data.projeto.categoria || '');
                    setLocalizacao(data.projeto.localizacao || '');
                    setTipoAjuda(data.projeto.tipo_ajuda || '');
                    setStatus(data.projeto.status || 'Ativo');
                    setFotoAtual(`${api_url}/uploads/Projetos/${id}.jpeg`);
                }
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    async function salvarEdicao() {
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('titulo', titulo);
        form.append('descricao', descricao);
        form.append('categoria', categoria);
        form.append('localizacao', localizacao);
        form.append('tipo_ajuda', tipoAjuda);
        form.append('status', status);
        if (foto) form.append('foto', foto);

        try {
            const response = await fetch(`${api_url}/editar_projeto/${id}?token=${token}`, { method: 'PUT', credentials: 'include', body: form });
            const data = await response.json();
            setMsgTexto(data.message || data.error);
            setMsgTipo(response.ok ? 'sucesso' : 'erro');
            if (response.ok) setTimeout(() => navigate('/dashboardOng'), 2000);
        } catch (error) { setMsgTexto('Erro de conexão'); setMsgTipo('erro'); }
    }

    if (loading) return <section className={css.containerSection}><p className={css.loading}>Carregando...</p></section>;

    return (
        <section className={css.containerSection}>
            {msgTexto && (
                <Mensagem tipo={msgTipo} texto={msgTexto} onClose={() => setMsgTexto('')} />
            )}
            <div className={css.titulo}><Titulo titulo={'Editar projeto'} cor={'laranja'}/></div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Título *'} type={'text'} input={titulo} alterarInput={(e) => setTitulo(e.target.value)} required={true} apenasTexto={true} />
                        <Select label={'Categoria *'} input={categoria} alterarInput={(e) => setCategoria(e.target.value)} options={['Animal', 'Escolar', 'Comida', 'Saúde', 'Outro']} />
                        <Select label={'Tipo de ajuda *'} input={tipoAjuda} alterarInput={(e) => setTipoAjuda(e.target.value)} options={['Dinheiro', 'Voluntariado', 'Outros']} />
                        <Select label={'Status *'} input={status} alterarInput={(e) => setStatus(e.target.value)} options={['Ativo', 'Inativo', 'Concluído']} />
                    </div>
                    <div className={css.campos}>
                        <Input label={'Descrição *'} type={'text'} input={descricao} alterarInput={(e) => setDescricao(e.target.value)} textarea={true} tamanho={'Big'} apenasTexto={true} />
                        <Input label={'Localização'} type={'text'} input={localizacao} alterarInput={(e) => setLocalizacao(e.target.value)} />
                        <InputArquivo tamanho={'big'} label={'Nova foto (opcional)'} required={false} alterarInput={(e) => setFoto(e.target.files[0])} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={salvarEdicao} texto={'Editar projeto'} cor={'azul'}/>
                </div>
            </div>
        </section>
    );
}