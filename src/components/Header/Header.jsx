// src/components/Header/Header.jsx
import React, {useEffect, useState} from 'react';
import css from './Header.module.css';
import {Link, useLocation, useNavigate} from "react-router-dom";

export default function Header() {
    const [token, setToken] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    function decodificarToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }

    useEffect(function () {
        var tokenLocal = localStorage.getItem("token")
        if(tokenLocal){
            setToken(tokenLocal);
            const tokenData = decodificarToken(tokenLocal);
            if (tokenData) {
                setTipoUsuario(tokenData.tipo);
            }
        } else {
            setToken(false);
            setTipoUsuario(null);
        }
    }, [location]);

    function irParaPerfil(){
        if (tipoUsuario === 0) {
            navigate('/dashboardAdm');
        } else if (tipoUsuario === 2) {
            navigate('/dashboardOng');
        } else if (tipoUsuario === 1) {
            navigate('/dashboardDoador');
        } else {
            navigate('/dashboard');
        }
    }

    async function fazerLogout() {
        try {
            const token = localStorage.getItem('token');

            await fetch(`http://10.92.3.122:5000/logout?token=${token}`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Erro no logout:', error);
        }

        // Limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('sucesso');

        // Redireciona para home
        navigate('/');
    }

    if (token) {
        return (
            <header className={css.headerContainer}>
                <div className={css.headerContent}>
                    <a href="/" className={css.logoLink}>
                        <img src="/logo.png" alt="Logo Doar+" className={css.logo} />
                    </a>

                    <nav className={`d-none d-lg-flex ${css.desktopNav}`}>
                        <ul className={css.navList}>
                            <li><Link to="/" className={css.link}>Home</Link></li>
                            <li><Link to="/" className={css.link}>Benefícios</Link></li>
                            <li><Link to="/" className={css.link}>Junte-se a nós!</Link></li>
                            <li><Link to="/feed" className={css.link}>ONGs e projetos</Link></li>
                        </ul>
                    </nav>

                    <div className={`d-none d-lg-flex ${css.divbotoes}`}>
                        <img
                            src="/perfil.png"
                            onClick={irParaPerfil}
                            style={{cursor: 'pointer', marginRight: '15px'}}
                            alt="Perfil"
                        />
                    </div>

                    <div className={`d-none d-lg-flex ${css.divbotoes}`}>
                        <button onClick={fazerLogout} className={css.sair}>
                            Sair
                        </button>
                    </div>


                    <button
                        className={`d-lg-none ${css.actionBtn}`}
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#menuLateral"
                    >
                        <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="2" y1="2" x2="33" y2="2" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="2" y1="12" x2="33" y2="12" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="2" y1="22" x2="33" y2="22" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className={`offcanvas offcanvas-end ${css.offcanvasCustom}`} tabIndex="-1" id="menuLateral">
                        <div className={css.offcanvasHeaderCustom}>
                            <button type="button" className={css.actionBtn} data-bs-dismiss="offcanvas" aria-label="Close">
                                <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="5" y1="2" x2="30" y2="23" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                                    <line x1="30" y1="2" x2="5" y2="23" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className={css.offcanvasBodyCustom}>
                            <ul className={css.navListMobile}>
                                <li><a href="/" className={css.linkMobile}>Home</a></li>
                                <li><a href="/" className={css.linkMobile}>Benefícios</a></li>
                                <li><a href="/" className={css.linkMobile}>Junte-se a nós!</a></li>
                                <li><Link to="/feed" className={css.linkMobile}>ONGs e projetos</Link></li>
                                <li>
                                    <img
                                        src="/perfil.png"
                                        onClick={irParaPerfil}
                                        style={{cursor: 'pointer', marginRight: '15px'}}
                                        alt="Perfil"
                                    />
                                    <button
                                        onClick={fazerLogout}
                                        className={css.btnSairMobile}
                                    >
                                        Sair
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        )
    } else {
        return (
            <header className={css.headerContainer}>
                <div className={css.headerContent}>
                    <a href="/" className={css.logoLink}>
                        <img src="/logo.png" alt="Logo Doar+" className={css.logo} />
                    </a>

                    <nav className={`d-none d-lg-flex ${css.desktopNav}`}>
                        <ul className={css.navList}>
                            <li><a href="/" className={css.link}>Home</a></li>
                            <li><a href="/" className={css.link}>Benefícios</a></li>
                            <li><a href="/" className={css.link}>Junte-se a nós!</a></li>
                            <li><Link to="/feed" className={css.link}>ONGs e projetos</Link></li>
                        </ul>
                    </nav>

                    <div className={`d-none d-lg-flex ${css.divbotoes}`}>
                        <Link to={"/cadastroOng"}><button className={css.cadastro}>Cadastro</button></Link>
                        <Link to={"/login"}><button className={css.login}>Login</button></Link>
                    </div>

                    <button
                        className={`d-lg-none ${css.actionBtn}`}
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#menuLateral"
                    >
                        <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="2" y1="2" x2="33" y2="2" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="2" y1="12" x2="33" y2="12" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="2" y1="22" x2="33" y2="22" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className={`offcanvas offcanvas-end ${css.offcanvasCustom}`} tabIndex="-1" id="menuLateral">
                        <div className={css.offcanvasHeaderCustom}>
                            <button type="button" className={css.actionBtn} data-bs-dismiss="offcanvas" aria-label="Close">
                                <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="5" y1="2" x2="30" y2="23" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                                    <line x1="30" y1="2" x2="5" y2="23" stroke="#d9d9d9" strokeWidth="4" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className={css.offcanvasBodyCustom}>
                            <ul className={css.navListMobile}>
                                <li><a href="/" className={css.linkMobile}>Home</a></li>
                                <li><a href="/" className={css.linkMobile}>Benefícios</a></li>
                                <li><a href="/" className={css.linkMobile}>Junte-se a nós!</a></li>
                                <li><Link to="/feed" className={css.linkMobile}>ONGs e projetos</Link></li>
                                <li className="mt-4"><Link to={"/cadastroOng"} className={css.linkMobile}>Cadastro</Link></li>
                                <li><Link to={"/login"} className={css.linkMobile}>Login</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}