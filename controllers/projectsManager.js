class ProjectsManager {

  constructor(in_db_connection) {
    this.db_connection = in_db_connection;
  }

  editProject(project_info, res) {

    const project_id = project_info.project_id;
    const project_initial_date = project_info.initial_date;
    const project_final_date = project_info.final_date;
    const project_name = project_info.project_name;
    const project_status = project_info.status_id;

    const initial_date = project_initial_date.replace(/\//g,'-');
    const final_date = project_final_date.replace(/\//g,'-');

    const query_text = "UPDATE PROJECT SET Project_Name = '" + project_name + "', Initial_Date = STR_TO_DATE('" + initial_date + "', '%d-%m-%Y'), Final_Date = STR_TO_DATE('" + final_date + "', '%d-%m-%Y'), Status_Id = '" + project_status + "' WHERE Project_Id = " + project_id;

    this.db_connection.query(query_text, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });

  }

  disableProject(body, res) { // validaciones
    this.db_connection.query("UPDATE project SET Status_Id = 'A' WHERE Project_Id = " + body.project_id, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }

  getProjectByID(project_info, res) {

    this.db_connection.query("SELECT * FROM PROJECT WHERE Project_Id = " + project_info.project_id, function (err, result, fields) {
      if (err) {
        res.send("mal");
      } else {
        res.send(result);
      }
    });
  }

  getAllProjects(res) { // validaciones
    this.db_connection.query("SELECT * FROM `project` WHERE Status_Id != 'A' ", function (err, result, fields) {
      if (err) {
        res.send("mal");
      } else {
        res.send(result);
      }
    });
  }

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