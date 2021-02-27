const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_perpus",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected..");
});

// app.set('port', process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// route untuk homepage
app.get("/", (req, res) => {
  let sql =
    "SELECT *, categories.nama FROM books INNER JOIN categories ON books.category_id = categories.id";
  //   let sql =
  // "SELECT * FROM books, categories where books.category_id = categories.id order by books.id desc";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.render("perpus_view", {
      results: results,
    });
  });
});

// route untuk insert data
app.post("/save", (req, res) => {
  let data = {
    name: req.body.book_name,
    stock: req.body.book_stock,
    image: req.body.book_image,
    deskripsi: req.body.book_deskripsi,
    category_id: req.body.book_category_id,
  };
  let sql = "INSERT INTO books SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// route untuk insert data kategori
app.post("/save1", (req, res) => {
  let data = {
    nama: req.body.nama,
  };
  let sql = "INSERT INTO categories SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// route untuk update
app.post("/update", (req, ress) => {
  let sql =
    "UPDATE books SET name='" +
    req.body.book_name +
    "', stock='" +
    req.body.book_stock +
    "', image='" +
    req.body.book_image +
    "', deskripsi='" +
    req.body.book_deskripsi +
    "', category_id='" +
    req.body.book_category_id +
    "' WHERE id=" +
    req.body.id;
//   let sql = `UPDATE books SET name='${req.body.book_name}', stock='${req.body.book_stock}', image='${req.body.book_image}', deskripsi='${req.body.book_deskripsi}', category_id='${req.body.book_category_id}' WHERE id=${req.body.id}`;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//route untuk delete data
app.post('/delete',(req, res) => {
    let sql = "DELETE FROM books WHERE id="+req.body.id+"";
    let query = connection.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });

app.listen(8000, () => {
  console.log("server running pro 8000");
});
