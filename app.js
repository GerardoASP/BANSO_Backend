const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require('dotenv').config()
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const projectRoutes = require("./routes/project")

const cors = require("cors")
app.use(cors());


//Visualizacion del contenido del endpoint o envio del contenido
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("uploads"));
app.use('/uploads', express.static('uploads'));

//app.use(`/${API_PATH}/addresses`, addressRoutes);
app.use(`/${process.env.API_PATH}/users`,userRoutes);

app.use(`/${process.env.API_PATH}/auth`,authRoutes);

app.use(`/${process.env.API_PATH}/projects`,projectRoutes);

module.exports = app
