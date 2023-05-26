import { createPost } from "../services/posts.services.js";

export async function createPostController(req, res) {
  const { id } = res.locals.user;

  try {
    await createPost(id, res.locals.body, req.file);
    return res.sendStatus(201);
  } catch (err) {
    if (err.constraint === "posts_author_fkey") {
      return res.sendStatus(422);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}
