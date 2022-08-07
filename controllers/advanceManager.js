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

          const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD hh:mm:ss");
          const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD hh:mm:ss");

          const insertion_query_1 = "SELECT Activity_Assignment_Id FROM advance WHERE Advance_Id = " + advance_id;
          this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
            if (err1) {
              throw err1
            } else {
              const insertion_query = "REPLACE INTO ADVANCE (Advance_Id, Activity_Assignment_Id, Advance_Comments, Initial_Time, Final_Time) VALUES (" + advance_id + ", " + result1[0].Activity_Assignment_Id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
          this.db_connection.query(insertion_query, (err, result, fields) => {
            if (err) {
              throw err
            } else {
            res.send('Advance Successfully Updated!');
            }
          });
            }
          });
    }

    getAdvancesByUser(advance_info, res) {
      const query_string = "SELECT * FROM advance WHERE Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM Activity_Assignment WHERE User_Id = " + advance_info.user_id + ")";
        this.db_connection.query(query_string, function (err, result, fields) {
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
        const user_id = advance_info.user_id;
        const activity_id = advance_info.activity_id;
        const advance_comments = advance_info.comments;
        const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD hh:mm:ss");
        const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD hh:mm:ss");
        const insertion_query_1 = "SELECT Activity_Assignment_id FROM Activity_Assignment WHERE User_Id = " + user_id + " AND Activity_Id = " + activity_id;
        this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
          if (err1) {
            throw err1
          } else {
            const insertion_query_2 = "INSERT INTO ADVANCE (Activity_Assignment_Id, Advance_Comments,  Initial_Time, Final_Time) VALUES (" + result1[0].Activity_Assignment_id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
            this.db_connection.query(insertion_query_2, function (err, result, fields) {
                if (err) throw err
                res.send('1 Advance Inserted!');
              });
          }
        });
    }

  }
  
  module.exports = AdvancesManager;