const pool = require("./db");
const Base = require('./Base')
class Subject extends Base {
  // hàm xây dựng đối tượng
  constructor(id, name, number_of_credits) {
    super();
    this.id = id;
    this.name = name;
    this.number_of_credits = number_of_credits;
  }

  TABLE_NAME = 'subject'
   SELECT_ALL_QUERY = `SELECT * FROM ${this.TABLE_NAME}`;

   convertArrayToObject = (row) => {
    return new Subject(row.id, row.name, row.number_of_credits)
  };

   save = async (data) => {
    try {
      const [result] = await pool.execute(
        "INSERT INTO subject VALUE(?,?,?)",
        [null, data.name, data.number_of_credits]
      );
      console.log(result);
      return result.insertId;
    } catch (error) {
      throw new Error(error);
    }
  };
   
  update = async () => {
    try {
      await pool.execute(
        "UPDATE subject SET name = ?, number_of_credits = ? WHERE id = ?",
        [this.name, this.number_of_credits, this.id]
      );
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = new Subject();
