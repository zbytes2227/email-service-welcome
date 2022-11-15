const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const PORT = process.env.PORT;
// const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const newUserData = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const JSONnewUserData = JSON.stringify(newUserData);
    const listkey = process.env.LISTKEY;
    const api = process.env.APIKEY;
    const url = `https://us9.api.mailchimp.com/3.0/lists/${listkey}`;
    const options = {
        method: "POST",
        auth: `ujjwal:${api}`
    }

    const request = https.request(url, options, (response) => {

        response.on("data", (data) => {
            var result_from_api = JSON.parse(data);
            // console.log(result_from_api);
            if (response.statusCode === 200 && result_from_api.error_count === 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failiure.html");
                // console.log(result_from_api.errors);
            }
        })

    })

    request.write(JSONnewUserData);
    request.end();
})

app.listen(PORT, () => {
    console.log('Server Status: Running')
})
