import "dotenv/config";
import { getPrisma } from "../src/lib/prisma";
import { getLiveProblems } from "../src/lib/ingestion";

async function main() {
  const problems = await getLiveProblems({ refresh: true });
  const prisma = getPrisma();

  const count = await prisma.problemRecord.count();

  console.log(
    JSON.stringify({
      fetched: problems.length,
      storedProblems: count,
    }),
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
