export const verifyId = async (req, res, next) => {
  try {
    const { userId, postId, commentId, accountId, replyId } = req.params;
    if (userId) {
      if (userId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (accountId) {
      if (accountId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (postId) {
      if (postId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (replyId) {
      if (replyId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (commentId) {
      if (commentId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const verifyFields = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, birthDate, gender } =
      req.body;
    const regex = {
      email: /((\w)+.?)+@\w{1,}\.\w{2,}/gi,
      firstName:
        /.[^!|@|#|$|%|^|&|*|(|)|_|-|=|+|<|>|/|\\|'|"|:|;|[|]|\{|\}]{2,}/gi,
      lastName:
        /.[^!|@|#|$|%|^|&|*|(|)|_|-|=|+|<|>|/|\\|'|"|:|;|[|]|\{|\}]{2,}/gi,
      password: /(\d+|\W+|.+){8,}/gi,
      confirmPassword: /(\d+|\W+|.+){8,}/gi,
    };
    if (firstName) {
      if (!regex.firstName.test(firstName)) {
        return res.status(400).json({ message: "Invalid first name" });
      }
    }
    if (lastName) {
      if (!regex.lastName.test(lastName)) {
        return res.status(400).json({ message: "Invalid last name" });
      }
    }
    if (email) {
      if (!regex.email.test(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    if (password) {
      if (!regex.password.test(password)) {
        return res.status(400).json({ message: "Invalid password format" });
      }
    }
    if (birthDate) {
    }
    if (gender) {
      if (!(gender !== "male" || gender !== "female")) {
        return res.status(400).json({ message: "Invalid gender" });
      }
    }
    next();
  } catch (error) {}
};
