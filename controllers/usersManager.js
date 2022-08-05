
class UsersManager {
  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
  }

  login(body, res) {  // validaciones
    this.db_connection.query("SELECT * FROM user WHERE Login_User = '" + body.login_user + "' AND User_Password = '" + body.user_password + "'", function (err, result, fields) {
      if (err) {
        res.status(500).send(err);
      } else {
        if(result.length > 0){
          res.status(200).send({
            'id' : result[0].User_Id,
            'boss_id' : result[0].Boss_Id,
            'user_name': result[0].User_Name,
            'user_lastname' : result[0].User_Last_Name,
          })          
        }else {
          res.status(400).send('Usuario no existe');
        }
      }
    });
  }

  getAllUsers(res) {  // validaciones
    this.db_connection.query("SELECT * FROM user WHERE Status_Id = 1 AND Boss_Id != NULL", function (err, result, fields) {
      if (err) {
        res.send("mal");
      } else {
        res.send(result);
      }
    });
  }

  desactivateUser(user_id, res){  // validaciones
    this.db_connection.query("UPDATE user SET Status_Id = 0 WHERE User_Id = " + user_id, function (err, result, fields) {
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
          if(!user_info.hasOwnProperty('user_status') || !/^[01]$/.test(user_info.user_status)) {
            invalid_field += ' Error on Status'
          }
          break;
          case 'boss_id':
            if(user_info.hasOwnProperty('boss_id') && !/^[0-9]*$/.test(user_info.boss_id)) {
              invalid_field += ' Error on boss'
            }
          break;
        default:
          invalid_field += 'Invalid Request';
          break;
      }
    }
    if (invalid_field == '') {
      const boss_id = (user_info.boss_id.length == 0) ? ")": ", " + user_info.boss_id + ")";
      const boss_id_index = (user_info.boss_id.length == 0) ? ")": ", Boss_Id)";
      let login_user = 'r.' + user_info.user_email + '.h';
      const document_insertion_query = "INSERT INTO identity_document (Type_Id, Document_word) VALUES ('" + user_info.identity_document_type + "', '" + user_info.identity_document_word + "')";
      const birth_date = this.moment(new Date(user_info.birth_date)).format("YYYY-MM-DD hh:mm:ss");
      this.db_connection.query(document_insertion_query, (err0, result0, fields0) => {
        if (err0) { throw err0 }
        else {
          const user_insertion_query = "INSERT INTO USER (User_Name, User_Last_Name, Document_Id, Birth_Date, Salary, Weekly_Hours, User_Email, Phone_Number, User_Password, Login_User, Status_Id" + boss_id_index + "VALUES ('" + user_info.user_name + "', '" + user_info.user_last_name + "', " + result0.insertId + ", '" + birth_date + "', " + user_info.salary + ", " + weekly_hours_to_insert + ", '" + user_info.user_email + "', '" + user_info.phone_number + "', '" + user_info.user_password + "', '" + login_user + "', " + user_info.user_status + boss_id;
          this.db_connection.query(user_insertion_query, (err1, result1, fields1) => {
            if (err1) throw err1
            res.send({ respo: invalid_field })
          });
        }
      });
    } else {
      res.send(invalid_field);
    }
  }
}


module.exports = UsersManager;
