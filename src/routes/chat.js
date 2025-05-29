const express = require('express');
const router = express.Router();
const chatController = require("../controllers/chat");
const passport = require("passport");
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});
router.get("/",passportJWT, chatController.index);
router.post("/createRoom",passportJWT, chatController.createRoom);
router.post("/send/:roomID", passportJWT,(req, res) => chatController.sendMessage(req, res));
router.get("/:roomID", passportJWT,chatController.getMessage);
module.exports = router;