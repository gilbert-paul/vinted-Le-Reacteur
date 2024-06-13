const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthentificated = require("../utils/isAuthentificated.js");
const createUser = require("../utils/user/createUser.js");
const loginUser = require("../utils/user/loginUser.js");
const updateUser = require("../utils/user/updateUser.js");
const deleteUser = require("../utils/user/deleteUser.js");
const deleteAllFromAnUser = require("../utils/user/deleteAllFromAnUser.js");

router.post("/signup", fileUpload(), async (req, res) => {
  try {
    const allInformationsUser= req.body;
    let avatar = {};
    if (req.files) {
      avatar = req.files;
    }
    const result = await createUser(
      allInformationsUser, avatar
    );
    return res.status(result.status).json({result.message, result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.status(result.status).json({result.message, result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.put("/update", isAuthentificated, fileUpload(), async (req, res) => {
  try {
    const user = req.user;

    const { username, email, newsletter } = req.body;
    let newAvatar = {};
    if (req.files) {
      newAvatar = req.files;
    }
    const result = await updateUser(
      user,
      username,
      email,
      newsletter,
      newAvatar
    );
    return res.status(result.status).json({result.message, result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.delete("/delete", isAuthentificated, fileUpload(), async (req, res) => {
  try {
    const user = req.user;
    const result = await deleteUser(user);
    return res.status(result.status).json({result.message, result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.delete(
  "/delete-all",
  isAuthentificated,
  fileUpload(),
  async (req, res) => {
    try {
      const user = req.user;
      const result = await deleteAllFromAnUser(user);
      return res.status(result.status).json({result.message, result.data});
    } catch (error) {
      return res.status(500).json({ message: "Error with BDD" });
    }
  }
);

module.exports = router;
