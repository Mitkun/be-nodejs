import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors'

require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));
// app.use(
//   cors({
//     origin: true,
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
// app.options(
//   '*',
//   cors({
//     origin: true,
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Backend Nodejs is runing on the port: " + port);
})