const Router = require("express");
const router = new Router();
const newsController = require("../controllers/news");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, newsController.createNews);
router.get("/news", newsController.getAll);
router.get("/news/:id", newsController.getOne);
router.patch("/news/:id", authMiddleware, newsController.update);
router.delete("/news/:id", authMiddleware, newsController.delete);

module.exports = router;
