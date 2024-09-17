const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../Utils");

// ユーザー新規作登録
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10);

  // ユーザー新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

// ユーザーログイン
async function login(parent, args, context) {
  // emailがあるか？
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("ユーザーはいません");
  }

  // パスワード比較
  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  // パスワードが正しい時は署名した token を生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

// 投稿する
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  // 送信
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

// 投票する
async function vote(parent, args, cotext) {
  // const vote = context.prisma.vote.findUnique({
  //   where: {
  //     linkId_userId: {
  //       linkId: Number(args.linkId),
  //       userId: userId,
  //     },
  //   },
  // });

  // // 2回投票を防ぐ
  // if (Boolean(vote)) {
  //   throw new Error(`投票済みです: ${args.linkId}`);
  // }

  // 投票する
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  // 送信する
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
