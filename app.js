var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./views/user"),
    addnew                = require("./views/new")
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")


mongoose.connect("mongodb+srv://admin:Adminjatin99@cluster0.4i7oh.mongodb.net/<dbname>?retryWrites=true&w=majority");

var app = express(); 
app.set('view engine', 'ejs'); 
app.use(express.static("public"))
// ==========login
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(require("express-session")({
            secret: "Add new employe",
            resave: false,
            saveUninitialized: false
        }));
        // ========login
        app.use(passport.initialize());
        app.use(passport.session());

            // login logout toggle
        app.use(function(req, res, next){
            res.locals.isAuthenticated=req.isAuthenticated();
            next();
          });


        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());


// ===================
app.get('/', (req, res)=>{ 
    res.render('home');     
});
app.get('/home', (req, res)=>{ 
    res.render('home');     
});
app.get('/aboutUs', (req, res)=>{ 
    res.render('aboutus');     
});
app.get('/contact', (req, res)=>{ 
    res.render('contact');     
});
app.get('/applynow', (req, res)=>{ 
    res.render('applynow');     
});

// login=============================
        app.get("/newemploye",isLoggedIn, (req, res)=>{
            res.render("newemploye"); 
        });
        app.get("/registration", (req, res)=>{
            res.render("registration"); 
        });
        //handling user sign up
        app.post("/registration", function(req, res){
            User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
                if(err){
                    console.log(err);
                    return res.render('registration');
                }
                passport.authenticate("local")(req, res, function(){
                res.redirect("/newemploye");
                });
            });
        });
        // LOGIN ROUTES
        app.get("/login", (req, res)=>{
            res.render("login"); 
        });
        //login logic
        //middleware
        app.post("/login", passport.authenticate("local", {
            successRedirect: "/newemploye",
            failureRedirect:"/login",
        }) ,(req, res)=>{
        });
        
        app.get("/logout", function(req, res){
            req.logout();
            res.redirect("/");
        });
        function isLoggedIn(req, res, next){
            if(req.isAuthenticated()){
                return next();
            }
                res.redirect("/login");
           
        }



    
// ===========add-new
            app.get("/employes", (req, res)=>{
                // Get all employes from DB
                addnew.find({}, function(err, allemployes){
                if(err){
                    console.log(err);
                } else {
                    res.render("employes",{employes:allemployes});
                }
                });
            });

                        
        //CREATE - add new employe to DB
        app.post("/employes", function(req, res){
            // get data from form and add to employes array
            var name = req.body.name;
            var email = req.body.email;
            var phone = req.body.phone;
            var age = req.body.age;
            var skills = req.body.skills;
            var edu = req.body.edu;
            var photo = req.body.photo;
            var desc = req.body.description;
            var newemploye = {name: name, email: email, phone: phone, age: age, skills: skills, edu: edu, photo: photo, description: desc}
        
            // Create a new employe and save to DB
            addnew.create(newemploye, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to employes page
                    res.redirect("/employes");
                }
            });
        });
            
        //NEW - show form to create new employe
        app.get("/newemploye", function(req, res){
            res.render("newemploye"); 
        });

                
        // SHOW - shows more info about one employe
        app.get("/employes/:id", function(req, res){
            //find the employe with provided ID
            addnew.findById(req.params.id, function(err, foundemploye){
                if(err){
                    console.log(err);
                } else {
                    //render show template with that employe
                    res.render("moreaboutemploye", {addnew: foundemploye});
                }
            });
        })
        

app.listen(4000, function(){ 
console.log('listining to port 4000') 
}); 