import api from "./api";

export const login = (emailCpf, password) => {
    return api.post("/auth/login", {
        cpf_or_email: emailCpf,
        password: password,
    });
};
export const validateToken = (token) => {
    return api.post("/auth/validateToken", {
        token: token,  
    });
};

export const registerUser = (data) => {
    return api.post("/auth/registerUser", {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        password: data.password
    });
};

export const sendEmailReset = (email) => {
    return api.post("/auth/sendEmailReset", {
        email: email,
    });
};

export const sendNewPassword = (password, token) => {
    return api.post("/auth/sendNewPassword", {
        new_password: password,
        token: token,
    });
};