import NotFoundError from "../errors/NotFoundError.js";
import CommentsRepository from "../repositories/comments.repository.js";
import getUsersImagesUrls from "./utils/getUsersImagesUrls.js";

class CommentsServices {
  static async create(userId, postId, content) {
    try {
      await CommentsRepository.insert(userId, postId, content);
    } catch (err) {
      if (err.constraint === "comments_author_fkey") {
        throw new NotFoundError("User not found");
      }

      if (err.constraint === "comments_post_id_fkey") {
        throw new NotFoundError("Post not found");
      }

      throw err;
    }
  }

  static async list(userId, options) {
    const comments = await CommentsRepository.list(userId, options);
    const authors = await getUsersImagesUrls(
      comments.map((comment) => comment.author)
    );

    return comments.map((comment, index) => ({
      ...comment,
      author: authors[index],
    }));
  }
}

export default CommentsServices;
