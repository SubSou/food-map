const { pool } = require("../../config/database");

exports.selectRestaurants = async function (connection, category) {
  const selectAllRestaurantsQuery = "SELECT * FROM Restaurants;";
  const selectCategorizedRestaurantsQuery =
    "SELECT title,address,category,videoUrl FROM Restaurants where status = 'A' and category = ?;";

  const Query = category
    ? selectCategorizedRestaurantsQuery
    : selectAllRestaurantsQuery;

  const Params = [category];

  const rows = await connection.query(Query, Params);
  return rows;
};

exports.deleteStudent = async function (connection, studentIdx) {
  const Query = `update Students set status = "D" where studentIdx = ?;`;
  const Params = [studentIdx];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.updateStudents = async function (
  connection,
  studentIdx,
  studentName,
  major,
  birth,
  address
) {
  const Query = `update Students set studentName = ifnull(?,studentName), major = ifnull(?,major), birth = ifnull(?,birth), address = ifnull(?,address) where studentIdx = ?;`;
  const Params = [studentName, major, birth, address, studentIdx];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.isValidStudentIdx = async function (connection, studentIdx) {
  const Query = `SELECT * FROM Students where studentIdx = ? and status = 'A';`;
  const Params = [studentIdx];

  const [rows] = await connection.query(Query, Params);
  if (rows < 1) {
    return false;
  }

  return true;
};

exports.insertStudents = async function (
  connection,
  studentName,
  major,
  birth,
  address
) {
  const Query = `insert into Students(studentName, major, birth, address) values(?,?,?,?);`;
  const Params = [studentName, major, birth, address];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.selectStudents = async function (connection, studentIdx) {
  const Query = `SELECT * FROM Students where studentIdx = ?;`;
  // const selectStudentByNameQuery = `SELECT * FROM Students where studentName = ?;`;

  const Params = [studentIdx];

  // let Query = studentName ? selectStudentByNameQuery : selectAllStudentQuery;

  // if (!studentName) {
  //   Query = selectAllStudentQuery;
  // } else {
  //   Query = selectStudentByNameQuery;
  // }

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Students;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
