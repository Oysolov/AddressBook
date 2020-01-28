const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
const table = document.getElementById('addressBookTable');
const recordsPerPage = 4;
let currentPage = 1;
let contactsPromise = fetchAddressBookRecords();

function fetchAddressBookRecords() {
    return fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let contacts = data.contacts;
            loadPage(currentPage);
            return contacts;
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
    contactsPromise.then(contacts => {
        createPagination(contacts.length);
    });
    
}

function fillTable(currentPage) {
    contactsPromise.then(contacts => {
        let firstRecordOfCurrentPage = (currentPage - 1) * recordsPerPage;
        for(let i = firstRecordOfCurrentPage, k = i + recordsPerPage; i < k; i++) {
            if(contacts[i]) {
                addRecordToAddressBook(contacts[i]);
            }
        }
    });
}

function addRecordToAddressBook(record) {
    let tbody = document.getElementById('tbody');
    let tr = createNode('tr'),
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
    return parent.appendChild(element);
}

function removePagination() {
    let paginationDiv = document.getElementById('pagination');
    let paginationUl = document.getElementById('pagination-ul');
    if(paginationUl) {
        paginationDiv.removeChild(paginationUl);
    }
}


function manageTbody() {
    let oldTbody = document.getElementById('tbody');
    let newTbody = createTbody();
    if(oldTbody) {
        table.replaceChild(newTbody, oldTbody);
    } else {
        append(table, newTbody);
    }
}

function createTbody() {
    let tbody = createNode('tbody');
    tbody.setAttribute('id', 'tbody');
    return tbody;
}

function createPagination(itemsAmount) {
    let pagesNumber = Math.ceil(itemsAmount/recordsPerPage);

    let ul = createNode('ul');
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
    
    let paginationDiv = document.getElementById('pagination');
    append(paginationDiv, ul);
}

function createArrowPageElement(arrow) {
    let li = createNode('li');
    let classes = ['page-item', 'previous'];
    li.classList.add(classes);

    let a = createNode('a');
    if(arrow === 'previous') {
        a.onclick = function() { loadPage(currentPage - 1) };
        a.textContent = '<';
    } else if (arrow === 'next') {
        a.onclick = function() { loadPage(currentPage + 1) };
        a.textContent = '>';
    }
    
    append(li, a);
    return li;
}

function createNumberPageElement(pageNumber) {
    let li = createNode('li');
    li.classList.add('page-item');
    if(pageNumber === currentPage) {
        li.classList.add('active');
    }

    let a = createNode('a');
    a.onclick = function() {  loadPage(pageNumber) };
    
    a.textContent = pageNumber;

    append(li, a);
    return li;
}
