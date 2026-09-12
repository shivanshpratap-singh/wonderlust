const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const {isLoggedIn,validateReview ,isReviewAuthor}= require('../middleware.js');
const reviewController = require('../controller/reviews.js');




module.exports = router;

// Reviews
// Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview));
// DELETE REVIEW

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);
//     res.redirect(`/listings/${id}`);
//   })
// )
// app.all("/{*splat}", (req,res,next) => {
//   next(new ExpressError(404,"page not found!"));
// });

// app.use((err, req, res, next) => {
//   let {statusCode =500, message="something went wrong!"} =err;
//   res.render("error.ejs" ,{err});
//   // res.send(statusCode).send(message);
 
// });