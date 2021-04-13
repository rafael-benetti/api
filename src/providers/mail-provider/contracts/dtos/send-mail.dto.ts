interface SendMailDto {
  receiverName: string;
  receiverEmail: string;
  subject: string;
  html: string;
  text: string;
}

export default SendMailDto;
