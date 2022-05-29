const mysql = require("mysql");
const users_manager = require("../controllers/usersManager.js");
const projects_manager = require("../controllers/projectsManager.js");
let usersManager;
let projectsManager;
let mysql_connection;

const initController = () => {
    connectToBD(initComponents);
};

const initComponents = (connection) => {
    usersManager = new users_manager(connection);
    projectsManager = new projects_manager(connection);
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
    console.log("Creating User...");
};

const createProject = (req, res) => {
    console.log("Creating Project...");
    console.log(JSON.stringify(req.body));
};

module.exports = {
    createUser,
    createProject,
    initController,
};
