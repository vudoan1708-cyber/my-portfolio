import bcrypt from 'bcryptjs';
import readline from 'node:readline';
import { Writable } from 'node:stream';

const muted = new Writable({
  write(chunk, encoding, cb) {
    if (!muted.muted) process.stdout.write(chunk, encoding);
    cb();
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: muted,
  terminal: true,
});

function ask(prompt, hidden = false) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    muted.muted = hidden;
    rl.question('', (answer) => {
      muted.muted = false;
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

const pw = await ask('Password: ', true);
if (pw.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}
const confirm = await ask('Confirm:  ', true);
if (pw !== confirm) {
  console.error('Passwords do not match.');
  process.exit(1);
}
rl.close();

const hash = await bcrypt.hash(pw, 12);
const escaped = hash.replace(/\$/g, '\\$');
console.log('\nAdd to .env.local (backslash-escape the $ chars — dotenv-expand mangles them otherwise):');
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
console.log('\nFor Vercel env vars: paste the hash as-is, no escaping (Vercel does not interpolate). Mark as Sensitive.');
console.log(`Hash only: ${hash}`);
