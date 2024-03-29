const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project")

/* http://localhost:3000/api/v1/projects/new-project */
router.post("/new-project", projectController.createProject);

/* http://localhost:3000/api/v1/projects */
router.get("/", projectController.getProjects);

/* http://localhost:3000/api/v1/projects/1 */
router.delete("/:id", projectController.removeProject);

/* http://localhost:3000/api/v1/projects/update-project/1 */
router.put("/update-project/:id", projectController.updateProject);

/* http://localhost:3000/api/v1/projects/1 */
router.get("/:id", projectController.getProject);

//URL'S Adicionales
/* http://localhost:3000/api/v1/projects/addUserToProject */
router.put("/addUserToProject", projectController.addUser);

/* http://localhost:3000/api/v1/projects/1/users */
router.get('/:id/users', projectController.getUsersOfProject);

/* http://localhost:3000/api/v1/projects/search-project/subject/POO */
router.get("/search-project/subject/:subject",projectController.getProjectsBySubject);

module.exports = router;