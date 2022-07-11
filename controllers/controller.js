const mysql = require("mysql");
const users_manager = require("../controllers/usersManager.js");
const projects_manager = require("../controllers/projectsManager.js");
const activities_manager = require("../controllers/activitiesManager.js");
const advances_manager = require("../controllers/advanceManager.js");
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
    usersManager = new users_manager(connection);
    projectsManager = new projects_manager(connection);
    activitiesManager = new activities_manager(connection);
    advancesManager = new advances_manager(connection);
};

const connectToBD = (componentsInitializer) => {
    mysql_connection = mysql.createConnection({
        //Esto tiene que arreglarse, estamos estructurando
        host: "localhost",
        user: "root",
        password: "leliberteHal0",
        database: "projectsmanager",
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
    console.log('Insertando activity')
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
    createAdvance
};
