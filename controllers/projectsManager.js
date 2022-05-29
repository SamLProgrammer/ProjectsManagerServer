class ProjectsManager {
  constructor(in_db_connection) {
    this.db_connection = in_db_connection;
    this.confirmDBConnection()
  }

  confirmDBConnection() {
      this.db_connection.query("SELECT * FROM project", function (err, result, fields) {
        if (err) throw err;
        console.log("Projects Manager Showing Projects:" + result);
      });
  }
}

module.exports = ProjectsManager;