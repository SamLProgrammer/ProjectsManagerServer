class ActivitiesManager {

    constructor(in_db_connection) {
      this.db_connection = in_db_connection;
    }

    getActivityByID(activity_id, res) {
      this.db_connection.query("SELECT * FROM ACTIVITY WHERE Activity_Id = " + activity_id, function (err, result, fields) {
        if (err) throw err
        res.send(result[0]);
      });
    }

    editActivity(activity_info, res) {
      const activity_id = activity_info.Activity_Id;
      const activity_name = activity_info.Activity_Name;
      const activity_description = activity_info.Activity_Description;
      const estimated_hours = activity_info.Estimated_Hours;
      const priority_id = activity_info.Priority_Id;
      const status_id = activity_info.Status_Id;

      this.db_connection.query("SELECT * FROM ACTIVITY WHERE Activity_Id = " + activity_id, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          const query_text = "UPDATE ACTIVITY SET Activity_Name = '" + activity_name + "', Activity_Description = '" + activity_description + "', Estimated_Hours = " + estimated_hours + ", Priority_Id = '" + priority_id + "', Status_Id = '" + status_id + "' WHERE Activity_Id = " + activity_id;
          this.db_connection.query(query_text, (err, result, fields) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result[0]);
            }
          });
        }
      });
    }

    getAllActivityUser(req, res) {
      this.db_connection.query(
        "SELECT * FROM activity WHERE Activity_Id IN (SELECT `Activity_Id` FROM activity_assignment WHERE User_Id = " +
          req.user_id +
          ")",
        function (err, result, fields) {
          console.log(req.user_id);
          if (err) {
            console.log(err);
            res.status(500).send("mal");
          } else {
            if (result.length > 0) {
              res.status(200).send(result);
            }
            // res.send(result);
          }
        }
      );
    }
  

    assignActivityToUser(act_info, res) { // validaciones
      const activity_id = act_info.activity_id;
      const user_id = act_info.user_id;
      const insertion_query = "INSERT INTO ACTIVITY_ASSIGNMENT (Activity_Id, User_Id) VALUES (" + activity_id + ", " + user_id + ")"
      this.db_connection.query(insertion_query, function (err, result, fields) {
        if (err) throw err
        res.send("Activity Assigned!")
      });
    }

    deleteActivity(act_info, res) { // validaciones
      const activity_id = act_info.activity_id;
      const insertion_query = "DELETE FROM ACTIVITY WHERE Activity_Id = " + activity_id;
      this.db_connection.query(insertion_query, function (err, result, fields) {
        if (err) throw err
        res.send("Deleted Activity!")
      });
    }
  
    insertActivity(activity_info, res) { // validaciones

        const activity_name = activity_info.activity_name;
        const project_Id = activity_info.project_id;
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
      
      getAllActivity(req, res) { // validaciones
        this.db_connection.query(
          "SELECT * FROM activity WHERE Project_Id = " + req.project_id,
          function (err, result, fields) {
            if (err) {
              res.status(500).send("mal");
            } else {
              if (result.length > 0) {
                res.status(200).send(result)
              }
              // res.send(result);
            }
          }
        );
      }
  }
  
  module.exports = ActivitiesManager;