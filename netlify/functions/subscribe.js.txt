// Importa o 'fetch' para o ambiente Node.js da função
const fetch = require('node-fetch');

// A função principal que será executada pelo Netlify
exports.handler = async function(event, context) {
    // 1. Verifica se o método da requisição é POST. Se não for, recusa.
    if (event.httpMethod !== 'POST' ) {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ message: 'Método não permitido' }),
        };
    }

    try {
        // 2. Pega os dados (nome e email) que o formulário enviou
        const { name, email } = JSON.parse(event.body);

        // Pega a chave da API e o ID da lista das variáveis de ambiente (que configuraremos no Netlify)
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

        // Validação simples para garantir que os dados essenciais existem
        if (!name || !email) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Nome e e-mail são obrigatórios.' }) };
        }
        if (!BREVO_API_KEY || !BREVO_LIST_ID) {
            return { statusCode: 500, body: JSON.stringify({ message: 'Configuração do servidor incompleta.' }) };
        }

        // 3. Monta e faz a chamada para a API do Brevo (igual ao que fazíamos antes, mas agora no lado seguro)
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                attributes: {
                    FIRSTNAME: name,
                },
                listIds: [parseInt(BREVO_LIST_ID )], // Converte o ID da lista para número
                updateEnabled: true,
            }),
        });

        // 4. Analisa a resposta do Brevo e retorna uma resposta para o front-end
        if (response.ok || response.status === 201 || response.status === 204) {
            // Sucesso!
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Contato adicionado com sucesso!' }),
            };
        } else {
            const data = await response.json();
            // Se o email já existe, o Brevo retorna um erro 'duplicate_parameter'. Tratamos isso como sucesso.
            if (data.code === 'duplicate_parameter') {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Contato já existia, mas consideramos sucesso!' }),
                };
            }
            // Para outros erros do Brevo, retornamos a mensagem de erro deles.
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: `Erro do Brevo: ${data.message}` }),
            };
        }
    } catch (error) {
        // Se ocorrer qualquer outro erro, retorna uma mensagem genérica.
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Erro interno do servidor: ${error.message}` }),
        };
    }
};
