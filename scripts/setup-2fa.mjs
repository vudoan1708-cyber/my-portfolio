import { Secret, TOTP } from 'otpauth';
import qrcode from 'qrcode-terminal';
import readline from 'node:readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const account =
  (await rl.question('Account label (e.g. your email) [admin]: ')).trim() ||
  'admin';
rl.close();

const secret = new Secret({ size: 20 });
const totp = new TOTP({
  issuer: 'Portfolio Admin',
  label: account,
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret,
});

console.log('\nScan this QR code with your authenticator app:\n');
qrcode.generate(totp.toString(), { small: true });

console.log('\nOr enter the secret manually:');
console.log(`  ${secret.base32}`);

console.log('\nThen add this to your Vercel env vars (mark as Sensitive):');
console.log(`ADMIN_TOTP_SECRET=${secret.base32}`);

console.log(
  '\nTip: verify the setup by checking that your app shows a 6-digit code that matches:',
);
console.log(`  Current code: ${totp.generate()} (rotates every 30s)`);
