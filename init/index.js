const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user");

main().then(() => {
  console.log("Connection succesfull")
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const intiDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6ad47965cddcec8a40465ead"
  }));
  await Listing.insertMany(initData.data)
  console.log("data was intialized")
}

intiDB()