const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
const table = document.getElementById('addressBookTable');
const recordsPerPage = 4;
let currentPage = 1;
let fetchedContacts = [];
let filteredContacts = [];
fetchAddressBookRecords();

function fetchAddressBookRecords() {
    fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            fetchedContacts = data.contacts;
            filteredContacts = fetchedContacts.slice();
            loadPage(currentPage);
        })
        .catch(error => {
            console.error(error);
            //window.location.href = 'error.html';
        });
}

function loadPage(newPage) {
    currentPage = newPage;
    removePagination();
    manageTbody();
    fillTable(newPage);
    createPagination(filteredContacts.length);
}

function fillTable(currentPage) {
    const firstRecordOfCurrentPage = (currentPage - 1) * recordsPerPage;
    filteredContacts.slice(firstRecordOfCurrentPage, firstRecordOfCurrentPage + recordsPerPage)
        .forEach(addRecordToAddressBook);
}

function addRecordToAddressBook(record) {
    const tbody = document.getElementById('tbody');
    const tr = createNode('tr'),
        td1 = createNode('td'),
        td2 = createNode('td'),
        td3 = createNode('td'),
        img = createNode('img');
    img.src = record.avatar;
    img.classList.add('avatar');
    td2.textContent = record.first;
    td3.innerText = record.last;
    
    append(td1, img);
    append(tr,td1);
    append(tr,td2);
    append(tr,td3);
    append(tbody, tr)
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    parent.appendChild(element);
}

function removePagination() {
    const paginationDiv = document.getElementById('pagination');
    const paginationUl = document.getElementById('pagination-ul');
    if(paginationUl) {
        paginationDiv.removeChild(paginationUl);
    }
}

function manageTbody() {
    const oldTbody = document.getElementById('tbody');
    const newTbody = createTbody();
    if(oldTbody) {
        table.replaceChild(newTbody, oldTbody);
    } else {
        append(table, newTbody);
    }
}

function createTbody() {
    const tbody = createNode('tbody');
    tbody.setAttribute('id', 'tbody');
    return tbody;
}

function createPagination(itemsAmount) {
    const pagesNumber = Math.ceil(itemsAmount/recordsPerPage);

    const ul = createNode('ul');
    ul.setAttribute('id', 'pagination-ul');

    if(currentPage !== 1) { 
        append(ul, createArrowPageElement('previous'));
    }

    for(let i = 1; i <= pagesNumber; i++) {
        append(ul, createNumberPageElement(i));
    }

    if(currentPage !== pagesNumber) {
        append(ul, createArrowPageElement('next'));
    }
    
    const paginationDiv = document.getElementById('pagination');
    append(paginationDiv, ul);
}

function createArrowPageElement(arrow) {
    const li = createNode('li');
    const classes = ['page-item', 'previous'];
    li.classList.add(classes);

    const button = createNode('button');
    if(arrow === 'previous') {
        button.addEventListener('click', function() { 
            loadPage(currentPage - 1);
        });
        button.textContent = '<';
    } else if (arrow === 'next') {
        button.addEventListener('click', function() {
            loadPage(currentPage + 1);
        })
        button.textContent = '>';
    }
    
    append(li, button);
    return li;
}

function createNumberPageElement(pageNumber) {
    const li = createNode('li');
    li.classList.add('page-item');
    if(pageNumber === currentPage) {
        li.classList.add('active');
    }

    const button = createNode('button');
    button.addEventListener('click', function() {
        loadPage(pageNumber);
    })
    
    button.textContent = pageNumber;

    append(li, button);
    return li;
}

/* SEARCH */

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', search);

function search() {
    const searchedWords = searchInput.value.toLowerCase()
        .split(' ')
        .filter(word => word);
    if(searchedWords.length > 1) {
        twoWordsSearch(searchedWords);
    } else {
        oneWordSearch(searchedWords);
    }

    filteredContacts.length === 0 ? emptyTable() : loadPage(1);
};

function oneWordSearch(searchedValue) {
    filteredContacts = fetchedContacts.filter(contact => 
        contact.first.toLowerCase().match(searchedValue) || contact.last.toLowerCase().match(searchedValue));
}

function twoWordsSearch(searchedWords) {
    filteredContacts = fetchedContacts.filter(contact =>
        contact.first.toLowerCase().match(searchedWords[0]) &&
        contact.last.toLowerCase().match(searchedWords[1]));
}

function emptyTable() {
    removePagination();
    createPagination(1);
    manageTbody();
    const tbody = document.getElementById('tbody');
    const tr = createNode('tr'),
        td = createNode('td');
    td.setAttribute('colspan', '3');   
    td.textContent = 'Results were not found';
    td.classList.add('empty');


    append(tr,td);
    append(tbody, tr)
}

/* SORT */

const firstNameTh = document.getElementById('firstNameTh');
const lastNameTh = document.getElementById('lastNameTh');
firstNameTh.addEventListener('click', sort);
lastNameTh.addEventListener('click', sort);

const ascClassName = 'headerSortAsc';
const descClassName = 'headerSortDesc';

function sort(event) {
    const targetClassList = event.target.classList;
    const targetId = event.target.id;

    if(!targetClassList.contains(ascClassName)) {
        columnsInitialState();
        ascSort(targetId, targetClassList);
    } else {
        columnsInitialState();
        descSort(targetClassList);
    }
    search();
    filteredContacts.length === 0 ? emptyTable() : loadPage(1);
}

function ascSort(targetId, targetClassList) {
    
    if(targetId === "firstNameTh") {
        fetchedContacts.sort(sortFirstName);
    } else if(targetId === "lastNameTh") {
        fetchedContacts.sort(sortLastName);
    }

    targetClassList.add(ascClassName);
}

function descSort(targetClassList) {
    fetchedContacts.reverse();
    targetClassList.add(descClassName);
}

function sortFirstName(contact1, contact2) {
    return (contact1.first > contact2.first) ? 1 : -1;
}

function sortLastName(contact1, contact2) {
    return (contact1.last > contact2.last) ? 1 : -1;
}

function columnsInitialState() {
    const firstNameThClassList = firstNameTh.classList;
    const lastNameThClassList = lastNameTh.classList;

    if(firstNameThClassList.contains(ascClassName)) firstNameThClassList.remove(ascClassName);
    if(firstNameThClassList.contains(descClassName)) firstNameThClassList.remove(descClassName);
    if(lastNameThClassList.contains(ascClassName)) lastNameThClassList.remove(ascClassName);
    if(lastNameThClassList.contains(descClassName)) lastNameThClassList.remove(descClassName);
}

