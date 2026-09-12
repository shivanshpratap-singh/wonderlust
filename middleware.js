const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");

const {
    listingSchema,
    reviewSchema
} = require("./schema.js");


// ==========================
// IS LOGGED IN
// ==========================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to create a new listing"
        );

        return res.redirect("/login");
    }

    next();
};


// ==========================
// SAVE REDIRECT URL
// ==========================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (!req.session.redirectUrl) {
        req.session.redirectUrl = req.originalUrl;
    }

    next();
};


// ==========================
// IS OWNER
// ==========================

module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {

        req.flash(
            "error",
            "You do not have permission to do that"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};


// ==========================
// VALIDATE LISTING
// ==========================

module.exports.validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {

        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// ==========================
// VALIDATE REVIEW
// ==========================

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {

        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// ==========================
// IS REVIEW AUTHOR
// ==========================

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {

        req.flash(
            "error",
            "You are not the author of this review"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};