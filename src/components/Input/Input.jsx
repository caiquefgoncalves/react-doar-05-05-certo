// Input.jsx
import css from './Input.module.css'

export default function Input({
                                  input,
                                  textarea = false,
                                  alterarInput,
                                  tamanho = 'normal',
                                  label,
                                  type = "text",
                                  placeholder,
                                  required = false,
                                  maxLength,
                                  minLength,
                                  mascara = null,
                                  disabled = false,
                                  apenasTexto = false
                              }) {

    function handleChange(e) {
        let valor = e.target.value;

        // Bloqueia números se for campo de texto
        if (apenasTexto) {
            valor = valor.replace(/[0-9]/g, '');
        }

        // Para email, garante que fica minúsculo
        if (type === 'email' || label === 'Email' || label === 'E-mail') {
            valor = valor.toLowerCase();
        }
        // Primeira letra maiúscula - NÃO aplicar em: password, email, máscaras, apenasTexto
        else if (type !== 'password' && !mascara && !apenasTexto && valor.length > 0) {
            valor = valor.charAt(0).toUpperCase() + valor.slice(1);
        }

        if (mascara) {
            aplicarMascara(valor);
        } else {
            alterarInput({ target: { value: valor } });
        }
    }

    function aplicarMascara(valor) {
        if (mascara === 'cpf') {
            valor = valor.replace(/\D/g, '').substring(0, 11);
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (mascara === 'cnpj') {
            valor = valor.replace(/\D/g, '').substring(0, 14);
            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
        } else if (mascara === 'telefone') {
            valor = valor.replace(/\D/g, '').substring(0, 11);
            valor = valor.length <= 10 ? valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3') : valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (mascara === 'cep') {
            valor = valor.replace(/\D/g, '').substring(0, 8);
            valor = valor.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }

        alterarInput({ target: { value: valor } });
    }

    return (
        <div className={css.inputGroup}>
            <label className={css.label}>{label}</label>
            {textarea ? (
                <textarea
                    className={css.Big}
                    onChange={handleChange}
                    value={input}
                    required={required}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled}
                    style={disabled ? { color: '#999', backgroundColor: '#fafafa', cursor: 'not-allowed', opacity: 0.7 } : {}}
                />
            ) : (
                <input
                    className={css[tamanho]}
                    type={type === 'email' ? 'text' : type}
                    onChange={handleChange}
                    value={input}
                    required={required}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    minLength={minLength}
                    disabled={disabled}
                    autoComplete={type === 'password' ? 'current-password' : 'off'}
                    style={disabled ? { color: '#999', backgroundColor: '#fafafa', cursor: 'not-allowed', opacity: 0.7 } : {}}
                />
            )}
        </div>
    )
}