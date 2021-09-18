const main = document.querySelector('main');
const libCtn = document.getElementById('lib-ctn');
const addBtn = document.getElementById('add-btn');
const addForm = document.getElementById('add-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');
const readInput = document.getElementById('read');
const confirmBtn = document.getElementById('confirm-btn');

let myLibrary = [];

function Book(title = '', author = '', pages = 0, read = 'false') {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;    
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function displayAllBooks() {
    libCtn.replaceChildren('');
    updateLibrary();
    let fragment = new DocumentFragment();
    for (let i = 0; i <  myLibrary.length; i++) {
        //------------------

        //create DOM elements
        let divCtn = document.createElement('div');
        let divTitle = document.createElement('div');
        let divAuthor = document.createElement('div');
        let divPages = document.createElement('div');
        let divBtn = document.createElement('div');
        let btnRead = document.createElement('button');
        let btnRmv = document.createElement('button');
        //-----------

        //add DOM content
        btnRmv.addEventListener('click', btnRmvClickEvent);
        divTitle.textContent = myLibrary[i].title;
        divAuthor.textContent = myLibrary[i].author;
        divPages.textContent = myLibrary[i].pages + ' pages';
        btnRead.addEventListener('click', togRead);
        if (myLibrary[i].read === 'true') {
            btnRead.read = 'true';
            btnRead.textContent = '✓';
            btnRead.classList.add('read');
        }
            else {
                btnRead.read = false;
                btnRead.textContent = '✗';
                btnRead.classList.add('not-read');
            }
        btnRmv.textContent = 'X';
        //----------------------

        //style DOM
        divTitle.classList.add('div-title');
        divAuthor.classList.add('div-author');
        divBtn.classList.add('div-btn');
        divPages.classList.add('div-pages');
        btnRead.classList.add('read-btn');
        divCtn.classList.add('book-ctn');
        btnRmv.classList.add('rmv-btn');
        
        //----------
        
        //append DOM
        divBtn.appendChild(btnRead);
        divCtn.appendChild(btnRmv);
        divCtn.appendChild(divTitle);
        divCtn.appendChild(divAuthor);
        divCtn.appendChild(divPages);
        divCtn.appendChild(divBtn);
        //-----------

        //append fragment
        fragment.appendChild(divCtn); 
    }
    libCtn.appendChild(fragment);
}

function indexInClass(collection, node) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] === node)
        return i;
    }
    return -1;
  }

function togRead(e) {
    let bookId = indexInClass(document.querySelectorAll('.read-btn'), e.target);
    if (myLibrary[bookId].read === 'false') {
        myLibrary[bookId].read = 'true';
        e.target.textContent = '✓';
        e.target.classList.remove('not-read')
        e.target.classList.add('read');
    }
        else {
            myLibrary[bookId].read = 'false';
            e.target.textContent = '✗';
            e.target.classList.remove('read')
            e.target.classList.add('not-read');
        }
    populateStorage();
}

function addBtnClickEvent() {
    titleInput.value = '';
    authorInput.value = '';
    pagesInput.value = '1';
    main.classList.add('darken');
    addForm.classList.add('active');
}

function confirmBtnClickEvent() {
    if(titleInput.value === "" || authorInput.value === "" || pagesInput.value === "") return;
    let newBook = new Book(titleInput.value, authorInput.value, pagesInput.value, readInput.checked ? true : false);
    addBookToLibrary(newBook);
    main.classList.remove('darken');
    addForm.classList.remove('active');
    populateStorage();
}

function btnRmvClickEvent(e) {
    let booksCtn = document.querySelectorAll('.book-ctn');
    let bookId = indexInClass(document.querySelectorAll('.rmv-btn'), e.target);
    booksCtn[bookId].addEventListener('transitionend', () => {myLibrary.splice(bookId, 1); populateStorage();});
    booksCtn[bookId].classList.add('fade-out');
}

function populateStorage() {
    localStorage.clear();
    for (let i = 0; i < myLibrary.length; i++) {
        localStorage.setItem(`book${i}Title`, myLibrary[i].title);
        localStorage.setItem(`book${i}Author`, myLibrary[i].author);
        localStorage.setItem(`book${i}Pages`, myLibrary[i].pages);
        localStorage.setItem(`book${i}Read`, myLibrary[i].read);
    }
    displayAllBooks();
}

function updateLibrary() {
    myLibrary = [];
    for (let i = 0; i < localStorage.length / 4; i++) {
        let title = localStorage.getItem(`book${i}Title`);
        let author = localStorage.getItem(`book${i}Author`);
        let pages = localStorage.getItem(`book${i}Pages`);
        let read = localStorage.getItem(`book${i}Read`);
        myLibrary[i] = new Book(title, author, pages, read);
    }
}

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
addBookToLibrary(theHobbit);

if(localStorage.length === 0) {
    populateStorage();
  } else {
    displayAllBooks();
  }
  
addBtn.addEventListener('click', addBtnClickEvent);
confirmBtn.addEventListener('click', confirmBtnClickEvent);
