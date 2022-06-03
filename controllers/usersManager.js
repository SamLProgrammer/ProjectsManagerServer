const { response } = require("express");

class UsersManager {
  constructor(in_db_connection) {
    this.db_connection = in_db_connection;
    this.confirmDBConnection(); // Test DB Connection, removable method
  }


  confirmDBConnection() {
    this.db_connection.query(
      "SELECT * FROM user",
      function (err, result, fields) {
        if (err) throw err;
        console.log("Users Manager Showing Users: " + result);
      }
    );
  }
}

module.exports = UsersManager;
