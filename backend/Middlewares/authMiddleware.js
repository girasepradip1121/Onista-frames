// const jwt = require("jsonwebtoken");
// // const models = require("../Models/index");
// const User = require("../Models/usermodel");
// require("dotenv").config();

// const authMiddleWare = async (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return Error(res, "Token is missing, please provide a valid token");
//   }

//   try {
//     const decodedToken = jwt.decode(token);

//     if (decodedToken === null) {
//       return res.status(403).json({
//         status: 403,
//         description: "Token does not match",
//       });
//     }
//     console.log("decoded", decodedToken);

//     const user = await User.findOne({
//       where: { userId: decodedToken.id },
//     });
//     console.log("user", user);

//     if (!user) {
//       return res
//         .status(403)
//         .json({ status: 403, description: "User not found" });
//     }

//     if (user.token !== token) {
//       return res.status(403).json({
//         status: 403,
//         description: "Token does not match!!!",
//       });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, verifiedUser) => {
//       if (err) {
//         return res
//           .status(403)
//           .json({ status: 403, description: "Token is invalid or expired" });
//       }

//       req.user = verifiedUser;
//       next();
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ status: 500, description: "Internal Server Error" });
//   }
// };

// module.exports = authMiddleWare;

const jwt = require("jsonwebtoken");
const User = require("../Models/usermodel");
require("dotenv").config();

const authMiddleWare = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token is missing, please provide a valid token" });
  }

  try {
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken || !decodedToken.userId) {
      return res
        .status(403)
        .json({ message: "Token verification failed, userId missing" });
    }
    console.log("decoded", decodedToken);

    // Fetch the user based on the userId from the decoded token
    const user = await User.findOne({
      where: { userId: decodedToken.userId }, // Use decodedToken.userId here
    });
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the token stored in the user's record matches the token sent by the client
    if (user.token !== token) {
      return res
        .status(403)
        .json({ message: "Token mismatch, please login again" });
    }

    // Attach user data to request for further use in controllers
    req.user = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({
      message: "Token is invalid or expired, please login again",
      error: err.message,
    });
  }
};

module.exports = authMiddleWare;
