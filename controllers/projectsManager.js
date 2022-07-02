class ProjectsManager {

  constructor(in_db_connection) {
    this.db_connection = in_db_connection;
  }
//UPDATE table1 SET col_a='new' WHERE key_col='key'
  disableProject(body, res) {
    this.db_connection.query("UPDATE project SET Status_Id = 'A' WHERE Project_Id = " + body.project_id, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }

  getAllProjects(res) {
    this.db_connection.query("SELECT * FROM `project` WHERE Status_Id != 'A' ", function (err, result, fields) {
      if (err) {
        res.send("mal");
      } else {
        res.send(result);
      }
    });
  }
//"INSERT INTO USER (User_Name, User_Last_Name, Document_Id, Birth_Date, Salary, Weekly_Hours, User_Email, Phone_Number, User_Password, Login_User, Status_Id, Boss_Id) VALUES ('ALEX', 'daza ', 4, STR_TO_DATE('12-05-2022', '%d-%m-%Y'), 12333, 22, 'mati2567@gmail.com', '3121222224', 'Linda1234', 'r.mati2567@gmail.com.h', 1, )"
  insertProject(project_info, res) {

    //getting request body values
    const project_name = project_info.project_name;
    const initial_date = project_info.initial_date;
    const final_date = project_info.final_date;
    const project_status = project_info.project_status;

    //validators
    const project_name_length = project_name.length;
    const regex_date_validator = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

    //conditional to validate data entries
    if(regex_date_validator.test(initial_date) && regex_date_validator.test(final_date)
       && project_name_length > 0 && project_name_length < 51) {

    //fixing chars replacements on date for "/" before inserting to DB
      const splited_initial_date = initial_date.replace(/\//g,'-');
      const splited_final_date = final_date.replace(/\//g,'-');

      // VALIDAR ESTADO
      
    //Insertion in DB
      const insertion_query = "INSERT INTO PROJECT ( Project_Name, Initial_Date, Final_Date, Status_Id) VALUES ('" + project_name + "', STR_TO_DATE('" + splited_initial_date + "', '%d-%m-%Y'), STR_TO_DATE('" + splited_final_date + "', '%d-%m-%Y'), '" + project_status + "')";
      this.db_connection.query(insertion_query, function (err, result, fields) {
        if (err) {
        res.send('mal'); 
        } else {
          res.send('good'); 
        }
      });
      }
    }
}

module.exports = ProjectsManager;