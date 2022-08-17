// book class: represent book
class Book {
    constructor(title, author, pages, isbn, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isbn = isbn;
        this.read = read;

    }
}

// ui class: handle ui task
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="read">${book.read}</a></td>
            <td><a href="#" class="delete">✖</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.book-form');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#pages').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#read').value = 'Read';
    }

    static changeReadStatus(el) {
        if(el.innerHTML === 'Read') {
            el.innerHTML = 'Not read';
        } else if(el.innerHTML === 'Not read'){
            el.innerHTML = 'Read';
        }
    }
}

// store class: handle storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static toggleReadStatus(isbn) {
        const books = Store.getBooks();

        books.forEach((book) => {
            if(book.isbn === isbn) {
                if(book.read === "Read") {
                    book.read = "Not read";
                } else if(book.read === "Not read") {
                    book.read = "Read";
                }
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
};

// event class: display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// event class: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // prevent default submit function
    e.preventDefault();
    
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const isbn = document.querySelector('#isbn').value;
    const read = document.querySelector('#read').value;
    
    // validate
    if(title === '' || author === '' || pages === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }   else {

        // instantiate book
        const book = new Book(title, author, pages, isbn, read);
    
        // add book to ui
        UI.addBookToList(book);
    
        // add book to store
        Store.addBook(book);

        // show success message
        UI.showAlert('Book added', 'success');

        // clear fields
        UI.clearFields();
    }
});

// event class: remove a book or change read status
document.querySelector('#book-list').addEventListener('click', (e) => {
    // validate for delete
    if(e.target.classList.contains('delete')) {

        // remove book from UI
        UI.deleteBook(e.target);


        // remove book from store
        Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

        // show success message
        UI.showAlert('Book removed', 'success');
        
        // validate for change read status
    } else if(e.target.classList.contains('read')) {

        // change read status in UI
        UI.changeReadStatus(e.target);

        // change read status in store
        Store.toggleReadStatus(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    }
});