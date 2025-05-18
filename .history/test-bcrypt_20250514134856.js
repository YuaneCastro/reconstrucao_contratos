require('dotenv').config();
require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;



if (encarregados.length > 0) {
  // Envia os dados dos encarregados de volta para o frontend
  res.json({
      sucesso: true,
      motivo: "Encarregados encontrados com sucesso.",
      encarregados: encarregados
  });
} else {
  // Caso não encontre encarregados
  res.json({
      sucesso: false,
      motivo: "Nenhum encarregado encontrado para esse contrato.",
      encarregados: []
  });
}



document.getElementById('contratoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const resposta = confirm("Realmente quer enviar o contrato aos encarregados?");
    
    if(resposta) {
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const titulo = document.getElementById('titulo').value;
        const conteudo = document.getElementById('conteudo').value;
        const enviarTodos = document.getElementById('enviarTodos').checked;
        const dataExpiracaoInput = document.getElementById('dataExpiracao');

        const especificacoes = [];

        document.querySelectorAll('.especificacao').forEach((div) => {
            const id = div.getAttribute('data-id');
            const classe = div.querySelector(`select[name="classe_${id}"]`).value;
            const curso = div.querySelector(`select[name="curso_${id}"]`).value;
            const turma = div.querySelector(`select[name="turma_${id}"]`).value;

            especificacoes.push({
                classe,
                curso: (["10ª Classe", "11ª Classe", "12ª Classe","13ª Classe"].includes(classe)) ? curso : null,
                turma
            });
        });
        if (!enviarTodos  && especificacoes.length === 0) {
            alert("Você deve selecionar pelo menos uma raiz ou marcar a opção de enviar para todos.");
            return; // Impede o envio
        }
        if (!dataExpiracaoInput.value) {
            alert("A data de expiração é obrigatória para todos os documentos.");
            return;
        }

        const dadosContrato = {
            tipoDocumento,
            titulo,
            conteudo,
            enviarParaTodos: enviarTodos,
            especificacoes,
            dataExpiracao: dataExpiracaoInput.value
        };

        try {
            const response = await fetch('/enviar_documento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosContrato)
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar o contrato.');
            }

            const data = await response.json();

            if (data.sucesso) {
                alert(data.motivo);
                location.reload();
            } else {
                alert("Erro ao enviar o contrato.");
            }
        } catch (err) {
            console.error('Erro ao enviar contrato:', err);
            alert("Erro ao enviar contrato.");
        }
    }
});


const crypto = require('crypto');

// Gera as chaves
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Texto a assinar
const texto = "Meu conteúdo importantíssimo";

// Assinar
const assinatura = crypto.sign("sha256", Buffer.from(texto), {
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
});

// Verificar a assinatura
const verificado = crypto.verify(
  "sha256",
  Buffer.from(texto),
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  },
  assinatura
);

console.log("Assinatura válida?", verificado);
