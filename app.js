const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
const table = document.getElementById('addressBookTable');
fetchAddressBookRecords();

function fetchAddressBookRecords() {
    fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            manageTbody();
            var contacts = data.contacts;

            for(var i = 0, k = i + recordsPerPage; i < k; i++) {
                addRecordToAddressBook(contacts[i]);
            }
            /*contacts.forEach(element => {
                addRecordToAddressBook(element);
            });*/
            createPagination(contacts.length);
        })
        .catch(error => {
            console.error(error);
        })
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

function createTbody() {
    var tbody = createNode('tbody');
    tbody.classList.add('tbody');
    return tbody;
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
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





/////////////Pagination



function changePage(page) {
    removePagination()
    fetchAddressBookRecords();

}

function createPagination(itemsAmount) {
    var pagesNumber = Math.ceil(itemsAmount/recordsPerPage);

    let ul = createNode('ul');
    ul.setAttribute('id', 'pagination-ul');

    append(ul, createNextPageElement());
    for(var i = 1; i <= pagesNumber; i++) {
        append(ul, createPageElement(i));
    }
    append(ul, createPreviousPageElement());

    let paginationDiv = document.getElementById('pagination');
    append(paginationDiv, ul);
}

//Care if removing without existing
function removePagination() {
    let paginationDiv = document.getElementById('pagination');
    let paginationUl = document.getElementById('pagination-ul');
    paginationDiv.removeChild(paginationUl);
}


//Can merge them in one function?
function createPreviousPageElement() {
    let li = createNode('li');
    li.classList.add('page-item');
    li.classList.add('previous');
    li.classList.add('no');

    let a = createNode('a');
    a.onclick = function() {  changePage() };
    a.textContent = 'Previous';

    append(li, a);
    return li;
}

function createNextPageElement() {
    let li = createNode('li');
    li.classList.add('page-item');
    li.classList.add('next');
    li.classList.add('no');

    let a = createNode('a');
    a.onclick = function() {  changePage() };
    a.textContent = 'Next';

    append(li,a);
    return li;
}

function createPageElement(pageNumber) {
    let li = createNode('li');
    li.classList.add('page-item');

    let a = createNode('a');
    a.onclick = function() {  changePage() };
    a.textContent = pageNumber;

    append(li, a);
    return li;
}