const { Router } = require('express');
const router = Router();
const { createUser, createProject, createActivity,
     getAllUsers, getAllProjects, getAllActivity,
      desactivateUser, sendProjectId, assignActivityToUser, 
    login, disableProject, deleteActivity, getAllActivityUser} = require('../controllers/controller');

router.post('/createUser', createUser);
router.post('/createProject', createProject);
router.post('/createActivity', createActivity);
router.get('/getUsers', getAllUsers);
router.get('/getProjects', getAllProjects);
router.post("/getActivity", getAllActivity);
router.post('/deleteUser', desactivateUser);
router.post('/assignActivityToUser', assignActivityToUser);
router.post('/login', login);
router.delete('/deleteProject', disableProject);
router.delete('/deleteActivity', deleteActivity);
router.get('/getAllActivityUser', getAllActivityUser);
module.exports = router;
