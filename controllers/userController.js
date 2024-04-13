import authService from "../services/authService.js";
import logger from "../services/logger.js";
import userService from "../services/userService.js";

const createUser = async (req, res) => {
  logger.info("createUser");
  if (!req.body.email) {
    res.status(400).send({ err: "Create user failed, missing email" });
    return;
  }

  const { email, firstname, lastname, password } = req.body;
  const db = req.app.locals.db;

  const user = await userService.getUserByEmail(db, email);

  if (user) {
    res.status(200).send({ err: "User already exists with this email" });
  } else {
    const hPassword = await authService.hashPassword(password);

    const userId = await userService.createUser(
      db,
      email,
      hPassword,
      firstname,
      lastname
    );

    const token = authService.getToken(userId, email);

    res.status(200).send({
      firstname,
      lastname,
      email,
      token,
    });
  }
};

const login = async (req, res) => {
  logger.info("login");
  if (!req.body.email) {
    res.status(400).send({ err: "Bad request, missing email" });
    return;
  }

  const email = req.body.email;
  const db = req.app.locals.db;

  const user = await userService.getUserByEmail(db, email);

  // if no user, or mismatch password, return fail
  if (!user || !authService.comparePassword(req.body.password, user.password)) {
    res
      .status(200)
      .send({ err: "Login failed, email or password don't match" });
  } else {
    const token = authService.getToken(user._id, user.email);

    res.status(200).send({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token,
    });
  }
};

export default { createUser, login };
