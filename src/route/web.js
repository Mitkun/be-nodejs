import express from "express";
import homeController from "../controllers/homeController";
import userController from '../controllers/userController'

const router = express.Router();

const initWebRoutes = (app) => {
  router.get('/', homeController.getHomePage);
  router.get('/crud', homeController.getCRUD);

  router.post('/post-crud', homeController.postCRUD);
  router.get('/get-crud', homeController.displayGetCRUD);
  router.get('/edit-crud', homeController.getEditCRUD);
  router.post('/put-crud', homeController.putCRUD);
  router.get('/delete-crud', homeController.deleteCRUD);

  //api

  router.post('/api/login', userController.handleLogin);
  router.get('/api/get-all-users', userController.handleGetAllUsers);
  router.post('/api/create-new-user', userController.handleCreateNewUser);
  router.put('/api/edit-user', userController.handleEditUser);
  router.delete('/api/delete-user', userController.handleDeleteUser);

  return app.use("/", router)
}

module.exports = initWebRoutes;