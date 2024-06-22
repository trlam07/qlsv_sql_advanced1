const pool = require("./db");
class Base {
    //nếu không khai báo hàm constructor thì nó sẽ mặc định gọi hàm constructor không tham số có sẵn
    //constructor () {}
    buildLimit = (page = null, item_per_page = null) => {
        let limit = "";
        if (page && item_per_page) {
          const row_index = (page - 1) * item_per_page;
          limit = `LIMIT ${row_index}, ${item_per_page}`;
        }
        return limit;
      };

      all = async (page = null, item_per_page = null) => {
        try {
          // xây dựng phân trang
          const limit = this.buildLimit(page, item_per_page);
          const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} ${limit}`);
          return this.convertArrayToObjects(rows);
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      };

      getByPattern = async (search, page = null, item_per_page = null) => {
        try {
          // xây dựng phân trang
          const limit = this.buildLimit(page, item_per_page);
          const [rows] = await pool.execute(
            `${this.SELECT_ALL_QUERY} WHERE name LIKE ? ${limit}`,
            [`%${search}%`]
          );
          return this.convertArrayToObjects(rows);
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      };

      find = async (id) => {
        try {
          const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} WHERE ${this.TABLE_NAME}.id=?`, [
            id,
          ]);
          // check nếu không có dòng nào thỏa mãn trong bảng student
          if (rows.length === 0) {
            return null;
          }
          const row = rows[0];
          const object = this.convertArrayToObject(row);
          return object;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      };

      convertArrayToObjects = (rows) => {
        const objects = rows.map(
          (row) => this.convertArrayToObject(row));
        return objects;
      };

      destroy = async () => {
        try {
          await pool.execute(
            `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`,
            [this.id]);
          return true;
        } catch (error) {
          throw new Error(error);
        }
      };
}

module.exports = Base;