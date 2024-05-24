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
    return createUser(req, res);
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.get("/login", async (req, res) => {
  try {
    return await loginUser(req, res);
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.put("/update", isAuthentificated, fileUpload(), async (req, res) => {
  try {
    return await updateUser(req, res);
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});

router.delete("/delete", isAuthentificated, fileUpload(), async (req, res) => {
  try {
    return await deleteUser(req, res);
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
      return await deleteAllFromAnUser(req, res);
    } catch (error) {
      return res.status(500).json({ message: "Error with BDD" });
    }
  }
);

module.exports = router;
