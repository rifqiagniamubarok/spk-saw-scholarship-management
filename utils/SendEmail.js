import nodemailer from 'nodemailer';

// Fungsi untuk mengirim email menggunakan Promise
const SendEmail = ({ to, subject, html }) => {
  // Konfigurasi transporter Nodemailer dengan pengaturan SMTP Mailtrap
  let payload = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(payload);

  const mailOptions = {
    from: '"rifqiagniamubarok@gmail.com', // Alamat pengirim
    to, // Alamat penerima
    subject, // Subjek email
    html, // Isi email
  };

  transporter
    .sendMail(mailOptions)
    .then((info) =>
      console.log({
        info,
        env: {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
        },
      })
    )
    .catch((err) => console.log({ err }));
};

export default SendEmail;
