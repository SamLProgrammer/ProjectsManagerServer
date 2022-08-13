class ActivitiesManager {

  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
  }

  getActivityByID(activity_id, res) {
    return new Promise((resolve, reject) => {
      this.db_connection.query("SELECT * FROM activity WHERE Activity_Id = " + activity_id, (err, result, fields) => {
        if (err) { 
          return reject(err);
        } else {
          resolve(result[0]);
        }
      });

    });
  }

  editActivity(activity_info, res) {
    const activity_id = activity_info.Activity_Id;
    const activity_name = activity_info.Activity_Name;
    const activity_description = activity_info.Activity_Description;
    const estimated_hours = activity_info.Estimated_Hours;
    const priority_id = activity_info.Priority_Id;
    const status_id = activity_info.Status_Id;

    const query_text = "UPDATE activity SET Activity_Name = '" + activity_name + "', Activity_Description = '" + activity_description + "', Estimated_Hours = " + estimated_hours + ", Priority_Id = '" + priority_id + "', Status_Id = '" + status_id + "' WHERE Activity_Id = " + activity_id;
    this.db_connection.query(query_text, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result[0]);
      }
    });
  }

  getAllActivityUser(req, res) {
    this.db_connection.query(
      "SELECT * FROM activity WHERE Activity_Id IN (SELECT Activity_Id FROM activity_assignment WHERE User_Id = " + req.user_id + ")", (err, result, fields) => {
        if (err) {
          res.send(err);
          res.status(500).send("mal");
        } else {
          if (result.length > 0) {
            res.status(200).send(result);
          }
        }
      }
    );
  }


  assignActivityToUser(act_info, res) { // validaciones
    const activity_id = act_info.activity_id;
    const user_id = act_info.user_id;
    let insertion_query_1 = "INSERT INTO activity_assignment (";
    let insertion_query_2 = " VALUES (";
    let limit = Object.keys(act_info).length -1;
    console.log('limit: ' + limit);
    let counter = 0;
    for (var key in act_info) {
      switch (key) {
        case 'user_id':
          if (/^[0-9]+(,[0-9]+)?$/.test(user_id)) {
              insertion_query_1 += (counter == limit) ? "User_Id)" : "User_Id, ";
              insertion_query_2 += (counter == limit) ? user_id + ")" : user_id + ", ";
            }
          break;
        case 'activity_id':
          if (/^[0-9]+(,[0-9]+)?$/.test(activity_id)) {
            insertion_query_1 += (counter == limit) ? "Activity_Id)" : "Activity_Id, ";
            insertion_query_2 += (counter == limit) ? activity_id + ") " : activity_id + ", ";
          }
          break;
        case 'initial_time':
          if (/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(act_info.initial_time)) {
            const time = this.moment(new Date(act_info.initial_time)).format("YYYY-MM-DD HH:mm:ss");
            insertion_query_1 += (counter == limit) ? "Initial_Time)" : "Initial_Time, ";
            insertion_query_2 += (counter == limit) ? "'" + time + "')" : "'" + time + "', ";
          }
          break;
        case 'final_time':
          if (/^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(act_info.final_time)) {
            const time = this.moment(new Date(act_info.final_time)).format("YYYY-MM-DD HH:mm:ss");
            insertion_query_1 += (counter == limit) ? 'Final_Time)' : 'Final_Time, ';
            insertion_query_2 += (counter == limit) ? "'" + time + "')" : "'" + time + "', ";
          }
          break;
      }
      counter++;
    }
    const insertion_query = insertion_query_1 + insertion_query_2;
    console.log(insertion_query)
    this.db_connection.query(insertion_query, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Activity Successfully Assigned');
      }
    });
  }

  deleteActivity(act_info, res) { // validaciones
    const activity_id = act_info.activity_id;
    const insertion_query = "DELETE FROM activity WHERE Activity_Id = " + activity_id;
    this.db_connection.query(insertion_query, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted Activity!")
      }
    });
  }

  insertActivity(activity_info, res) { // validaciones

    const activity_name = activity_info.activity_name;
    const project_Id = activity_info.project_id;
    const estimated_hours = activity_info.estimated_hours;
    const priority = activity_info.priority;
    const status = activity_info.status;

    const insertion_query = "INSERT INTO activity (Project_Id, Activity_Name, Estimated_Hours, Priority_Id, Status_Id) VALUES (" + project_Id + ", '" + activity_name + "', " + estimated_hours + ", '" + priority + "', '" + status + "')";
    console.log(insertion_query);
    this.db_connection.query(insertion_query, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send('1 Inserted Activity!');
      }
    });
  }

  getAllActivity(req, res) { // validaciones
    this.db_connection.query(
      "SELECT * FROM activity a, activity_assignment b WHERE  a.Activity_Id = b.Activity_id AND a.Project_Id = " + req.project_id, (err, result, fields) => {
        if (err) {
          res.status(500).send("mal");
        } else {
            this.db_connection.query("SELECT * FROM activity WHERE Project_Id = " + req.project_id + " AND Activity_Id NOT IN (SELECT Activity_Id FROM activity_assignment)", (err0, result0, fields0) => {
              if (err0) {
                res.send(err0);
              } else {
                console.log(result.concat(result0));
                res.status(200).send(result.concat(result0));
              }
            });
          }
          // res.send(result);
        }
    );
  }
}

module.exports = ActivitiesManager;