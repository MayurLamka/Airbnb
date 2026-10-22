const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwned, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listingController.js");




//index route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn,  (req, res) => {
   
    res.render("./listing/new.ejs")
})

//show route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate:{
        path: "author",
    }})
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    
    res.render("listing/show.ejs", { listing })

}));


//create route
router.post("/", isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("Success", "New listing created");
    res.redirect("/listings")

}));

//Edit rout
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isOwned, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("Success", "Listing updated");

    res.redirect(`/listings/${id}`)

}));

// delete route
router.delete("/:id", isLoggedIn, isOwned,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Success", "Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;