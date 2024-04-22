const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication")

/* http://localhost:3000/api/v1/publications/new-publication */
router.post("/new-publication", publicationController.createPublication);

/* http://localhost:3000/api/v1/publications */
router.get("/", publicationController.getPublications);

/* http://localhost:3000/api/v1/publications/1 */
router.delete("/:id", publicationController.removePublication);

/* http://localhost:3000/api/v1/publications/update-publication/1 */
router.put("/update-publication/:id", publicationController.updatePublication);

/* http://localhost:3000/api/v1/publications/1 */
router.get("/:id", publicationController.getPublication);

module.exports = router;