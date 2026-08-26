const fs = require('fs');
const path = require('path');
const rawText = fs.readFileSync(path.join(__dirname, 'moneyPlusRawData.csv'), 'utf8');

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

for (let i = 1; i < lines.length; i++) {
  const cols = splitCsvLine(lines[i]);
  const jenis = cols[2];
  if (jenis.toLowerCase().includes('transfer')) {
    console.log(`Row ${cols[0]}: Tanggal=${cols[1]}, Nama=${cols[3]}, AkunAsal=${cols[4]}, AkunTujuan=${cols[5]}, Jumlah=${cols[8]}, Catatan=${cols[9]}`);
  }
}
