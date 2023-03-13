
const express = require('express')
const mysql = require("mysql")
const app = express()
const port = 8080
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
                        code: 200,
                        userMail: email
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
            return res.status(200).json({
                message: "request records found",
                code: 200,
                userMail: email
            });
        });

    } catch (error) {
        console.log("❌ error from userLogin")
        res.send(false)
    }
})

// booking service
app.post("/bookingService", (req, res) => {
    try {
        const { email, name, phone, location, hours, address, vehicleId, payment_intent } = req.body
        console.log("req.body", req.body)

        let sql = "INSERT INTO booking (email, name, phone, location, hours, address, vehicleId, payment_intent) VALUES ? ";
        let values = [
            [email, name, phone, location, hours, address, vehicleId, payment_intent],
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("✅ request records inserted:", result.affectedRows);
            return res.status(200).json({
                message: "you are successful to booking your service",
                code: 200
            });

        });
    } catch (error) {
        console.log("❌ error from addRegisterUser")
        res.send(false)
    }
})

// get your booking
app.get(`/yourBooking`, (req, res) => {
    const userEmail = req.query.email
    console.log("req :::->: ", req.query.email)
    const sql = `SELECT * FROM booking WHERE email = "${userEmail}";`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result))
        console.log("Get your order", result);
    });
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



// payment gateway
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")('sk_test_51Ie1JhBHVweerPiK6OwuH7Le6GhqvqT902IKfI31hUySxJe9VIKrea23SBrYdndy2Btyx539mTZqHlEUJ02MttrN00pUQ5cz5F');
const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




