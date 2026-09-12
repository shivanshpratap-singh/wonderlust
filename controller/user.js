

module.exports.renderSignupform = (req, res) => {
    res.render("users/signup.ejs");
    
};


module.exports.signup = async (req, res) => {
   try{
     let { username, email, password } = req.body;
    const newuser = new User({ username, email, password });
    const registeredUser = await User.register(newuser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
    });
    req.flash('success', 'Welcome to the site!');   
    res.redirect(req.session.redirectUrl);


   } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
   }
};

module.exports.renderLoginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginform = (req, res) => {
    req.flash('success', 'Welcome back!');
     let redirectUrl = req.session.redirectUrl || '/listings';
    //  delete req.session.redirectUrl;
   res.redirect(redirectUrl);
};

module.exports.logoutform = (req, res, next ) => {
    req.logout((err) => {
        if (err) {
              return next(err);
        } else {
            req.flash("success", "You have been logged out");
            res.redirect("/listings");
        }
    });
};
