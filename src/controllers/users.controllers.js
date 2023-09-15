import {
  followUser,
  getUserByUsername,
  getUserFollowers,
  unfollowUser,
  updateUser,
} from "../services/users.services.js";

export async function getByUsernameController(req, res) {
  const { username } = res.locals.params;
  const { id } = res.locals.user;
  const user = await getUserByUsername(id, username);
  return res.send(user);
}

export async function updateController(req, res) {
  const { user } = res.locals;
  const { name, bio } = res.locals.body;
  await updateUser(user.id, name, bio, req.file);
  return res.send();
}

export async function followController(req, res) {
  const { user } = res.locals;
  const leaderId = res.locals.params.id;
  await followUser(user.id, leaderId);
  return res.send();
}

export async function unfollowController(req, res) {
  const { user } = res.locals;
  const leaderId = res.locals.params.id;
  await unfollowUser(user.id, leaderId);
  return res.send();
}

export async function getFollowersController(req, res) {
  const userId = res.locals.params.id;
  const followers = await getUserFollowers(userId);
  return res.send(followers);
}

export async function getLeadersController(req, res) {
  const userId = res.locals.params.id;
  const leaders = await getUserFollowers(userId);
  return res.send(leaders);
}
