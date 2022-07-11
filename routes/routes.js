const { Router } = require('express');
const router = Router();
const { createUser, createProject, createActivity,
     getAllUsers, getAllProjects, getAllActivity,
      desactivateUser, assignActivityToUser, 
    login, disableProject, deleteActivity, getAllActivityUser,
    createAdvance} = require('../controllers/controller');

router.post('/createUser', createUser);
router.post('/createProject', createProject);
router.post('/createActivity', createActivity);
router.post("/getActivity", getAllActivity);
router.post('/deleteUser', desactivateUser);
router.post('/assignActivityToUser', assignActivityToUser);
router.post('/login', login);
router.post('/getAllActivityUser', getAllActivityUser);
router.post('/createAdvance', createAdvance)

router.delete('/deleteProject', disableProject);
router.delete('/deleteActivity', deleteActivity);

router.get('/getUsers', getAllUsers);
router.get('/getProjects', getAllProjects);
//router.get('/getAdvances', getAdvances)

module.exports = router;