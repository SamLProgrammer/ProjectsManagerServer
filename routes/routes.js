const { Router } = require('express');
const router = Router();
const { createUser, createProject, createActivity, getAllUsers, getAllProjects, getAllActivity, desactivateUser, sendProjectId } = require('../controllers/controller');

router.post('/createUser', createUser);
router.post('/createProject', createProject);
router.post('/createActivity', createActivity);
router.get('/getUsers', getAllUsers);
router.get('/getProjects', getAllProjects);
router.get("/getActivity", getAllActivity);
router.post("/sendProjectId", sendProjectId);
router.post('/deleteUser', desactivateUser);
//deleteuser;
//deleteprojects;
module.exports = router;
