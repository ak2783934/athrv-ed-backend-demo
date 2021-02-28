var expressJwt = require("express-jwt");
exports.isSignedIn = expressJwt({
  secret: process.env.secret,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

exports.isAdmin = (req, res, next) => {
  if (!req.profile.isadmin) {
    return res.status(403).json({ error: "you are not admin: ACCESS DENIED" });
  }
  next();
};
