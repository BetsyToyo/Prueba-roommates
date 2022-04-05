const nodemailer= require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'instructor.iaim@gmail.com',
        pass: 'Bootcamp0006'
    }
});

const send = async (asunto, contenido, correos)=>{
    const opcionesCorreo = {
        from: 'instructor.iaim@gmail.com',
        to: correos,
        subject: asunto,
        html: contenido
    }

    await transporter.sendMail(opcionesCorreo);
}

module.exports = send