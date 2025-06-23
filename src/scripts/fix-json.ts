import fs from 'fs';

const inputPath = 'H:/Desktop/EV DB/database/electric/ev_database.json';
const outputPath = 'H:/Desktop/mon_fichier_corrige.json';

const lines = fs.readFileSync(inputPath, 'utf-8')
  .split('\n')
  .filter(line => line.trim() !== '');

const corrected = '[\n' + lines.map(line => line.trim()).join(',\n') + '\n]';

fs.writeFileSync(outputPath, corrected);
console.log('✅ Fichier corrigé :', outputPath);
