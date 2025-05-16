import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import styled from "styled-components";
import { CustomModal, PhoneInput, CpfInput, PasswordInput, CustomInput, CustomButton, CustomLink } from "../components";
import backgroundImg from "/fundo.png";

export default function RegisterUser() {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", cpf: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, type: "info", message: "" });
    const navigate = useNavigate();
    const isFormIncomplete = Object.entries(formData).filter(([key]) => key !== "phone" && key !== "email").some(([, value]) => !value.trim());

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!formData.email.trim() && !formData.phone.trim()) {
            setErrors({ general: "Informe pelo menos um email ou telefone." });
            setLoading(false);
            return;
        }

        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setErrors({ email: "Email inválido." });
            setLoading(false);
            return;
        }

        const telefoneLimpo = formData.phone.replace(/\D/g, '').trim();
        if (telefoneLimpo.length > 0 && telefoneLimpo.length !== 11) {
            setErrors({ phone: "O telefone deve ter 11 dígitos (DDD + número)." });
            setLoading(false);
            return;
        }

        if (formData.cpf.replace(/\D/g, '').length !== 11 && formData.cpf.replace(/\D/g, '').length > 0) {
            setErrors({ cpf: "O cpf deve ter 11 dígitos." });
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setErrors({ password: "A senha deve ter no mínimo 8 caracteres." });
            setLoading(false);
            return;
        }

        const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regexSenha.test(formData.password)) {
            setErrors({ password: "A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial." });
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            phone: telefoneLimpo,
            cpf: formData.cpf.replace(/\D/g, '').trim(),
            email: formData.email.trim()
        };

        try {
            const response = await registerUser(payload);
            if (response.status === 201) navigate("/");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Erro inesperado ao tentar registrar. Tente novamente mais tarde.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Styled.RegisterPage>
            <Styled.Container>
                <Styled.LeftPanel/>
                <Styled.RightPanel>
                    <Styled.Title>Registre-se!</Styled.Title>
                    <form onSubmit={handleSubmit}>
                        <CustomInput
                            label="Nome"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <CustomInput
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <Styled.ErrorMsg>{errors.email}</Styled.ErrorMsg>}

                        <PhoneInput
                            label="Telefone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <Styled.ErrorMsg>{errors.phone}</Styled.ErrorMsg>}

                       <CpfInput
                            label="Cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                        />
                        {errors.cpf && <Styled.ErrorMsg>{errors.cpf}</Styled.ErrorMsg>}

                        <PasswordInput
                            label="Senha"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <Styled.ErrorMsg>{errors.password}</Styled.ErrorMsg>}

                        <CustomButton type="submit" loading={loading} disabled={isFormIncomplete}>
                            Cadastrar
                        </CustomButton>

                        <CustomLink href="/">Já tenho uma conta!</CustomLink>

                        {errors.general && (<Styled.ErrorMsg className="text-center mt-2">{errors.general}</Styled.ErrorMsg>)}
                    </form>
                <CustomModal
                    show={modal.show}
                    type={modal.type}
                    message={modal.message}
                    onHide={() => setModal({ ...modal, show: false })}
                />
                </Styled.RightPanel>
            </Styled.Container>
        </Styled.RegisterPage>
    );
}

const Styled = {
    Container: styled.div`
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        flex-direction: row;
    `,

    Title: styled.h1`
        font-size: 2rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.primary};
        margin-bottom: 1.5rem;
        text-align: center;

        @media (max-width: 768px) {
            font-size: 1.75rem;
        }
    `,

    RegisterPage: styled.div`
        min-height: 100vh;
    `,
    
    LeftPanel: styled.div`
        flex: 2.8;
        position: relative;
        height: 100%;
        overflow: hidden;
        background-image: url(${backgroundImg});
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;

        @media (max-width: 767px) {
        display: none;
        }
    `,

    RightPanel: styled.div`
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.primaryDarkTwo};
        padding: 2rem 1rem;
        height: 100%;

        @media (min-width: 768px) {
            max-width: 600px;
            padding: 3rem 2rem;
        }
    `,

    ErrorMsg: styled.span`
        display: block;
        color: #ff4d4d;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    `,
};
