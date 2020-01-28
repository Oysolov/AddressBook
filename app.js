const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
const table = document.getElementById('addressBookTable');
const recordsPerPage = 4;
let currentPage = 1;
let contacts = [];
fetchAddressBookRecords();

function fetchAddressBookRecords() {
    fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            contacts = data.contacts;
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
    createPagination(contacts.length);
}

function fillTable(currentPage) {
    const firstRecordOfCurrentPage = (currentPage - 1) * recordsPerPage;
    contacts.slice(firstRecordOfCurrentPage, firstRecordOfCurrentPage + recordsPerPage)
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
