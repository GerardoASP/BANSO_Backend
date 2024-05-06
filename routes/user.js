const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

/* http://localhost:3000/api/v1/users/new-user */
router.post("/new-user", userController.createUser);

/* http://localhost:3000/api/v1/users */
router.get("/", userController.getUsers);

/* http://localhost:3000/api/v1/users/1 */
router.delete("/:id", userController.removeUser);

/* http://localhost:3000/api/v1/users/update-user/1 */
router.put("/update-user/:id", userController.updateUser);

/* http://localhost:3000/api/v1/users/1 */
router.get("/:id", userController.getUser);

/* http://localhost:3000/api/v1/users/get-user-by-email/email*/
router.get("/get-user-by-email/:email",userController.getUserByEmail)

//URL'S Adicionales
/* http://localhost:3000/api/v1/users/addProjectToUser */
router.put("/addProjectToUser", userController.addProject);

/* http://localhost:3000/api/v1/users/1/projects */
router.get('/:id/projects', userController.getProjectsOfUser);

/*  http://localhost:3000/api/v1/users/1/publications 
router.get('/:id/publications', userController.getPublicationsOfUser); */

/* http://localhost:3000/api/v1/users/31/publications */
router.get('/:verifyCode/publications', userController.getPublicationsOfUserVerifyCode);

/* http://localhost:3000/api/v1/users/get-user-by-verify-code/token*/
router.get("/get-user-by-verify-code/:verifyCode",userController.getUserByVerifyCode)
module.exports = router;