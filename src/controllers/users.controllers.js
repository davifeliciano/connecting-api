import UserRepository from "../repositories/users.repository.js";
import {
  getUserByUsername,
  getUserFollowers,
  updateUser,
} from "../services/users.services.js";

export async function getByUsernameController(req, res) {
  const { username } = res.locals;

  try {
    const user = await getUserByUsername(username);
    return user ? res.send(user) : res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function updateController(req, res) {
  const { user, body } = res.locals;

  try {
    await updateUser(user.id, body, req.file);
    return res.sendStatus(200);
  } catch (err) {
    if (
      err.constraint === "profiles_user_id_fkey" ||
      err.constraint === "user_images_user_id_fkey"
    ) {
      res.sendStatus(422);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

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

export async function getFollowersController(req, res) {
  const { id: userId } = res.locals;

  try {
    const followers = await getUserFollowers(userId);

    if (followers.length !== 0) return res.send(followers);

    const leader = await UserRepository.findById(userId);
    return leader ? res.send([]) : res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function getLeadersController(req, res) {
  const { id: userId } = res.locals;

  try {
    const leaders = await getUserFollowers(userId);

    if (leaders.length !== 0) return res.send(leaders);

    const follower = await UserRepository.findById(userId);
    return follower ? res.send([]) : res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
