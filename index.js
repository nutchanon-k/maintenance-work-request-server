require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const notFound = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const requestTaskRoute = require("./routes/request-task-route");
const maintenanceTaskRoute = require("./routes/maintenance-task-route");
const { authenticate } = require("./middlewares/authenticate");
const Morgan = require("morgan");


const app = express();

app.use(express.json());
app.use(cors());
app.use(Morgan("dev"));

app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/request-task", authenticate, requestTaskRoute);
app.use("/maintenance-task", authenticate, maintenanceTaskRoute);


app.use(errorMiddleware);
app.use("*", notFound);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
