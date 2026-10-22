const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("./listing/index.ejs", { allListings })
}