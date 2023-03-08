
const express = require('express')
const mysql = require("mysql")
const app = express()
const port = 8080

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "123456",
    database: "nodemysql"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected my sql!");
});

// create db
app.get("/createDB", (req, res) => {
    try {
        const sql = 'CREATE DATABASE nodemysql';
        con.query(sql, (err, result) => {
            if (err) {
                console.log("error", err)
                throw err
            }
            console.log("database created")
            res.send("database created in admin");
        })
    } catch (error) {
        console.log("error try catch", error)
    }
})

// create table
app.get("/cratedTable", (req, res) => {
    const sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    con.query(sql, (err, result) => {
        if (err) throw err
        console.log("table created")
        res.send("table created")
    })
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




