const Router = require("express");
const router = new Router();
const userRouter = require("./user");
const newsRouter = require("./news");

router.use("/user", userRouter);
router.use("/news", newsRouter);

module.exports = router;
