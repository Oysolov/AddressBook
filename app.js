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
            contacts.forEach(element => {
                addRecordToAddressBook(element);
            });
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
