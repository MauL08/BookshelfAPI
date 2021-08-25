const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const id = nanoid();
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Check Error (No Name Problem)
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });

        response.code(400);
        return response;
    }

    // Check Error (readPage Problem)
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);
        return response;
    }

    const saveBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    bookshelf.push(saveBook);

    // Success add Book
    const success = bookshelf.filter((book) => book.id === id).length > 0;
    if (success) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });
        
        response.code(201);
        return response;
    }

     // Totally Failed
    const response = h.response({
        status: 'error',
        message: 'Catatan gagal ditambahkan'
    });

    response.code(500);
    return response;
};

const getAllBooks = (request, h) => {
    const books = bookshelf.map((book) => (
        {
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }
    ))
    
    const response = h.response({
        status: 'success',
        data: { books }
    })

    response.code(200);
    return response;
}

const getBook = (request, h) => {
    const { bookId } = request.params;

    const book = bookshelf.filter((val) => val.id === bookId)[0];

    if (book) {
        return {
            status: 'success',
            data: { book }
        }
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });

    response.code(404);
    return response;
};

const updateBook = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    // Check Error (No Name Problem)
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });

        response.code(400);
        return response;
    }

    // Check Error (readPage Problem)
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);
        return response;
    }

    // Success update Book
    const index = bookshelf.findIndex((book) => book.id === bookId);

    if (index > -1) {
        bookshelf[index] = {
            ...bookshelf[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })

        response.code(200);
        return response;
    }

    // Totally Failed
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })

    response.code(404);
    return response;
}

const deleteBook = (request, h) => {
    const { bookId } = request.params;

    const index = bookshelf.findIndex((book) => book.id === bookId);

    if (index > -1) {
        bookshelf.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })

    response.code(404);
    return response;
}

module.exports = { addBook, getAllBooks, getBook, updateBook, deleteBook };