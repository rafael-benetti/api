"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signUpEmailTemplate = (data) => {
    return {
        subject: `Olá ${data.receiverName}, sua senha Black Telemetry está aqui`,
        plainText: `${data.receiverName}, você foi cadastrado na plataforma Black Telemetry. Acesse agora e mude sua senha!`,
        htmlBody: `<p>${data.receiverName}, você foi cadastrado na plataforma Black Telemetry. Acesse agora e mude sua senha!</p><br/><p><strong>Email:</strong> ${data.receiverEmail}<br/><strong>Senha: </strong>${data.password}</p><br/>`,
    };
};
exports.default = signUpEmailTemplate;
