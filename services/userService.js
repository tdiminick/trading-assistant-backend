import logger from "./logger.js";

const createUser = async (db, email, password, firstname, lastname) => {
  const user = { email, password, firstname, lastname };

  const result = await db.insertUser(user);

  logger.info(`A new user was created, ${email}, id: ${result.insertedId}`);

  return result.insertedId;
};

const getUserByEmail = async (db, email) => {
  return await db.findUserByEmail(email);
};

export default { createUser, getUserByEmail };
