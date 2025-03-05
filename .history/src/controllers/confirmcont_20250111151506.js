// controllers/confirmcont.js
const User = require('../models/user');

exports.confirmCode = async (req, res) => {
    const { email, confirmationCode } = req.body;

    try {
        // Verificar se o código de confirmação é válido
        const user = await User.findOne({ email });
        if (!user || user.confirmationCode !== confirmationCode) {
            return res.status(400).send('Código de confirmação inválido.');
        }

        // Atualizar o usuário para marcar o email como confirmado
        user.isConfirmed = true;
        user.confirmationCode = undefined;  // Limpar o código de confirmação
        await user.save();

        res.send('Cadastro confirmado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao confirmar o código.');
    }
};
