const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isRviewAuthor, saveRedirectUrl } = require("../middleware.js");


//create Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("Success", "New review created");

    res.redirect(`/listings/${listing._id}`);

}));

// Delete Reviews rout
router.delete("/:reviewId", isLoggedIn, isRviewAuthor, saveRedirectUrl, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success", "Review deleted");
   


    res.redirect(`/listings/${id}`);
}));

module.exports = router;    