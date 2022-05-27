const mysql = require('mysql'); 
const usersManager = require('../controllers/usersManager.js')

const connectToBD = (req, res) => {
    let con = mysql.createConnection({  //Esto tiene que arreglarse, estamos estructurando
        host: "localhost",  
        user: "root",  
        password: "leliberteHal0",  
        database: "projectsmanager"  
        });  
        
        con.connect(function(err) {  
            if (err) throw err;  
            console.log("Connected!");  
        });
        //this is just for testing
        con.query("SELECT * FROM user", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
          });
}

const createUser = (req, res) => {
    console.log('Creating User...');
    console.log(JSON.stringify(req.body));
}

const createProject = (req,res) => {
    console.log('Creating Project...');
    console.log(JSON.stringify(req.body))
}

module.exports =  {
    connectToBD,
    createUser,
    createProject
}

