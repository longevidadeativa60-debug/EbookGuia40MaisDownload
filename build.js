const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Variável de ambiente do Cloudflare Pages
// Agora, esta variável deve conter o URL do Worker (ex: https://brevo-worker.seu-dominio.workers.dev)
const brevoWorkerUrl = process.env.BREVO_WORKER_URL || 'https://worker-url-nao-configurada.workers.dev';

// O Cloudflare Pages espera que os arquivos de build estejam na raiz ou em uma pasta específica.
// Vamos usar a pasta 'dist' como saída.
const outdir = 'dist';

// Certificar-se de que a pasta de saída existe
if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
}

// Ler o conteúdo do index.html
const htmlContent = fs.readFileSync('index.html', 'utf-8');

// Substituir o placeholder no HTML
// O placeholder agora é '###BREVO_WORKER_URL_PLACEHOLDER###'
const finalHtmlContent = htmlContent.replace(
    '###BREVO_WORKER_URL_PLACEHOLDER###',
    brevoWorkerUrl
);

// Escrever o arquivo final na pasta de distribuição
fs.writeFileSync(path.join(outdir, 'index.html'), finalHtmlContent);

console.log(`Build concluído. Arquivo final em ${outdir}/index.html`);
console.log(`URL do Worker Brevo usado: ${brevoWorkerUrl}`);
