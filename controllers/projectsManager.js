class ProjectsManager {

  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
  }

  editProject(project_info, res) {
    const project_id = project_info.Project_Id;
    const project_initial_date = project_info.Initial_Date;
    const project_final_date = project_info.Final_Date;
    const project_name = project_info.Project_Name;
    const project_status = project_info.Status_Id;

    //aquí FALLARÁ
    const query_text = "UPDATE project SET Project_Name = '" + project_name + "', Initial_Date = '" + this.moment(new Date(project_initial_date)).format("YYYY-MM-DD HH:mm:ss") + "', Final_Date = '" + this.moment(new Date(project_final_date)).format("YYYY-MM-DD HH:mm:ss") + "', Status_Id = '" + project_status + "' WHERE Project_Id = " + project_id;

    this.db_connection.query(query_text, (err, result, fields) => {
      if (err) {
        console.log(err);
        res.send({err});
      } else {
        res.send(result);
      }
    });

  }

  disableProject(body, res) { // validaciones
    console.log(body);
    this.db_connection.query("UPDATE project SET Status_Id = 'A' WHERE Project_Id = " + body.project_id, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }

  getProjectByID(project_info, res, stored_project) {

    return new Promise ((resolve, reject) => {
      this.db_connection.query("SELECT * FROM project WHERE Project_Id = " + project_info.project_id, (err, result, fields) => {
        if (err) {
          return reject(err);
        } else {
          resolve({Project_Id : result[0].Project_Id,
            Project_Name : result[0].Project_Name,
            Initial_Date : result[0].Initial_Date,
            Final_Date : result[0].Final_Date, 
            Status_Id : result[0].Status_Id,
            Id_From_Front: project_info.project_id});
        }
      });
    });
  }
  idontknowfunction() {
    console.log(0);
  }
  getAllProjects(res) { // validaciones
    this.db_connection.query("SELECT * FROM project WHERE Status_Id != 'A' ", (err, result, fields) => {
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
    const project_initial_date = project_info.initial_date;
    const project_final_date = project_info.final_date;
    const project_status = project_info.project_status;

    //validators
    const project_name_length = project_name.length;

    if(project_name_length > 0 && project_name_length < 51) {
      const initial_date = this.moment(new Date(project_initial_date)).format("YYYY-MM-DD HH:mm:ss");
      const final_date = this.moment(new Date(project_final_date)).format("YYYY-MM-DD HH:mm:ss");
      
    //Insertion in DB
      const insertion_query = "INSERT INTO project ( Project_Name, Initial_Date, Final_Date, Status_Id) VALUES ('" + project_name + "', '" + initial_date + "', '" + final_date + "', '" + project_status + "')";
      this.db_connection.query(insertion_query, (err, result, fields) => {
        if (err) {
          res.send(err);
        res.send('mal'); 
        } else {
          console.log("salio bien");
          res.send('good'); 
        }
      });
      }
    }
}

module.exports = ProjectsManager;