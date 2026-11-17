const express = require('express');

const app = express();

app.use(express.json());

let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

function validateBook(data) {
    return data &&
        typeof data.title === "string" &&
        data.title.trim() !== "" &&
        typeof data.author === "string" &&
        data.author.trim() !== "" &&
        typeof data.genre === "string" &&
        data.genre.trim() !== "" &&
        typeof data.publishedYear === "number" &&
        Number.isFinite(data.publishedYear) &&
        typeof data.available === "boolean";
}

app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

app.get('/api/books/filter', (req, res) => {

    const author = req.query.author;

    if (!author || !author.trim()) {
        return res.status(400).json({
            message: "Author query parameter is required"
        });
    }

    const result = books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
    );

    res.status(200).json(result);
});

app.post('/api/books', (req, res) => {

    const { title, author, genre, publishedYear, available } = req.body;

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data. All fields are required."
        });
    }

    const newBook = {
        id: Math.max(0, ...books.map(book => book.id)) + 1,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

app.get('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

app.put('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    const updatedBook = {
        id: id,
        ...req.body
    };

    books[index] = updatedBook;

    res.status(200).json(updatedBook);
});

app.delete('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
