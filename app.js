if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError= require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema }= require("./schema.js");
const Review = require("./models/reviews.js")
const session = require("express-session");
const MongoStore= require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { isLoggedIn } = require("./middleware.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dburl= process.env.MONGODB_URI;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions = {
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 *24 *60 * 60 *1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  } ,

};

const store = MongoStore.create({
  mongoUrl:dburl,
  crypto: {
    secret:process.env.SECRET,

  },
  touchAfter:24*3600,

});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    username: "Sigma Student",
    email: "sigma@student.com",
  });
  let registeredUser = await User.register(fakeUser, "SigmaStudent123");
  res.send(registeredUser);
});


app.get("/", (req, res) => {

  res.send("Hi, I am root");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

const validateListing = (req, res, next ) => {
  let {error} = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, result.errMsg);

  }else{
    next();
  }
};

const validateReview = (req, res, next ) => {
  let {error} = reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, result.errMsg);

  }else{
    next();
  }
};

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

//Create Route
// app.post("/listings", validateListing ,
app.post(
  "/",
validateListing,
  wrapAsync(async (req, res , next)=> {

  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  // const newListing = new Listing(req.body.listing);
  // if(!newListing.title){
  //   throw new ExpressError(400, "Title is missing");
  // }
  // if(!newListing.decription){
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if(!newListing.location){
  //   throw new ExpressError(400, "Location is missing!");
  // }
  // await newListing.save();
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New Listing Created");
  


  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success","Listing found");
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing updated successfully");
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
    req.flash("success","Listing deleted successfully");
  res.redirect("/listings");
}));

// Reviews
// Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req , res )=> {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success","New Review Added");

  console.log("new review saved");
  res.send("new review saved");

}));

// DELETE REVIEW

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req,  res) => {
    let {id,reviewId} =req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
)


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all("/{*splat}", (req,res,next) => {
  next(new ExpressError(404,"page not found!"));
});

app.use((err, req, res, next) => {
  let {statusCode =500, message="something went wrong!"} =err;
  res.render("error.ejs" ,{err});
  // res.send(statusCode).send(message);
 
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});