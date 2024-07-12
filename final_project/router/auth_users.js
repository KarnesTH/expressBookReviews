const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const matches = users.filter((user) => user.username === username);
    return matches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const matchUsers = users.filter((user) => user.username === username && user.password === password);
    return matchUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const review = req.body.review;
  const userName = req.session.authorization.username;

  if (books[ISBN]) {
    let book = books[ISBN];
    book.reviews[userName] = review;
    return res.status(200).send("Review successfully posted.");
  } else {
    return res.status(404).json({ message: "ISBN not found!" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const userName = req.session.authorization.username;

    if (books[ISBN]) {
        let book = books[ISBN];
        delete book.reviews[userName];
        return res.status(200).send("Review successfully deleted.");
    } else {
        return res.status(404).json({ message: "ISBN not found!" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
