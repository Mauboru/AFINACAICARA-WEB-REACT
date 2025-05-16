import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { CustomModal, CpfInput, PasswordInput, CustomInput, CustomButton } from "../components";
import { updateUser } from "../services/profile";

export default function Profile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, type: "info", message: "" });
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.name);
            setEmail(parsedUser.email);
            setCpf(parsedUser.cpf);
            setProfileImage(parsedUser.image ? `${import.meta.env.VITE_BASE_URL_PROFILE}/${parsedUser.image}` : null);
            setUserId(parsedUser.id);
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                // uploadImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const data = {
            id: userId,
            name,
            email,
            oldPassword,
            newPassword,
            profileImage,
        };

        try {
            await updateUser(data);

            const storedUser = localStorage.getItem("userData");
            const parsedUser = storedUser ? JSON.parse(storedUser) : {};
            parsedUser.user = { ...parsedUser.user, ...data };
            localStorage.setItem("userData", JSON.stringify(parsedUser));

            setModal({
                show: true,
                type: "success",
                message: "Seus dados foram alterados com sucesso!.",
            });
        } catch (error) {
            const mensagemErro = error?.response?.data?.message || "Erro ao conectar com o servidor.";
            setModal({
                show: true,
                type: "error",
                message: mensagemErro,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <MainLayout>Carregando...</MainLayout>;
    }

    return (
        <MainLayout>
            <h1>Meus Dados</h1>
            <Styled.Form onSubmit={handleSubmit}>
                {/* Campo de imagem */}
                <Styled.ImageField>
                    <Styled.ProfileImage
                        src={profileImage || "/user.png"}
                        alt="Imagem de Perfil"
                        onClick={handleImageClick}
                    />
                    <Styled.ImageInput
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </Styled.ImageField>

                {/* Nome */}
                <CustomInput
                    label="Nome"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* Email */}
                <CustomInput
                    label="Email "
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* CPF */}
                <CpfInput
                    label="Cpf"
                    name="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                />

                {showPasswordFields && (
                    <>
                        {/* Senha Antiga */}
                        <PasswordInput
                            label="Senha"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />

                        {/* Nova Senha */}
                        <PasswordInput
                            label="Senha"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                <CustomButton
                    type="submit"
                    loading={loading}
                    onClick={() => {
                        setShowPasswordFields(!showPasswordFields);
                        setNewPassword("");
                        setOldPassword("");
                    }}
                >
                    Mudar Senha
                </CustomButton>

                <CustomButton type="submit" loading={loading} disabled={oldPassword && !newPassword}>
                    Atualizar Perfil
                </CustomButton>
            </Styled.Form>

            {/* Modal de feedback */}
            <CustomModal
                show={modal.show}
                type={modal.type}
                message={modal.message}
                onHide={() => setModal({ ...modal, show: false })}
            />
        </MainLayout>
    );
}

const Styled = {
  Form: styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
  `,

  ImageField: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  `,

  ProfileImage: styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  `,

  ImageInput: styled.input`
    display: none;
  `,
};