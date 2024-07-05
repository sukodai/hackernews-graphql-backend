// DBにアクセスするためのクライアントライブラリ

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "GraphQLを学ぶ",
      url: "https://graphql.org/",
    },
  });

  const allLinks = await prisma.link.findMany();
  console.log("allLinks:", allLinks);
}

main()
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(async () => {
    // DBを閉じる
    prisma.$disconnect;
  });
