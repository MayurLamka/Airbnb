const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("./listing/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
   
    res.render("./listing/new.ejs")
}

module.exports.showListing = async (req, res) => {

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

}

module.exports.createListing = async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("Success", "New listing created");
    res.redirect("/listings")

}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;

    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("Success", "Listing updated");

    res.redirect(`/listings/${id}`)

}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Success", "Listing deleted");
    res.redirect("/listings");
}