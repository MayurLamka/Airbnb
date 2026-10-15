const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-mate");

app.use(express.urlencoded({ extended: true }));

const port = 8080;

const ExpressError = require("./utils/ExpressError.js");
const listings = require("./Routes/listing.js");
const reviews = require("./Routes/reviews.js");


main().then(() => {
    console.log("Connection succesfull")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.send("Hey, I am Root")
});
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))





app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)


app.all("/*splat", (req, res, next) => {

    next(new ExpressError(404, "Page not Found!"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    // res.status(status).send(message)
    res.status(status).render("listing/error.ejs", {message});
});

app.listen(port, () => {
    console.log("Server is listing to port 8080")
})