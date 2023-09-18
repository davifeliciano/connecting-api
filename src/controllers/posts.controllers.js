import httpStatus from "http-status";
import {
  createPost,
  getPostById,
  likePost,
  listPosts,
  unlikePost,
} from "../services/posts.services.js";

export async function listPostsController(req, res) {
  const { user } = res.locals;
  const listOptions = res.locals.query;
  const posts = await listPosts(user.id, listOptions);
  return res.send(posts);
}

export async function getPostByIdController(req, res) {
  const { user } = res.locals;
  const { id: postId } = res.locals.params;
  const post = await getPostById(user.id, postId);
  return res.send(post);
}

export async function createPostController(req, res) {
  const { user } = res.locals;
  const { caption } = res.locals.body;
  await createPost(user.id, caption, req.file);
  return res.sendStatus(httpStatus.CREATED);
}

export async function likePostController(req, res) {
  const { user, params } = res.locals;
  const postId = params.id;
  await likePost(user.id, postId);
  return res.send();
}

export async function unlikePostController(req, res) {
  const { user, params } = res.locals;
  const postId = params.id;
  await unlikePost(user.id, postId);
  return res.send();
}
