class ProjectsManager {

  constructor(in_db_connection) {
    this.db_connection = in_db_connection;
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