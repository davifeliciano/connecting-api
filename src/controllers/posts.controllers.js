import httpStatus from "http-status";
import {
  createPost,
  likePost,
  listPosts,
  unlikePost,
} from "../services/posts.services.js";

export async function listPostsController(req, res) {
  const { user, listOptions } = res.locals;
  const posts = await listPosts(user.id, listOptions);
  return res.send(posts);
}

export async function createPostController(req, res) {
  const { user } = res.locals;
  const { caption } = res.locals.body;
  await createPost(user.id, caption, req.file);
  return res.sendStatus(httpStatus.CREATED);
}

export async function likePostController(req, res) {
  const { user, id } = res.locals;
  await likePost(user.id, id);
  return res.send();
}

export async function unlikePostController(req, res) {
  const { user, id } = res.locals;
  await unlikePost(user.id, id);
  return res.send();
}
