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
const accountsFrom = new Set();
const accountsTo = new Set();

const accountStats = {};

for (let i = 1; i < lines.length; i++) {
  const cols = splitCsvLine(lines[i]);
  const jenis = cols[2];
  const acc = cols[4];
  const toAcc = cols[5];
  const amount = Math.abs(parseFloat(cols[8].replace(/[^0-9.]/g, '')) || 0);

  if (acc) {
    accountsFrom.add(acc);
    if (!accountStats[acc]) accountStats[acc] = { income: 0, expense: 0, transferOut: 0, transferIn: 0, count: 0 };
    accountStats[acc].count++;
    if (jenis.toLowerCase().includes('pemasukan') || jenis.toLowerCase().includes('income')) {
      accountStats[acc].income += amount;
    } else if (jenis.toLowerCase().includes('transfer')) {
      accountStats[acc].transferOut += amount;
    } else {
      accountStats[acc].expense += amount;
    }
  }

  if (toAcc) {
    accountsTo.add(toAcc);
    if (!accountStats[toAcc]) accountStats[toAcc] = { income: 0, expense: 0, transferOut: 0, transferIn: 0, count: 0 };
    accountStats[toAcc].transferIn += amount;
  }
}

console.log('Accounts in Akun col:', Array.from(accountsFrom));
console.log('Accounts in Akun Tujuan col:', Array.from(accountsTo));
console.log('Account Stats:', JSON.stringify(accountStats, null, 2));
