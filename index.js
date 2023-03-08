
const express = require('express')
const mysql = require("mysql")
const app = express()
const port = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "123456",
    database: "rentacar"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected my sql!");
});

// register user
app.post("/addRegisterUser", (req, res) => {
    try {
        const { email, password, name, address, phone, details } = req.body
        console.log("⚓ client body data: ", req.body);
        // checking email is there or not
        let emailSql = `SELECT * FROM users WHERE email = '${email}'`
        con.query(emailSql, function (err, result) {
            if (err) {
                console.log("throw err", err)
            };
            console.log("✅ request result found ", result);
            console.log("✅ request email found ", result[0]?.email);
            if (result[0]?.email) {
                return res.status(400).json({
                    message: "you cant create a account",
                    code: 400
                });
            }
            // if (result == []) {
            //     console.log("✅ request result found empty = [] ", result);
            //     createUser = true
            // }
            else {
                let sql = "INSERT INTO users (email, password, name, address, phone, details) VALUES ?";
                let values = [
                    [email, password, name, address, phone, details],
                ];
                con.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log("✅ request records inserted:", result.affectedRows);
                    return res.status(200).json({
                        message: "you are created a account",
                        code: 200
                    });

                });
            }
        });
    } catch (error) {
        console.log("❌ error from addRegisterUser")
        res.send(false)
    }
})
// user login
app.post("/userLogin", (req, res) => {
    try {
        const { email, password } = req.body
        console.log("✅ user login ", req.body)
        let sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("✅ request records found", result);
        });

        res.send(true)
    } catch (error) {
        console.log("❌ error from userLogin")
        res.send(false)
    }
})





// delete table
app.get("/deleteTable", (req, res) => {
    const sql = "DROP TABLE users";
    con.query(sql, (err, result) => {
        if (err) throw err
        console.log("table deleteTable")
        res.send("table deleteTable")
    })
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

// user login/register db
app.get("/registerUserTable", (req, res) => {
    try {
        const sql = `CREATE TABLE users 
                        ( userId int NOT NULL AUTO_INCREMENT, 
                           name VARCHAR(255), 
                           address VARCHAR(255),
                           phone VARCHAR(255),
                           details VARCHAR(255),
                           PRIMARY KEY (userId)
                           )`;
        con.query(sql, (err, result) => {
            if (err) throw err
            console.log("table created")
            res.send("table created")
        })
    } catch (error) {
        console.log("error try catch", error)
    }
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




