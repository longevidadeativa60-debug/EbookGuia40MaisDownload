const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Variável de ambiente do Cloudflare Pages
const brevoApiKey = process.env.BREVO_API_KEY || 'SUA_CHAVE_DE_API_BREVO_AQUI_FALLBACK';

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
// O placeholder agora é '###BREVO_API_KEY_PLACEHOLDER###'
const finalHtmlContent = htmlContent.replace(
    '###BREVO_API_KEY_PLACEHOLDER###',
    brevoApiKey
);

// Escrever o arquivo final na pasta de distribuição
fs.writeFileSync(path.join(outdir, 'index.html'), finalHtmlContent);

console.log(`Build concluído. Arquivo final em ${outdir}/index.html`);
console.log(`Chave de API Brevo usada: ${brevoApiKey.substring(0, 5)}... (Verifique no Cloudflare Pages)`);
