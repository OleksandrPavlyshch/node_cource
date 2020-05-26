const request = require("postman-request");
const key = "eeccb0dbd5d6e7863c8810249cbdbc18";
const location = "Kiev";


const url = `http://api.weatherstack.com/current?access_key=${key}&query=${location}&units=m`;
const weatherMessage = (data) => {
    console.log(JSON.parse(data));
    const {temperature, feelslike, precip } = JSON.parse(data).current;
    const message = `It is currentl ${temperature}. It feels like ${feelslike}. There is ${precip * 100}% chanse to rain.`;
    console.log(message);
}

request(url, function (error, response, body) {
    weatherMessage(body);
});
