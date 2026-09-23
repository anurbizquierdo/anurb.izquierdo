// Execute após editar looks.json para atualizar a prévia aberta por duplo clique.
const fs = require('node:fs');
const path = require('node:path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'looks.json'), 'utf8'));
for (const look of data.looks) {
  if (look.numeroDePecas !== look.pecas.length) throw new Error(`Confira numeroDePecas no look ${look.numero}`);
}
fs.writeFileSync(path.join(__dirname, 'looks-data.js'), '// Gerado por sync-data.cjs a partir de looks.json. Não editar manualmente.\nwindow.ANURB_LOOKS = ' + JSON.stringify(data, null, 2) + ';\n');
