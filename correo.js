const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pruebamodulo6nodejs@gmail.com",
    pass: "samantha120521",
  },
});

const send = async (correos, asunto, contenido) => {
  const opcionesCorreo = {
    from: "pruebamodulo6nodejs@gmail.com",
    to: correos,
    subject: asunto,
    html: contenido,
  };

  await transporter.sendMail(opcionesCorreo);
};

module.exports = send;
