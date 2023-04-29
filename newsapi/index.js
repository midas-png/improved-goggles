require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 5000;
const app = express();
const path = require("path");

app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname)));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL).then(() => {
            console.log("Database connected");
        });
        app.listen(PORT, () =>
            console.log(`Server is listening to port ${PORT}`)
        );
    } catch (err) {
        console.log(err);
    }
};

start();
