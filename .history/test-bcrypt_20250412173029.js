const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: encarregado_email,
    subject: 'Defina sua senha para acessar o sistema',
    html: `<p>Olá ${encarregado_nome},</p>
        <p>Você foi cadastrado como encarregado de um estudante. Defina sua senha para acessar o sistema.</p>
        <p><a href="${resetLink}">Clique aqui para definir sua senha</a></p>`
});