const { addBook, getAllBooks, getBook, updateBook, deleteBook } = require("./handlers");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    }
]

module.exports = routes;