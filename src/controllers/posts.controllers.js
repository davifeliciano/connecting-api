import PostsRepository from "../repositories/posts.repository.js";
import { createPost, listPosts } from "../services/posts.services.js";

export async function listPostsController(req, res) {
  const { user, listOptions } = res.locals;

  try {
    const posts = await listPosts(user.id, listOptions);
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function createPostController(req, res) {
  const { user } = res.locals;

  try {
    await createPost(user.id, res.locals.body, req.file);
    return res.sendStatus(201);
  } catch (err) {
    if (err.constraint === "posts_author_fkey") {
      return res.sendStatus(422);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function likePostController(req, res) {
  const { user, id } = res.locals;

  try {
    await PostsRepository.like(user.id, id);
    return res.sendStatus(200);
  } catch (err) {
    if (err.constraint === "post_likes_author_fkey") {
      return res.sendStatus(422);
    }

    if (err.constraint === "post_likes_post_id_fkey") {
      return res.sendStatus(404);
    }

    if (err.constraint === "post_likes_author_post_id_key") {
      return res.sendStatus(409);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function unlikePostController(req, res) {
  const { user, id } = res.locals;

  try {
    await PostsRepository.unlike(user.id, id);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
