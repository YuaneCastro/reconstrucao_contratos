require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:yGlhxZxXGrCQkDOclglmppNCNfSMklGx@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(client => {
    console.log('Conectado ao banco de dados!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = pool;




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