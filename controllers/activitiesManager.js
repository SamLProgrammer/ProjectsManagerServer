class ActivitiesManager {

    constructor(in_db_connection) {
      this.db_connection = in_db_connection;
    }
  
    insertActivity(activity_info,res) {

        const project_Id = activity_info.project_id;
        const activity_name = activity_info.activity_name;
        const estimated_hours = activity_info.estimated_hours;
        const priority = activity_info.priority;
        const status = activity_info.status;

        const insertion_query = "INSERT INTO ACTIVITY (Project_Id, Activity_Name, Estimated_Hours, Priority_Id, Status_Id) VALUES (" + project_Id + ", '" + activity_name + "', " + estimated_hours + ", '" + priority + "', '" + status + "')";
        console.log(insertion_query);
        this.db_connection.query(insertion_query, function (err, result, fields) {
          if (err) throw err
          res.send('1 Inserted Activity!');
        });
      }
      
      getAllActivity(req, res) {
        this.db_connection.query(
          "SELECT * FROM activity WHERE Project_Id = " + req,
          function (err, result, fields) {
            if (err) {
              res.send("mal");
            } else {
              res.send(result);
            }
          }
        );
      }
  }
  
  module.exports = ActivitiesManager;