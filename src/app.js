const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars view engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)   // Setting up custom views path

hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req, res)=>{
    res.render('index', {
        title : 'Weather App',
        name : 'Chandresh Baghel'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title : 'About Me',
        name : 'Chandresh Baghel'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title : 'Help',
        name : 'Chandresh Baghel',
        msg : 'This is help Message!'
    })
})

app.get('/weather',(req, res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})  //property short hand is used here for error
        }
        //console.log(latitude,longitude)
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast : forecastData,
                location,
                address: req.query.address
            })
        })

    })

})

app.get('/help/*', (req, res)=>{
    res.render('error',{
        title : '404',
        errorMsg : 'Help article not found.',
        name: 'Chandresh Baghel'
    })
})

app.get('*', (req, res)=>{
    res.render('error',{
        title : '404',
        errorMsg : 'Page not found.',
        name: 'Chandresh Baghel'
    })
})

app.listen(3000, ()=>{
    console.log('Server is up and running on port 3000')
})

