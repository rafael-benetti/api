"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPasswordResetTemplate = (data) => {
    return {
        subject: `${data.receiverName}, para resetar a sua senha entre aqui`,
        plainText: `${data.receiverName}, você ou outra pessoa solicitou o reset de sua senha Black Telemetry. Caso tenha sido você, clique no link abaixo para receber uma nova senha neste email. Se não foi você, ignore esse email. Equipe Black Telemetry.`,
        htmlBody: `
      <h4>${data.receiverName}</h4>,
      <p>Você ou outra pessoa solicitou o reset de sua senha Black Telemetry. Caso tenha sido você, clique no link abaixo para receber uma nova senha neste email.<br/>
      <a href="${data.resetPasswordLink}">${data.resetPasswordLink}.</a>
      Se não foi você, ignore esse email.</p>

      <strong>Equipe Black Telemetry</strong>
    `,
    };
};
exports.default = requestPasswordResetTemplate;
