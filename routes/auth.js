const router = require("router");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const generateApiKey = require("generate-api-key");
const { body, validationResult } = require("express-validator");
dotenv.config({ path: ".env" });

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied! Token is required" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.APP_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Access Denied! Invalid Token" });
  }
};
router
  .get("/", verifyUser, async (req, res) => {
    const { user } = req.query;
    const userData = await User.findOne({ _id: user._id });
    res.json(userData);
  })
  .post("/signup", body("username").isEmail(), async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check is a user already exists with email address

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    newUser
      .save()
      .then(() => {
        res.json({ message: "User created" });
      })
      .catch((e) => res.status(500).send({ message: e.message }));
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "No user found with the given email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid username & password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.APP_SECRET);
    res.json({ token });
  })
  .put("/api_key/create", verifyUser, async (req, res) => {
    const { user } = req;
    const api_key = generateApiKey();

    User.findOneAndUpdate({ _id: user._id }, { api_key })
      .then((updated) => {
        if (updated) {
          res.json({ api_key });
        }
      })
      .catch((e) => {
        res.status(500).send({ message: "Error in Generating API Key" });
      });
  });

module.exports = router;
