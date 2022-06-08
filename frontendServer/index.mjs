import {} from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import {Low, JSONFile} from 'lowdb';
import crypto from 'crypto';
import {} from 'ejs';

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));

//// Enable ALL CORS request
app.use(cors());
////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static('./views'));

app.set('view engine','ejs');

// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "60m"});
}

app.get("/", (req, res) =>{
	res.render("authentificationPage/Authentification");
	//res.sendFile("authentificationPage/Authentification.html", {root: '.'});
});

app.get("/admin", (req, res) =>{
	if (req.session.loggedin) {
		res.render("adminPanelPage/AdministratorPage");
	} else {
		// Not logged in
		res.redirect("/");
	}
	//res.sendFile("adminPanelPage/pageTest.html", {root: '.'});
});

app.get("/chat", (req, res) =>{
	res.render("chatPage/chatBot");
	//res.sendFile("authentificationPage/Authentification.html", {root: '.'});
});

app.post("/auth", (req, res) =>{

	console.log(req.body);
	let index = db.data.accounts.findIndex(e => e.username == req.body.username);
    //check to see if the user exists in the list of registered users
    if (index <= -1){
        res.status(400).send("User does not exist!")
    }else{
        let hash = crypto.createHash("sha256").update(req.body.password).digest("hex")
        if (hash == db.data.accounts[index].password) {
            
			req.session.loggedin = true;
			req.session.username = db.data.accounts[index].username;

			res.cookie("authorization",generateAccessToken({user: req.session.username}));
			res.redirect("/admin");
        }
        else {
        res.status(400).send("Password Incorrect!")
        }
    }
});

const adapter = new JSONFile("db.json");
const db = new Low(adapter);

db.read().then(() =>{
    db.data = db.data || { accounts: [] } //if db is null, create it.
    app.listen(process.env.PORT, () => {
        console.log(`Example app listening at http://localhost:${process.env.PORT}`);
    });
});