const Router = require("express");
const router = new Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

router.post("/signup", userController.registration);
router.post("/signin", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/users", userController.getAll);
router.get("/user/:id", userController.getOne);

module.exports = router;
