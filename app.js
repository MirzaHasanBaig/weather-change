const express = require('express')
const app = express()
const ax = require('axios')
const cheer = require('cheerio')
const bodyParser = require("body-parser");
const { default: axios } = require('axios');
const { response } = require('express');
const { append } = require('express/lib/response');
const { each } = require('cheerio/lib/api/traversing');
const { configureProxy } = require('axios-proxy-builder');



const port = process.env.PORT|2000;
var Arr_value = [];
var temprature = '';
var country = "";

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ Welcome: 'Welcome to Climate forecasting', URL_For_Weather_Fetching: 'http://localhost:2000/weather/city-countryshortname', Example: 'http://localhost:2000/weather/karachi-pk', Contact: 'nadeemb305@gmail.com', Author: 'Hassan Nadeem Baig' });
})
app.get("/weather/:reqName-:reqNameZip", (req, res) => {
    const City = req.params.reqName;
    const Short_Name = req.params.reqNameZip;
    const uri = 'https://www.weatherforyou.com/reports/index.php?config=&pass=&dpp=&forecast=zandh&config=&place=' + City + '&state=&pands=' + City + ',&country=' + Short_Name;
    const requestURL = uri;
    const proxy = configureProxy(requestURL);
    axios({...proxy, url: requestURL });
    axios.get(requestURL)
        .then((response) => {
            const html = response.data;
            const $ = cheer.load(html);
            $(".headerText", html).each(() => {
                country = $(this).text();
                country = country.slice(2);
            })
            $('.Temp', html).each(function() {
                temprature = $(this).text();
                Weatherjson = { temprature };
            })
            $('.Value', html).each(function() {
                const values = $(this).text();
                Arr_value.push(values);
            })
            Humidity = Arr_value[0];
            Solar_Rad = Arr_value[1];
            Dew_point = Arr_value[2];
            Wind = Arr_value[3];
            Visibility = Arr_value[4];
            Pressure_Barometer = Arr_value[4];

            Weatherjson = { City,Short_Name, Humidity, temprature, Solar_Rad, Wind, Dew_point, Visibility, Pressure_Barometer }
            res.json(Weatherjson);
        })
        .catch((err) => console.log(err));
})

app.listen(port, (req, res) => {
    try {
        console.log("Our service is running on localhost:" + port + " url");
    } catch (e) {

    }
})