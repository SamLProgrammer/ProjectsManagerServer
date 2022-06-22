const { Router } = require('express');
const router = Router();
const { createUser, createProject, createActivity, getAllUsers } = require('../controllers/controller');

router.post('/createUser', createUser);
router.post('/createProject', createProject);
router.post('/createActivity', createActivity);
router.get('/getUsers', getAllUsers);
//getprojects;
//deleteuser;
//deleteprojects;
module.exports = router;
