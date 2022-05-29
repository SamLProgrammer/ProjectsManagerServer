const { Router } = require('express');
const router = Router();
const { createUser, createProject } = require('../controllers/controller');

router.post('/createUser', createUser);
router.post('/createProject', createProject);
module.exports = router;
