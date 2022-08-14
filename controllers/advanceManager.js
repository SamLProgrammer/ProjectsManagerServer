class AdvancesManager {

  constructor(in_db_connection, moment) {
    this.db_connection = in_db_connection;
    this.moment = moment;
  }

  getAdvance(advance_info, res) {
    this.db_connection.query("SELECT * FROM advance WHERE Advance_Id = " + advance_info.advance_id, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result[0]);
      }
    });
  }

  async firstAdvanceValidation(advance_info, res) {
    const user_id = advance_info.user_id;
    const activity_id = advance_info.activity_id;
    const initial_time = advance_info.initial_hour
    const final_time = advance_info.final_hour
    const advance_comments = advance_info.comments;
    const parsed_initial_time = await this.myGMTParseTime(initial_time);
    const parsed_final_time = await this.myGMTParseTime(final_time);
    res.send({parsed_initial_time, parsed_final_time});
  }

  myDateComparator(myDate1, myDate2) {
    return new Promise((resolve, reject) => {
      if(myDate2.year == myDate1) {
        if(myDate2.month == myDate1.month) {
          const myDate1Seconds = myDate1.day*24*3600 + myDate1.hour*3600 + myDate1.minute*60 + myDate1.second;
          const myDate2Seconds = myDate2.day*24*3600 + myDate2.hour*3600 + myDate2.minute*60 + myDate2.second;
          if(myDate1Seconds == myDate2Seconds) {
            resolve(0)
          } else if (myDate2Seconds > myDate1Seconds) {
            resolve(1)
          } else {
            resolve(-1);
          }
        } else if(myDate2.month > myDate1.month) {
          resolve(1);
        } else {
          resolve(-1);
        }
      } else if(myDate2.year > myDate1) {
        resolve(1);
      } else {
        resolve(-1);
      }
    });
  }

  myGMTParseTime(time) {
    return new Promise ((resolve, reject) => {
    const generalArray = time.split(" ");
    const timeArray = generalArray[4].split(':');

    let second = timeArray[2];
    let minute = timeArray[1];
    let hour = timeArray[0];

    let year = generalArray[3];
    let day = generalArray[2];
    let month;

    switch (generalArray[1]) {
      case 'Jan': {
        month = '01'
      }
        break;
      case 'Feb': {
        month = '02'
      }
        break;
      case 'Mar': {
        month = '03'
      }
        break;
      case 'Apr': {
        month = '04'
      }
        break;
      case 'May': {
        month = '05'
      }
        break;
      case 'Jun': {
        month = '06'
      }
        break;
      case 'Jul': {
        month = '07'
      }
        break;

      case 'Aug': {
        month = '08'
      }
        break;
      case 'Sep': {
        month = '09'
      }
        break;
      case 'Oct': {
        month = '10'
      }
        break;
      case 'Nov': {
        month = '11'
      }
        break;
      case 'Dic': {
        month = '12'
      }
        break;
    }
    resolve({second, minute, hour, day, month, year});
    });
  }

  dynamicQuery(query_string) {
    return new Promise((resolve, reject) => {
      this.db_connection.query(query_string, (err, result, fields) => {
        if (err) {
          return reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  validateAndCreateAdvance(advance_info, res) {
    const user_id = advance_info.user_id;
    const activity_id = advance_info.activity_id;
    const advance_comments = advance_info.comments;
    const initial_time = advance_info.initial_hour;
    const final_time = advance_info.final_hour;

    let flag = false;
    const insertion_query_0 = "SELECT * FROM advance WHERE Activity_Assignment_Id in (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + user_id + ")";
    this.db_connection.query(insertion_query_0, (err0, result0, field0) => {
      if (err0) {
        res.send(err0);
      } else {
        result0.forEach(element => {
          const eInitial_Time = this.moment(new Date(element.Initial_Time));
          const eFinal_Time = this.moment(new Date(element.Final_Time));
          const aInitial_Time = this.moment(new Date(initial_time));
          const aFinal_Time = this.moment(new Date(final_time));
          console.log(element.Initial_Time + ' : ' + element.Final_Time);
          if (!flag) {
            if ((aInitial_Time >= eInitial_Time && aInitial_Time <= eFinal_Time) ||
              (aFinal_Time >= eInitial_Time && aFinal_Time <= eFinal_Time) ||
              (eInitial_Time >= aInitial_Time && eInitial_Time <= aFinal_Time) ||
              (eFinal_Time >= aInitial_Time && eFinal_Time <= aFinal_Time)) {
              flag = true;
            }
          }
        });
        if (flag) {
          res.send({ overlapped: true });
        }
        else {
          const insertion_query_1 = "SELECT * FROM activity_assignment WHERE Activity_Id = " + activity_id + " AND User_Id = " + user_id;
          this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
            if (err1) {
              res.send(err1);
            } else {
              const insertion_query_2 = "SELECT * FROM activity WHERE Activity_Id IN (SELECT Activity_Id FROM activity_assignment WHERE Activity_Assignment_Id = " + result1[0].Activity_Assignment_Id + ")";
              this.db_connection.query(insertion_query_2, (err2, result2, fields2) => {
                if (err2) {
                  res.send(err2)
                } else {
                  const insertion_query_3 = "SELECT * FROM advance WHERE Initial_Time > '" + this.moment(new Date(result1[0].Initial_Time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Final_Time < '" + this.moment(new Date(result1[0].Final_Time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Activity_Assignment_Id = " + result1[0].Activity_Assignment_Id;
                  this.db_connection.query(insertion_query_3, (err3, result3, fields3) => {
                    if (err3) {
                      res.send(err3)
                    } else {
                      let invested_hours_on_activity = 0;
                      result3.forEach(element => {
                        let diff = Math.abs(element.Final_Time - element.Initial_Time);
                        invested_hours_on_activity += diff / 3600000;
                      });
                      const remaining_hours_for_activity = result2[0].Estimated_Hours - invested_hours_on_activity;
                      const a = this.moment(new Date());
                      const b = this.moment(result1[0].Final_Time);
                      const c = b.diff(a, 'days');
                      console.log(c);
                      const initial_weeknd = (6 - a.day() > c) ? 0 : 1;
                      let weekends_amount = (parseInt((c - (6 - a.day())) / 7) + initial_weeknd) * 2;
                      weekends_amount = (b.day() == 5) ? weekends_amount - 1 : weekends_amount;
                      const working_hours = (c - weekends_amount) * 8;

                      const date = (new Date()).toISOString();
                      const insertion_query_4 = "SELECT * FROM advance WHERE Initial_Time > '" + this.moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss") + "' AND Final_Time < '" + this.moment(new Date(final_time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + user_id + ")";
                      this.db_connection.query(insertion_query_4, (err4, result4, fields4) => {
                        if (err4) {
                          res.send(err4);
                        } else {
                          let future_working_hours = 0;
                          result4.forEach(element => {
                            let diff = Math.abs(element.Final_Time - element.Initial_Time);
                            future_working_hours += diff / 3600000;
                          });
                          const future_free_time = working_hours - future_working_hours;
                          const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD HH:mm:ss");
                          const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD HH:mm:ss");
                          const insertion_query_6 = "SELECT Activity_Assignment_id FROM activity_assignment WHERE User_Id = " + user_id + " AND Activity_Id = " + activity_id;
                          this.db_connection.query(insertion_query_6, (err5, result5, fields5) => {
                            if (err5) {
                              res.send(err5);
                            } else {
                              const insertion_query_7 = "INSERT INTO advance (Activity_Assignment_Id, Advance_Comments, Initial_Time, Final_Time) VALUES (" + result1[0].Activity_Assignment_Id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
                              this.db_connection.query(insertion_query_7, (err6, result6, fields6) => {
                                if (err6) {
                                  res.send(err6);
                                } else {
                                  if ((remaining_hours_for_activity > future_free_time)) {
                                    this.db_connection.query("DELETE FROM advance WHERE Advance_Id = " + result6.insertId, (err12, result12, fields12) => {
                                      if (err12) {
                                        res.send(err12);
                                      }
                                    });
                                  }
                                  res.send({ warning: (remaining_hours_for_activity > future_free_time) });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }

  validateAndEditAdvance(advance_info, res) {
    const advance_id = advance_info.advance_id;
    const advance_comments = advance_info.comments;
    const final_time = advance_info.final_hour;
    const initial_time = advance_info.initial_hour;
    const insertion_query_0 = "SELECT Activity_Id, User_Id FROM activity_assignment WHERE Activity_Assignment_Id IN ( SELECT Activity_Assignment_Id FROM advance WHERE Advance_Id = " + advance_id + ")";
    this.db_connection.query(insertion_query_0, (err0, result0, fields0) => {
      if (err0) {
        res.send(err0);
      } else {
        const user_id = result0[0].User_Id;
        let flag = false;
        const insertion_query_01 = "SELECT * FROM advance WHERE Activity_Assignment_Id in (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + user_id + ") AND Advance_Id != " + advance_id;
        this.db_connection.query(insertion_query_01, (err01, result01, field01) => {
          if (err01) {
            res.send(err01);
          } else {
            result01.forEach(element => {
              const eInitial_Time = this.moment(new Date(element.Initial_Time));
              const eFinal_Time = this.moment(new Date(element.Final_Time));
              const aInitial_Time = this.moment(new Date(initial_time));
              const aFinal_Time = this.moment(new Date(final_time));
              console.log(element.Initial_Time + ' : ' + element.Final_Time);
              if (!flag) {
                if ((aInitial_Time >= eInitial_Time && aInitial_Time <= eFinal_Time) ||
                  (aFinal_Time >= eInitial_Time && aFinal_Time <= eFinal_Time) ||
                  (eInitial_Time >= aInitial_Time && eInitial_Time <= aFinal_Time) ||
                  (eFinal_Time >= aInitial_Time && eFinal_Time <= aFinal_Time)) {
                  flag = true;
                }
              }
            });
            if (flag) {
              res.send({ overlapped: true });
            }
            else {
              const insertion_query_1 = "SELECT * FROM activity_assignment WHERE Activity_Id = " + result0[0].Activity_Id + " AND User_Id = " + result0[0].User_Id;
              this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
                if (err1) {
                  res.send(err1);
                } else {
                  const insertion_query_2 = "SELECT * FROM activity WHERE Activity_Id IN (SELECT Activity_Id FROM activity_assignment WHERE Activity_Assignment_Id = " + result1[0].Activity_Assignment_Id + ")";
                  this.db_connection.query(insertion_query_2, (err2, result2, fields2) => {
                    if (err2) {
                      res.send(err2)
                    } else {
                      const insertion_query_3 = "SELECT * FROM advance WHERE Initial_Time > '" + this.moment(new Date(result1[0].Initial_Time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Final_Time < '" + this.moment(new Date(result1[0].Final_Time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Activity_Assignment_Id = " + result1[0].Activity_Assignment_Id;
                      this.db_connection.query(insertion_query_3, (err3, result3, fields3) => {
                        if (err3) {
                          res.send(err3)
                        } else {
                          let invested_hours_on_activity = 0;
                          result3.forEach(element => {
                            let diff = Math.abs(element.Final_Time - element.Initial_Time);
                            invested_hours_on_activity += diff / 3600000;
                          });
                          const remaining_hours_for_activity = result2[0].Estimated_Hours - invested_hours_on_activity;
                          const a = this.moment(new Date());
                          const b = this.moment(result1[0].Final_Time);
                          const c = b.diff(a, 'days');
                          console.log(c);
                          const initial_weeknd = (6 - a.day() > c) ? 0 : 1;
                          let weekends_amount = (parseInt((c - (6 - a.day())) / 7) + initial_weeknd) * 2;
                          weekends_amount = (b.day() == 5) ? weekends_amount - 1 : weekends_amount;
                          const working_hours = (c - weekends_amount) * 8;

                          const date = (new Date()).toISOString();
                          const insertion_query_4 = "SELECT * FROM advance WHERE Initial_Time > '" + this.moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss") + "' AND Final_Time < '" + this.moment(new Date(final_time)).format("YYYY-MM-DD HH:mm:ss") + "' AND Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + result0[0].User_Id + ")";
                          this.db_connection.query(insertion_query_4, (err4, result4, fields4) => {
                            if (err4) {
                              res.send(err4);
                            } else {
                              let future_working_hours = 0;
                              result4.forEach(element => {
                                let diff = Math.abs(element.Final_Time - element.Initial_Time);
                                future_working_hours += diff / 3600000;
                              });
                              const future_free_time = working_hours - future_working_hours;
                              const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD HH:mm:ss");
                              const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD HH:mm:ss");
                              if (!(remaining_hours_for_activity > future_free_time)) {
                                const insertion_query_6 = "SELECT Activity_Assignment_Id FROM advance WHERE Advance_Id = " + advance_id;
                                this.db_connection.query(insertion_query_6, (err5, result5, fields5) => {
                                  if (err5) {
                                    res.send(err5);
                                  } else {
                                    const insertion_query_7 = "REPLACE INTO advance (Advance_Id, Activity_Assignment_Id, Advance_Comments, Initial_Time, Final_Time) VALUES (" + advance_id + ", " + result1[0].Activity_Assignment_Id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
                                    this.db_connection.query(insertion_query_7, (err6, result6, fields6) => {
                                      if (err6) {
                                        res.send(err6);
                                      } else {
                                        res.send({ warning: (remaining_hours_for_activity > future_free_time) });
                                      }
                                    });
                                  }
                                });
                              } else {
                                res.send({ warning: (remaining_hours_for_activity > future_free_time) });
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }

  editAdvance(advance_info, res) {
    //validate not previous date from today for the advance edition
    const advance_id = advance_info.advance_id;
    const advance_comments = advance_info.comments;

    const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD HH:mm:ss");
    const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD HH:mm:ss");

    const insertion_query_1 = "SELECT Activity_Assignment_Id FROM advance WHERE Advance_Id = " + advance_id;
    this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
      if (err1) {
        res.send(err1);
      } else {
        const insertion_query = "REPLACE INTO advance (Advance_Id, Activity_Assignment_Id, Advance_Comments, Initial_Time, Final_Time) VALUES (" + advance_id + ", " + result1[0].Activity_Assignment_Id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
        this.db_connection.query(insertion_query, (err, result, fields) => {
          if (err) {
            res.send(err);
          } else {
            res.send('Advance Successfully Updated!');
          }
        });
      }
    });
  }

  getAdvancesByUser(advance_info, res) {
    const query_string = "SELECT * FROM advance WHERE Activity_Assignment_Id IN (SELECT Activity_Assignment_Id FROM activity_assignment WHERE User_Id = " + advance_info.user_id + ")";
    this.db_connection.query(query_string, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }

  getAdvanceByActivity(advance_info, res) {
    this.db_connection.query("SELECT * FROM advance WHERE Activity_Id = " + advance_info.activity_id, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }

  createAdvance(advance_info, res) {
    const user_id = advance_info.user_id;
    const activity_id = advance_info.activity_id;
    const advance_comments = advance_info.comments;
    const initial_hour = this.moment(new Date(advance_info.initial_hour)).format("YYYY-MM-DD HH:mm:ss");
    const final_hour = this.moment(new Date(advance_info.final_hour)).format("YYYY-MM-DD HH:mm:ss");
    const insertion_query_1 = "SELECT Activity_Assignment_id FROM activity_assignment WHERE User_Id = " + user_id + " AND Activity_Id = " + activity_id;
    this.db_connection.query(insertion_query_1, (err1, result1, fields1) => {
      if (err1) {
        res.send(err1);
      } else {
        const insertion_query_2 = "INSERT INTO advance (Activity_Assignment_Id, Advance_Comments,  Initial_Time, Final_Time) VALUES (" + result1[0].Activity_Assignment_id + ", '" + advance_comments + "', '" + initial_hour + "', '" + final_hour + "')";
        this.db_connection.query(insertion_query_2, (err, result, fields) => {
          if (err) {
            res.send(err);
          } else {
            res.send('1 Advance Inserted!');
          }
        });
      }
    });
  }

}

module.exports = AdvancesManager;