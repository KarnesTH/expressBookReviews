const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    return userswithsamename.length > 0;
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books), 500);
    });

    promise.then((result) => {
        return res.status(200).json({ books: result });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const ISBN = req.params.isbn;

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books[ISBN]), 500);
    });

    const book = await promise;

    if (!book) {
        return res.status(404).json({ message: "No Book found!" });
    }

    return res.status(200).json({ book });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const filteredAuthors = Object.values(books).filter((book) => book.author.toLowerCase() === author);
            resolve(filteredAuthors);
        }, 500);
    });

    const bookAuthors = await promise;

    if (bookAuthors.length == 0) {
        return res.status(404).json({ message: "Author not found!" });
    }

    return res.status(200).json({ books: bookAuthors });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const filteredTitles = Object.values(books).filter((book) => book.title.toLowerCase() === title);
            resolve(filteredTitles);
        }, 500);
    });

    const bookTitles = await promise;

    if (bookTitles.length == 0) {
        return res.status(404).json({ message: "Title not found!" });
    }

    return res.status(200).json({ books: bookTitles });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    if (!books[ISBN]) {
        return res.status(404).json({ message: "No Book found!" });
    }

    return res.status(200).json(books[ISBN].reviews);
});

module.exports.general = public_users;
