
class UsersManager {
  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
  }

  statsPerUser(body, res) {
    const initial_time = body.initial_time;
    const date = new Date();
    const final_time = (date < Date.parse(body.final_time)) ? date.toISOString() : body.final_time;
    const user_id = body.user_id;
    const query_string = "SELECT * FROM advance WHERE Initial_Time > '" + initial_time + "' AND Final_Time < '" + final_time + "' AND Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + user_id + ")";
    const future_query_string = "SELECT * FROM advance WHERE Initial_Time > '" + final_time + "' AND Final_Time < '" + body.final_time + "' AND Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + user_id + ")";

    //
    const a = this.moment(initial_time).subtract(1, 'days');
    const b = this.moment(final_time);
    const c = b.diff(a, 'days');
    const initial_weeknd = (6 - a.day() > c) ? 0 : 1;
    const weekends_amount = (parseInt((c - (6 - a.day())) / 7) + initial_weeknd) * 2;
    const working_hours = (c) * 8;
    //
    let worked_hours = 0;
    this.db_connection.query(query_string, (err, result, fields) => {
      if (err) {
        res.send("mal");
      } else {
        result.forEach(element => {
          let diff = Math.abs(element.Final_Time - element.Initial_Time);
          worked_hours += diff / 3600000;
        });
        this.db_connection.query(future_query_string, (err1, result1, fields1) => {
          if (err1) {
            res.send("mal");
          } else {
            let pending_hours = 0;
            result1.forEach(element => {
              let diff = Math.abs(element.Final_Time - element.Initial_Time);
              pending_hours += diff / 3600000;
            });
            console.log(working_hours);
            res.send({ worked_hours, not_worked_hours: working_hours - worked_hours, pending_hours });
          }
        });
      }
    });
  }

  login(login_info, res) {
    console.log(login_info);
    let keysList = ['login_user', 'user_password'];
    let valid_json = true;
    let BreakException = {};
    try {
      keysList.forEach((key) => {
        if (!login_info.hasOwnProperty(key) || login_info[key].length == 0) {
          valid_json = false;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
  if(valid_json) {
    this.db_connection.query("SELECT * FROM user WHERE Login_User = '" + login_info.login_user + "' AND User_Password = '" + login_info.user_password + "'", (err, result, fields) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result.length > 0) {
          res.status(200).send({ user_info : {
            'id': result[0].User_Id,
            'boss_id': result[0].Boss_Id,
            'user_name': result[0].User_Name,
            'user_lastname': result[0].User_Last_Name,
          }})
        } else {
          console.log('user doesnt exist');
          res.status(400).send({err : 'Wrong User or Password'});
        }
      }
    });
  } else {
  res.send({ err: 'invalid_json_request' });
}
  }

getAllUsers(res) {  // validaciones
  this.db_connection.query("SELECT * FROM user WHERE Status_Id = 1 AND Boss_Id IS NOT NULL", (err, result, fields) => {
    if (err) {
      res.send("mal");
    } else {
      res.send(result);
    }
  });
}

desactivateUser(user_id, res){  // validaciones
  this.db_connection.query("UPDATE user SET Status_Id = 0 WHERE User_Id = " + user_id, (err, result, fields) => {
    if (err) {
      res.send("mal");
    } else {
      res.send(result);
    }
  });
}

insertUser(user_info, res) {  // validaciones
  let invalid_field = '';
  let weekly_hours_to_insert;
  for (var key in user_info) {
    switch (key) {
      case 'user_name':
        if (!user_info.hasOwnProperty('user_name') || !/^[\w'\-][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*\-(){}|~<>;:[\]]{1,60}$/.test(user_info.user_name)) {
          invalid_field += 'Error on user_name';
        }
        break;
      case 'user_last_name':
        if (!user_info.hasOwnProperty('user_last_name') || !/^[\w'\-][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*\-(){}|~<>;:[\]]{1,60}$/.test(user_info.user_last_name)) {
          invalid_field += ' Error on last_name';
        }
        break;
      case 'identity_document_type':
        if (!user_info.hasOwnProperty('identity_document_type') || user_info.identity_document_type.length != 1 || !/^[PTNC]{1}$/.test(user_info.identity_document_type)) {
          invalid_field += ' Error on Doc Type';
        }
        break;
      case 'identity_document_word':
        if (!user_info.hasOwnProperty('identity_document_word') || user_info.identity_document_word.length < 5 || !/^[a-z0-9]+$/i.test(user_info.identity_document_word)) {
          invalid_field += ' Error on Doc Word';
        }
        break;
      case 'birth_date':
        if (!user_info.hasOwnProperty('birth_date')) {
          invalid_field += ' Error on Birthdate';
        }
        break;
      case 'salary':
        if (user_info.salary != null && !/^(?!0+(?:\.0+)?$)[0-9]+(?:\.[0-9]+)?$/.test(user_info.salary)) {
          invalid_field += ' Error on Salary';
        }
        break;
      case 'weekly_hours':
        if ((!user_info.hasOwnProperty('weekly_hours')) || !/^([1-9]|[1-5][0-9]|60|all){0,1}$/.test(user_info.weekly_hours)) {
          invalid_field += ' Error on Weekly Hours'
        } else {
          weekly_hours_to_insert = (user_info.weekly_hours.length == 0) ? 0 : user_info.weekly_hours;
        }
        break;
      case 'user_email':
        if (!user_info.hasOwnProperty('user_email') || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_info.user_email)) {
          invalid_field += ' Error on Email'
        }
        break;
      case 'phone_number':
        if (!user_info.hasOwnProperty('phone_number') || !/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(user_info.phone_number)) {
          invalid_field += ' Error on Phone Number'
        }
        break;
      case 'user_password':
        if (!user_info.hasOwnProperty('user_password') || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(user_info.user_password)) {
          invalid_field += ' Error on Password'
        }
        break;
      case 'user_status':
        if (!user_info.hasOwnProperty('user_status') || !/^[01]$/.test(user_info.user_status)) {
          invalid_field += ' Error on Status'
        }
        break;
      case 'boss_id':
        if (user_info.hasOwnProperty('boss_id') && !/^[0-9]*$/.test(user_info.boss_id)) {
          invalid_field += ' Error on boss'
        }
        break;
      default:
        invalid_field += 'Invalid Request';
        break;
    }
  }
  if (invalid_field == '') {
    const boss_id = (user_info.boss_id.length == 0) ? ")" : ", " + user_info.boss_id + ")";
    const boss_id_index = (user_info.boss_id.length == 0) ? ")" : ", Boss_Id)";
    let login_user = 'r.' + user_info.user_email + '.h';
    const document_insertion_query = "INSERT INTO identity_document (Type_Id, Document_word) VALUES ('" + user_info.identity_document_type + "', '" + user_info.identity_document_word + "')";
    const birth_date = this.moment(new Date(user_info.birth_date)).format("YYYY-MM-DD HH:mm:ss");
    this.db_connection.query(document_insertion_query, (err0, result0, fields0) => {
      if (err0) { res.send(err0) }
      else {
        const user_insertion_query = "INSERT INTO user (User_Name, User_Last_Name, Document_Id, Birth_Date, Salary, Weekly_Hours, User_Email, Phone_Number, User_Password, Login_User, Status_Id" + boss_id_index + "VALUES ('" + user_info.user_name + "', '" + user_info.user_last_name + "', " + result0.insertId + ", '" + birth_date + "', " + user_info.salary + ", " + weekly_hours_to_insert + ", '" + user_info.user_email + "', '" + user_info.phone_number + "', '" + user_info.user_password + "', '" + login_user + "', " + user_info.user_status + boss_id;
        this.db_connection.query(user_insertion_query, (err1, result1, fields1) => {
          if (err1) {
            this.db_connection.query("DELETE FROM identity_document WHERE Type_Id = '" + user_info.identity_document_type + "' AND Document_word = '" + user_info.identity_document_word + "'", (err1, result1, fields1) => {
            });
            res.send({ err: err1 });
          } else {
            res.send({ respo: invalid_field })
          }
        });
      }
    });
  } else {
    res.send({ err: invalid_field });
  }
}
}


module.exports = UsersManager;
