const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./Utils");

// リゾルバ関係のファイル
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Vote = require("./resolvers/Vote");

// サブスクリプションの実装
const { PubSub } = require("apollo-server");

const prisma = new PrismaClient();
const pubsub = new PubSub();

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
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
  // select
  // Query: {
  //   info: () => "HackerNewsクローン",
  //   feed: () => links,
  //   feed: async (parent, args, context) => {
  //     return context.prisma.link.findMany();
  //   },
  // },
  // insert
  // Mutation: {
  //   post: (parent, args, context) => {
  //     const newLink = context.prisma.link.create({
  //       data: {
  //         url: args.url,
  //         description: args.description,
  //       },
  //     });
  //     return newLink;
  //   },
  //   post: (parent, args) => {
  //     let idCount = links.length;
  //     const link = {
  //       id: `link-${idCount++}`,
  //       description: args.description,
  //       url: args.url,
  //     };
  //     links.push(link);
  //     return link;
  //   },
  // },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

// サーバー起動
server.listen().then(({ url }) => {
  console.log(`${url} is running...`);
});
