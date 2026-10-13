const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-mate");

app.use(express.urlencoded({ extended: true }));

const port = 8080;
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema =  require("./schema.js");

main().then(() => {
    console.log("Connection succesfull")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.get("/", (req, res) => {
    res.send("Hey, I am Root")
});
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))


const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errmsg);
    }else{
        next();
    }
    
}

//index route
app.get("/listings",  wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});

    res.render("./listing/index.ejs", { allListings })
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("./listing/new.ejs")
})

//show route
app.get("/listings/:id",  wrapAsync( async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing })

}));

//create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    
   
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings")

}));

//Edit rout
app.get("/listings/:id/edit",  wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listing/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing,  wrapAsync( async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)

}));

// delete route
app.delete("/listings/:id",  wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Reviews
app.post



// app.get("/testListing",  async(req, res)=>{

//     let sampleListing = new Listing({
//         title : "My new villa",
//         description : "By the beach",
//         price: 1200, 
//         location : "Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("success")

// })

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