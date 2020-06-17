const router = require("koa-router")();

router.prefix("/api");
router.get("/");

module.exports = router;
