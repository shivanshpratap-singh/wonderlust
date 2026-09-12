const express = require("express");
const router = express.Router();

const multer = require("multer");

const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const { storage } = require("../cloudconfig.js");

const uploadCloud = multer({ storage });

const listingController = require("../controller/listing.js");


// ===============================
// Index + Create Route
// ===============================

router
    .route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        uploadCloud.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );


// ===============================
// New Route
// ===============================

router.get(
    "/new",
    isLoggedIn,
    wrapAsync(listingController.renderNewForm)
);


// ===============================
// Show / Update / Delete Route
// ===============================

router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
   .put(
        isLoggedIn,
        isOwner,
        validateListing,
        uploadCloud.single("listing[image]"),
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );


// ===============================
// Edit Route
// ===============================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;
