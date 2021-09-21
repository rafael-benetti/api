interface SignUpEmailRequest {
  receiverName: string;
  receiverEmail: string;
  password: string;
}

const signUpEmailTemplate = (
  data: SignUpEmailRequest,
): {
  subject: string;
  plainText: string;
  htmlBody: string;
} => {
  return {
    subject: `Olá ${data.receiverName}, sua senha Black Telemetry está aqui`,
    plainText: `${data.receiverName}, você foi cadastrado na plataforma Black Telemetry. Acesse agora e mude sua senha!`,
    htmlBody: `<p>${data.receiverName}, você foi cadastrado na plataforma Black Telemetry. Acesse agora e mude sua senha!</p><br/><p><strong>Email:</strong> ${data.receiverEmail}<br/><strong>Senha: </strong>${data.password}</p><br/>`,
  };
};

export default signUpEmailTemplate;
