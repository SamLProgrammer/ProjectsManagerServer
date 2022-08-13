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

let stored_project;


const test = (req, res) => {
    res.send('dude');
}
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
        host: "bd5ouosomtaqwqoole88-mysql.services.clever-cloud.com",
        user: "u8gp3myje2rag4m0",
        port: 3306,
        password: "H6sPnfM1YdjlvRRutez7",
        database: "bd5ouosomtaqwqoole88",
        timezone : 'local'
        // host: "localhost",
        // user: "root",
        // port: 3306,
        // password: "leliberteHal0",
        // database: "projectsmanager",
        // timezone : 'local'
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
    advancesManager.firstAdvanceValidation(req.body, res);
}

const getAdvancesByUser = (req, res) => {
    advancesManager.getAdvancesByUser(req.body, res);
}

const editAdvance = (req, res) => {
    advancesManager.validateAndEditAdvance(req.body, res);
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

const getProjectByID = async (req, res, stored_project) => {
    this.stored_project = await projectsManager.getProjectByID(req.body, res, stored_project);
}

const editProject = (req, res) => {
    projectsManager.editProject(req.body, res);
}

const hoursStatsPerUser = (req, res) => {
    usersManager.statsPerUser(req.body, res);
}

const globalResponse  = (req, res) => {
    res.send('Ola ke me ase');
}

const getStoredProject = (req,res) => {
    res.send(this.stored_project);
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
    hoursStatsPerUser,
    globalResponse,
    test,
    getStoredProject
};
