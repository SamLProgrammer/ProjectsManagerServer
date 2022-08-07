const mysql = require("mysql");
const users_manager = require("../controllers/usersManager.js");
const projects_manager = require("../controllers/projectsManager.js");
const activities_manager = require("../controllers/activitiesManager.js");
const advances_manager = require("../controllers/advanceManager.js");
var moment = require('moment');
const { Server } = require("socket.io");
let usersManager;
let projectsManager;
let activitiesManager;
let advancesManager;
let mysql_connection;

const initController = () => {
    connectToBD(initComponents);
};

const initComponents = (connection) => {
    usersManager = new users_manager(connection, moment);
    projectsManager = new projects_manager(connection, moment);
    activitiesManager = new activities_manager(connection, moment);
    advancesManager = new advances_manager(connection, moment);
};

const connectToBD = (componentsInitializer) => {
    mysql_connection = mysql.createConnection({
        //Esto tiene que arreglarse, estamos estructurando
        host: "localhost",
        user: "root",
        password: "leliberteHal0",
        database: "projectsmanager",
        timezone : 'local'
    });

    mysql_connection.connect(function (err) { 
        if (err) throw err;
        console.log("Connected!");
        componentsInitializer(mysql_connection);
    });
};

const createUser = (req, res) => {
    usersManager.insertUser(req.body, res);
};

const createActivity = (req, res) => {
    activitiesManager.insertActivity(req.body, res);
}

const createProject = (req, res) => {
    projectsManager.insertProject(req.body, res);
};

const getAllUsers = (req, res) => {
    usersManager.getAllUsers(res);
}

const getAllProjects = (req, res) => {
    projectsManager.getAllProjects(res);
}

const getAllActivity = (req, res) => {
    activitiesManager.getAllActivity(req.body, res);
  };

const desactivateUser = (req, res) => {
    console.log(req);
    usersManager.desactivateUser(req.body.User_Id, res);
};


const login = (req, res) => {
    usersManager.login(req.body, res);
}

const assignActivityToUser = (req, res) => {
    activitiesManager.assignActivityToUser(req.body, res);
}

const disableProject = (req, res) => {
    projectsManager.disableProject(req.body, res);
}

const deleteActivity = (req, res) => {
    activitiesManager.deleteActivity(req.body, res);
}

const getAllActivityUser = (req, res) => {
    activitiesManager.getAllActivityUser(req.body, res);
}

const createAdvance = (req, res) => {
    advancesManager.createAdvance(req.body, res);
}

const getAdvancesByUser = (req, res) => {
    advancesManager.getAdvancesByUser(req.body, res);
}

const editAdvance = (req, res) => {
    advancesManager.editAdvance(req.body, res);
}

const getAdvanceToEdit = (req, res) => {
    advancesManager.getAdvance(req.body, res);
}

const getActivityByID = (req, res) => {
    activitiesManager.getActivityByID(req.body.activity_id, res);
}

const getAdvancesByActivity = (req, res) => {
    advancesManager.getAdvanceByActivity(req.body, res);
}

const editActivity = (req, res) => {
    activitiesManager.editActivity(req.body, res);
}

const getProjectByID = (req, res) => {
    projectsManager.getProjectByID(req.body, res);
}

const editProject = (req, res) => {
    projectsManager.editProject(req.body, res);
}

const hoursStatsPerUser = (req, res) => {
    usersManager.hoursStatsPerUser(req.body, res);
}

module.exports = {
    createUser,
    createProject,
    initController,
    createActivity,
    getAllUsers,
    getAllProjects,
    getAllActivity,
    desactivateUser,
    assignActivityToUser,
    login,
    disableProject,
    deleteActivity,
    getAllActivityUser,
    createAdvance,
    getAdvancesByUser,
    editAdvance,
    getAdvanceToEdit,
    getActivityByID,
    editActivity,
    getAdvancesByActivity,
    getProjectByID,
    editProject,
    hoursStatsPerUser
};
