class ProjectsManager {

  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
    this.project_holder;
  }

  editProject(project_info, res) {

    const project_id = project_info.project_id;
    const project_initial_date = project_info.initial_date;
    const project_final_date = project_info.final_date;
    const project_name = project_info.project_name;
    const project_status = project_info.status_id;

    //aquí FALLARÁ
    const query_text = "UPDATE project SET Project_Name = '" + project_name + "', Initial_Date = '" + project_initial_date + "', Final_Date = '" + project_final_date + "', Status_Id = '" + project_status + "' WHERE Project_Id = " + project_id;

    this.db_connection.query(query_text, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });

  }

  disableProject(body, res) { // validaciones
    this.db_connection.query("UPDATE project SET Status_Id = 'A' WHERE Project_Id = " + body.project_id, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }

  getStoredProject(res) {
    res.send({proejct: this.storedProject})
  }

  getProjectByID(project_info, res) {

    this.db_connection.query("SELECT * FROM project WHERE Project_Id = " + project_info.project_id, (err, result, fields) => {
      if (err) {
        res.send("mal");
      } else {
        this.project_holder = result[0];
        res.send({ok: 'ok'});
      }
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