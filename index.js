
const express = require('express')
const mysql = require("mysql")
const app = express()
const port = 8080
const bodyParser = require('body-parser');
const cors = require('cors');
const { dateConvert } = require('./functions/localDateFunction');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// configure the db
var con = mysql.createConnection({
    // free hosting database online
    // host: "sql10.freemysqlhosting.net",
    // user: "sql10609189",
    // password: "bbIZLNLBTb",
    // database: "sql10609189"
    // Local host admin site
    host: "localhost",
    user: "root",
    database: "rentacar"
});
// connection to the db
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


// validation of booking
// SELECT * FROM `booking` WHERE vehicleId = "1" AND startDate="2023-03-22";

app.get('/serviceAvailable', (req, res) => {
    const { id, date, email } = req.query
    console.log("🧑‍💻 service available ::", id, "➡️ ", date)
    //SELECT * FROM booking WHERE vehicleId = '201' AND startDate='2023-03-25';
    const sql = `SELECT * FROM booking WHERE vehicleId = '${id}' AND email='${email}';`
    // const sql = `SELECT * FROM booking WHERE vehicleId = '${id}' AND startDate='${date}';`
    try {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                console.log('🔄️ result get:', result)

                let dateArray = [...result]
                let allBookedDate = []

                console.log('🔄️ result dateArray:', dateArray)
                for (let i = 0; i < dateArray.length; i++) {
                    const element = dateArray[i];
                    // let date = dateConvert(element.startDate)
                    console.log("el", element.startDate)
                    allBookedDate.push(element.startDate)
                }
                console.log('🔄️ allBookedDate:', allBookedDate.length)

                console.log("result if : ",
                    {
                        status: true,
                        message: "❌ can not book this day",
                        date: date || "",
                        vehicleId: id,
                        allBookedDate: allBookedDate
                    }
                )
                res.send({
                    status: true,
                    message: "❌ can not book this day",
                    date: date || "",
                    vehicleId: id,
                    allBookedDate: [...allBookedDate]
                })
            } else {
                console.log("result else",
                    {
                        status: false,
                        message: "✅ can book this day",
                        date: date || "",
                        vehicleId: id
                    }
                )
                res.send({
                    status: false,
                    message: "✅ can book this day",
                    date: date || "",
                    vehicleId: id
                })
            }
        });
    } catch (error) {
        console.log("Error", error)
        res.send(error)
    }
})



// get your service data
app.get(`/serviceData`, (req, res) => {
    const serviceId = req.query.id
    console.log("req :::->: ", req.query.id)
    console.log("serviceId ::->: ", serviceId)

    // 101 = cardata
    // 102 = busdata
    // 103 = truckdata

    let searchTable = ''
    try {
        if (serviceId == '101') {
            searchTable = 'allcardata'
        } else if (serviceId == '102') {
            searchTable = 'allbusdata'
        } else if (serviceId == '103') {
            searchTable = 'alltruckdata'
        } else {
            res.send("Service id not found")
        }

        console.log("service found table:", searchTable)
        //get data
        const sql = `SELECT * FROM ${searchTable};`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("result", result)
            res.send(JSON.stringify(result))
            console.log("Get your service data", result);
        });

    } catch (error) {
        console.log("error")
        res.send("error in backend")
    }


})

// booking service
app.post("/bookingService", (req, res) => {
    try {
        const { email, name, phone, location, hours, address, vehicleId, payment_intent, startDate } = req.body
        console.log("req.body : ", req.body)

        let sql = "INSERT INTO booking (email, name, phone, location, hours, address, vehicleId, payment_intent, startDate) VALUES ? ";
        let values = [
            [email, name, phone, location, hours, address, vehicleId, payment_intent, startDate],
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("✅ request records inserted : :", result.affectedRows);
            return res.status(200).json({
                message: "you are successful to booking your service..",
                code: 200
            });

        });
    } catch (error) {
        console.log("❌ error from addRegisterUser")
        res.send(false)
    }
})
// delete booking service
app.get('/deleteBookingService', (req, res) => {
    const { bookingId, email } = req.query
    console.log("bookingId :", bookingId, " - ", " email", email)
    var sql = `DELETE FROM booking WHERE bookingId = '${bookingId}' AND email = '${email}';`
    var sql2 = ``
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        const sql = `SELECT * FROM booking WHERE email = "${email}";`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result))
            console.log("Get your order", result);
        });
    });

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
// add all service table
app.post('/addAllService', (req, res) => {
    console.log("req", req.body)
    const { id, name, image, description, price } = req.body
    // const sql = `INSERT INTO allservicedata (id, name, image, describe,price)`
    // var sql = `INSERT INTO allservicedata (id, name, image, describe, price) VALUES ('${id}','${name}','image1','${describe}','${price}')`;
    var sql = `INSERT INTO allservicedata (id, name, image, description,price) VALUES ('${id}','${name}','${image}','${description}','${price}');`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    res.send("Yes I got json")
})
// add all buss table
app.post('/addBusService', (req, res) => {
    console.log("req", req.body)
    const { id, name, image, description, price } = req.body
    // const sql = `INSERT INTO allservicedata (id, name, image, describe,price)`
    // var sql = `INSERT INTO allservicedata (id, name, image, describe, price) VALUES ('${id}','${name}','image1','${describe}','${price}')`;
    var sql = `INSERT INTO allbusdata (id, name, image, description,price) VALUES ('${id}','${name}','${image}','${description}','${price}');`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted allservicedata");
    });

    res.send("Yes I got one allservicedata")
})
// add all car table
app.post('/addCarService', (req, res) => {
    console.log("req", req.body)
    const { id, name, image, description, price } = req.body
    // const sql = `INSERT INTO allservicedata (id, name, image, describe,price)`
    // var sql = `INSERT INTO allservicedata (id, name, image, describe, price) VALUES ('${id}','${name}','image1','${describe}','${price}')`;
    var sql = `INSERT INTO allcardata (id, name, image, description,price) VALUES ('${id}','${name}','${image}','${description}','${price}');`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted addCarService");
    });

    res.send("Yes I got one addCarService")
})
// add all truck table
app.post('/addTruckService', (req, res) => {
    console.log("req", req.body)
    const { id, name, image, description, price } = req.body
    // const sql = `INSERT INTO allservicedata (id, name, image, describe,price)`
    // var sql = `INSERT INTO allservicedata (id, name, image, describe, price) VALUES ('${id}','${name}','image1','${describe}','${price}')`;
    var sql = `INSERT INTO alltruckdata (id, name, image, description,price) VALUES ('${id}','${name}','${image}','${description}','${price}');`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted addTruckService..");
    });

    res.send("Yes I got one addTruckService .")
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
    res.send('Hello World!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




