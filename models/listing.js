const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        type: String,
        set: (v) =>
            v === ""
                ? "https://unsplash.com/photos/sailboat-on-san-francisco-bay-skyline-c_FKydWeg98"
                : v,
          
    },

    price: {
        type: Number,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;