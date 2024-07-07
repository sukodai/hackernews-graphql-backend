// 誰によって投稿されたのかのリゾルバ
// postedBy のフィールドに対するリゾルバ
function postedBy(parent, args, context) {
  return context.prisma.link
    .findUnique({
      where: { id: parent.id },
    })
    .postedBy();
}

module.exports = {
  postedBy,
};
