var table = document.getElementById('addressBookTable');
var loadDataBtn = document.querySelector('.load-data-btn');


loadDataBtn.addEventListener('click', fetchAddressBookRecords);

function fetchAddressBookRecords() {
    const addressBookUrl = 'http://addressbook-api.herokuapp.com/contacts';
    fetch(addressBookUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var contacts = data.contacts;
            contacts.forEach(element => {
                addRecordToAddressBook(element);
            });
        })
        .catch(error => {
            console.error(error);
        })
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

function addRecordToAddressBook(record) {
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
    append(table, tr);
}
