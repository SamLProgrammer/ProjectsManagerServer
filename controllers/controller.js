const mysql = require("mysql");
const users_manager = require("../controllers/usersManager.js");
const projects_manager = require("../controllers/projectsManager.js");
const activities_manager = require("../controllers/activitiesManager.js");
const { Server } = require("socket.io");
let usersManager;
let projectsManager;
let activitiesManager;
let mysql_connection;

const initController = () => {
    connectToBD(initComponents);
};

const initComponents = (connection) => {
    usersManager = new users_manager(connection);
    projectsManager = new projects_manager(connection);
    activitiesManager = new activities_manager(connection);
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
    activitiesManager.insertActivity(req.body,res);
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

module.exports = {
    createUser,
    createProject,
    initController,
    createActivity,
    getAllUsers,
    getAllProjects
};
