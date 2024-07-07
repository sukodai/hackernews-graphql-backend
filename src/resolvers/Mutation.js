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
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
