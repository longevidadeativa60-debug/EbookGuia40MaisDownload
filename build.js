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

// Ler o conteúdo do index.html (que o usuário enviou como pasted_content.txt)
// Vamos assumir que o arquivo principal é 'index.html'
const htmlContent = fs.readFileSync('index.html', 'utf-8');

// O esbuild não é ideal para substituir strings em HTML, mas podemos usá-lo para
// processar um arquivo JS que contém a variável, ou fazer a substituição diretamente.
// A substituição direta com fs.writeFileSync é mais simples para este caso.

// Substituir o placeholder no HTML
const finalHtmlContent = htmlContent.replace(
    'const BREVO_API_KEY = \'SUA_CHAVE_DE_API_BREVO_AQUI_PLACEHOLDER\';',
    `const BREVO_API_KEY = '${brevoApiKey}';`
);

// Escrever o arquivo final na pasta de distribuição
fs.writeFileSync(path.join(outdir, 'index.html'), finalHtmlContent);

// Copiar outros arquivos estáticos (se houver)
// Como é uma página estática simples, vamos apenas copiar o index.html processado.

console.log(`Build concluído. Arquivo final em ${outdir}/index.html`);
console.log(`Chave de API Brevo usada: ${brevoApiKey.substring(0, 5)}... (Verifique no Cloudflare Pages)`);
