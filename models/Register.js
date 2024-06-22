const pool = require("./db");
const Base = require('./Base')
class Register extends Base {
  // hàm xây dựng đối tượng
  constructor(id, student_id, subject_id, score, student_name, subject_name) {
    super();
    this.id = id;
    this.student_id = student_id;
    this.subject_id = subject_id;
    this.score = score;
    this.student_name = student_name;
    this.subject_name = subject_name;
  }

  TABLE_NAME = 'register'

   SELECT_ALL_QUERY = `
  SELECT ${this.TABLE_NAME}.*, student.name AS student_name, subject.name AS subject_name 
  from ${this.TABLE_NAME}
  JOIN student ON ${this.TABLE_NAME}.student_id = student.id
  JOIN subject ON ${this.TABLE_NAME}.subject_id = subject.id
  `

  convertArrayToObject = (row) => {
    return new Register(row.id, row.student_id, row.subject_id, row.score != null ? row.score.toFixed(2) : null, row.student_name, row.subject_name)
  };

   getByPattern = async (search, page = null, item_per_page = null) => {
    try {
      // xây dựng phân trang
      const limit = this.buildLimit(page, item_per_page);
      const [rows] = await pool.execute(
        `${this.SELECT_ALL_QUERY} WHERE student.name LIKE ? OR subject.name LIKE ? ${limit}`,
        [`%${search}%`, `%${search}%`]
      );
      return this.convertArrayToObjects(rows);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
// lấy danh sách đăng ký mh của 1 sv
   getByStudentId = async (student_id, page = null, item_per_page = null) => {
    try {
      // xây dựng phân trang
      const limit = this.buildLimit(page, item_per_page);
      const [rows] = await pool.execute(
        `${this.SELECT_ALL_QUERY} WHERE register.student_id = ? ${limit}`,
        [student_id]
      );
      return this.convertArrayToObjects(rows);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  // lấy danh sách đăng ký mh của 1 sv
   getBySubjectId = async (subject_id, page = null, item_per_page = null) => {
    try {
      // xây dựng phân trang
      const limit = this.buildLimit(page, item_per_page);
      const [rows] = await pool.execute(
        `${this.SELECT_ALL_QUERY} WHERE register.subject_id = ? ${limit}`,
        [subject_id]
      );
      return this.convertArrayToObjects(rows);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

   save = async (data) => {
    try {
      const [result] = await pool.execute(
        'INSERT INTO register VALUE(?,?,?, ?)',
        [null, data.student_id, data.subject_id, null]
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
        'UPDATE register SET score = ? WHERE id = ?',
        [this.score, this.id]
      );
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
  
}

module.exports = new Register();
