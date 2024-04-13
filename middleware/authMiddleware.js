import authService from "../services/authService.js";

const authorize = (req, res, next) => {
  // switching this up, passing this in to the specific routes I want checked, so don't
  // need this check any more - leaving in case it ends up being needed
  //   // only check api's
  //   if (!req.path.startsWith("/api")) {
  //     next();
  //     return;
  //   }

  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    // verify token
    authService.verify(token, (err, decoded) => {
      if (err) {
        // invalid token
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // missing token
    res.status(401).json({ message: "Access Denied. No token provided." });
  }
};

export default authorize;
