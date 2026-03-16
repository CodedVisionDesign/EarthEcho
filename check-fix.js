const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const accounts = await p.account.findMany({ select: { userId: true, provider: true, type: true } });
  console.log('Credential accounts:', accounts.length);
  accounts.forEach(a => console.log(`  user: ${a.userId}, provider: ${a.provider}, type: ${a.type}`));
  await p.$disconnect();
})();
