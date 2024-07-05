const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// HackerNews の１つ１つの投稿
// let links = [
//   {
//     id: "link-0",
//     description: "GraphQLを学ぶ",
//     url: "yahoo.co.jp",
//   },
// ];

// スキーマ
//const typeDefs = gql``;

// リゾルバ
const resolvers = {
  // select
  Query: {
    info: () => "HackerNewsクローン",
    //feed: () => links,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },

  // insert
  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    // post: (parent, args) => {
    //   let idCount = links.length;

    //   const link = {
    //     id: `link-${idCount++}`,
    //     description: args.description,
    //     url: args.url,
    //   };

    //   links.push(link);
    //   return link;
    // },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: {
    prisma,
  },
});

// サーバー起動
server.listen().then(({ url }) => {
  console.log(`${url} is running...`);
});
