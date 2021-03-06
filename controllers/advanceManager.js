class AdvancesManager {

    constructor(in_db_connection, moment) {
      this.db_connection = in_db_connection;
      this.moment = moment;
    }

    getAdvance(advance_info, res) {
      this.db_connection.query("SELECT * FROM ADVANCE WHERE Advance_Id = " + advance_info.advance_id, function (err, result, fields) {
        if (err) throw err
        res.send(result[0]);
      });
    }

    editAdvance(advance_info, res) {
      //validate not previous date from today for the advance edition
      const advance_id = advance_info.advance_id;
      const advance_comments = advance_info.comments;

      this.db_connection.query("SELECT * FROM ADVANCE WHERE Advance_Id = " + advance_id, (err, result, fields) => {
        if (err) { throw err
        } else {
          const activity_id = result[0].Activity_Id;
          const user_id = result[0].User_Id;

          const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD hh:mm:ss");
          const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD hh:mm:ss");

          const insertion_query = "REPLACE INTO ADVANCE (Advance_Id, Activity_Id, User_Id, Advance_Comments, Initial_Time, Final_Time) VALUES (" + advance_id +", " + activity_id + ", " + user_id + ", '" + advance_comments +"', '" + initial_hour + "', '" + final_hour + "')";
          this.db_connection.query(insertion_query, function (err, result, fields) {
            if (err) throw err
            res.send(result);
          });
        }
      });
    }

    getAdvancesByUser(advance_info, res) {
        this.db_connection.query("SELECT * FROM ADVANCE WHERE User_Id = " + advance_info.user_id, function (err, result, fields) {
            if (err) throw err
            res.send(result);
          });
    }

    getAdvanceByActivity(advance_info, res) {
      this.db_connection.query("SELECT * FROM ADVANCE WHERE Activity_Id = " + advance_info.activity_id, function (err, result, fields) {
        if (err) throw err
        res.send(result);
      });
    }

    createAdvance(advance_info, res) {

        const advance_comments = advance_info.comments;
        const activity_id = advance_info.activity_id;
        const user_id = advance_info.user_id;
        const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD hh:mm:ss");
        const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD hh:mm:ss");
        const insertion_query = "INSERT INTO ADVANCE (Activity_Id, User_id, Advance_Comments,  Initial_Time, Final_Time) VALUES (" + activity_id + ", " + user_id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
        this.db_connection.query(insertion_query, function (err, result, fields) {
            if (err) throw err
            res.send('1 Advance Inserted!');
          });
    }

  }
  
  module.exports = AdvancesManager;