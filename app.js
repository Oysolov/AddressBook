const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
const table = document.getElementById('addressBookTable');
const recordsPerPage = 4;
var currentPage = 1;
changePage(currentPage);

function loadData(currentPage) {
    var contactsPromise = fetchAddressBookRecords();
    return contactsPromise.then(contacts => {
        var firstRecordOfCurrentPage = (currentPage - 1) * recordsPerPage;
        for(var i = firstRecordOfCurrentPage, k = i + recordsPerPage; i < k; i++) {
            if(contacts[i] !== undefined) addRecordToAddressBook(contacts[i]);            
        }
        return contacts;
    });
}

function fetchAddressBookRecords() {
    return fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.contacts;
        })
        .catch(error => {
            console.error(error);
        });
}

function addRecordToAddressBook(record) {
    var tbody = document.querySelector('.tbody');
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



function changePage(newPage) {
    currentPage = newPage;
    manageTbody();
    removePagination()
    var contactsPromise = loadData(newPage);
    contactsPromise.then(contacts => {
        createPagination(contacts.length);
    })
}

function manageTbody() {
    var oldTbody = document.querySelector('.tbody');
    var newTbody = createTbody();
    if(oldTbody !== null) {
        table.replaceChild(newTbody, oldTbody);
    } else {
        append(table, newTbody);
    }
}

function createTbody() {
    var tbody = createNode('tbody');
    tbody.classList.add('tbody');
    return tbody;
}

function removePagination() {
    let paginationDiv = document.getElementById('pagination');
    let paginationUl = document.getElementById('pagination-ul');
    if(paginationUl !== null) paginationDiv.removeChild(paginationUl);
}

function createPagination(itemsAmount) {
    var pagesNumber = Math.ceil(itemsAmount/recordsPerPage);

    let ul = createNode('ul');
    ul.setAttribute('id', 'pagination-ul');

    if(currentPage !== 1) append(ul, createPreviousPageElement());
    for(var i = 1; i <= pagesNumber; i++) {
        append(ul, createPageElement(i));
    }

    if(currentPage !== pagesNumber) append(ul, createNextPageElement());
    
    let paginationDiv = document.getElementById('pagination');
    append(paginationDiv, ul);
}

//Can merge them in one function?
function createPreviousPageElement() {
    let li = createNode('li');
    li.classList.add('page-item');
    li.classList.add('previous');
    li.classList.add('no');

    let a = createNode('a');
    a.onclick = function() {  changePage(currentPage - 1) };
    a.textContent = '<';

    append(li, a);
    return li;
}

function createNextPageElement() {
    let li = createNode('li');
    li.classList.add('page-item');
    li.classList.add('next');
    li.classList.add('no');

    let a = createNode('a');
    a.onclick = function() {  changePage(currentPage + 1) };
    a.textContent = '>';

    append(li,a);
    return li;
}

function createPageElement(pageNumber) {
    let li = createNode('li');
    li.classList.add('page-item');
    if(pageNumber === currentPage) li.classList.add('active');
    
    let a = createNode('a');
    a.onclick = function() {  changePage(pageNumber) };
    
    a.textContent = pageNumber;

    append(li, a);
    return li;
}