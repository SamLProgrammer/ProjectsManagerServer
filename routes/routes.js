const { Router } = require('express');
const router = Router();
const { createUser, createProject, createActivity,
     getAllUsers, getAllProjects, getAllActivity,
      desactivateUser, assignActivityToUser, 
    login, disableProject, deleteActivity, getAllActivityUser,
    createAdvance, getAdvancesByUser, editAdvance, getAdvanceToEdit,
    getActivityByID, editActivity, getAdvancesByActivity,
    getProjectByID, editProject, hoursStatsPerUser, globalResponse,
    getStoredProject, getStoredActivity} = require('../controllers/controller');

router.get('/', globalResponse);
router.get('/getStoredProject', getStoredProject);
router.get('/getStoredActivity', getStoredActivity);
router.post('/createUser', createUser);
router.post('/createProject', createProject);
router.post('/createActivity', createActivity);
router.post('/getActivity', getAllActivity);
router.post('/deleteUser', desactivateUser);
router.post('/assignActivityToUser', assignActivityToUser);
router.post('/login', login);
router.post('/getAllActivityUser', getAllActivityUser);
router.post('/createAdvance', createAdvance);
router.post ('/getAdvanceToEdit', getAdvanceToEdit);
router.post('/getAdvancesByUser', getAdvancesByUser);
router.post('/getAdvancesByActivity', getAdvancesByActivity);
router.post('/editAdvance', editAdvance);
router.post('/getActivityToEdit', getActivityByID);
router.post('/editActivity', editActivity);
router.post('/getProjectToEdit', getProjectByID);
router.post('/editProject', editProject);
router.post('/hoursStatsPerUser', hoursStatsPerUser);

router.post('/deleteProject', disableProject);
router.post('/deleteActivity', deleteActivity);

router.get('/getUsers', getAllUsers);
router.get('/getProjects', getAllProjects);

module.exports = router;