import httpStatus from "http-status";
import CommentsServices from "../services/comments.services.js";

export async function listCommentsController(req, res) {
  const { user } = res.locals;
  const listOptions = res.locals.query;
  const comments = await CommentsServices.list(user.id, listOptions);
  return res.send(comments);
}

export async function createCommentController(req, res) {
  const { user } = res.locals;
  const { postId, content } = res.locals.body;
  await CommentsServices.create(user.id, postId, content);
  return res.sendStatus(httpStatus.CREATED);
}
