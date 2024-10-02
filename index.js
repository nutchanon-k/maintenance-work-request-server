require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const notFound = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");


const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth',authRoute)




app.use(errorMiddleware)
app.use('*', notFound)




const port = process.env.PORT
app.listen(port, () => 
    console.log(`Server is running on port ${port}`))