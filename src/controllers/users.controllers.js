import UserRepository from "../repositories/users.repository.js";

export async function followController(req, res) {
  const { user, id: leaderId } = res.locals;

  try {
    await UserRepository.follow(user.id, leaderId);
    return res.sendStatus(200);
  } catch (err) {
    if (err.constraint === "followers_check") {
      return res.sendStatus(422);
    }

    if (err.constraint === "followers_leader_id_follower_id_key") {
      return res.sendStatus(409);
    }

    if (err.constraint === "followers_leader_id_fkey") {
      return res.sendStatus(404);
    }

    if (err.constraint === "followers_follower_id_fkey") {
      return res.sendStatus(401);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function unfollowController(req, res) {
  const { user, id: leaderId } = res.locals;

  try {
    await UserRepository.unfollow(user.id, leaderId);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
