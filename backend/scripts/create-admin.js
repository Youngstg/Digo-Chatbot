import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  const username = args[0] || process.env.ADMIN_USERNAME || 'admin';
  const password = args[1] || process.env.ADMIN_PASSWORD || 'admin123';
  const email = args[2] || process.env.ADMIN_EMAIL || `${username}@digo.id`;
  const name = args[3] || 'Administrator Digo';

  console.log('--- Setup Akun Admin Digo ---');
  console.log(`Username : ${username}`);
  console.log(`Email    : ${email}`);
  console.log(`Nama     : ${name}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      const updated = await prisma.admin.update({
        where: { id: existing.id },
        data: {
          username,
          email,
          password: hashedPassword,
          name,
        },
      });
      console.log(`\n✅ Berhasil! Akun admin "${username}" telah diperbarui.`);
      console.log(`ID: ${updated.id}`);
    } else {
      const created = await prisma.admin.create({
        data: {
          username,
          email,
          password: hashedPassword,
          name,
        },
      });
      console.log(`\n✅ Berhasil! Akun admin "${username}" baru telah dibuat.`);
      console.log(`ID: ${created.id}`);
    }

    console.log('\nSilakan login di halaman: /login');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat menyimpan akun ke database:');
    console.error(err.message);
    console.log(
      '\nTip: Pastikan tabel "admins" sudah ada dengan menjalankan "npx prisma db push".'
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

