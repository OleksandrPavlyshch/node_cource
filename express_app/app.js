const path = require('path');
const express = require('express');
const hbs = require('hbs');
const request = require("postman-request");
const key = "eeccb0dbd5d6e7863c8810249cbdbc18";

console.log(__dirname);
console.log(__filename);

const publickDirectoryPath = path.join(__dirname, './public');
const stemplatesPath = path.join(__dirname, "./templates");
const partialPath = path.join(__dirname, "./templates/partials");
const app = express();

app.use(express.static(publickDirectoryPath));

app.set("view engine", "hbs");
app.set("views", stemplatesPath);
hbs.registerPartials(partialPath);

app.get('', (req, res) => {
    res.render('index', {
        title: 'My Weather page',
        name: 'Oleksandr'
    });
})


app.get("/about", (req, res) => {
    res.render("about", {
        title: "My About page",
        name: "Oleksandr",
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "My Help page",
        name: "Oleksandr",
    });
});

app.get("/weather", (req, res) => {
    const location = req.query.location;
    if (!location) res.send({ errorMessage: "No location Set" });
    const url = `http://api.weatherstack.com/current?access_key=${key}&query=${location}&units=m`;

    request(url, function (error, response, body) {
        const requestBody = JSON.parse(body);
        if (error || requestBody.error) {
            res.send({ error: requestBody.error });
            return;
        }

        const { temperature, feelslike, precip } = JSON.parse(body).current;
        const { name, country, region } = JSON.parse(body).location;
        const message = `It is currentl ${temperature}. It feels like ${feelslike}. There is ${
            precip * 100
        }% chanse to rain.`;
        const location = `${name}, ${region}, ${country}`;

        res.send(
            {
                location: location,
                message: message,
            }
        );
    });

});

app.get("*", (req, res) => {
    res.render("404", {
        title: "My 404 page",
        name: "Oleksandr",
    });
});

app.listen(3000, () => {
    console.log('Server is running');
})