
const EDIT_BTN_CLASS = 'editBtn';
const DELETE_BTN_CLASS = 'deleteBtn';
const TODO_ITEM_SELECTORE ='.contactItem';
const ADD_CONTACT_SELECTORE ='#addBtn';
const EMPTY_CONTACT = {};


const $contactsContainer = $('#contactsContainer');
const $inputs = $('input');
let contactList =[];


const dialog =$("#dialogForm").dialog({
    autoOpen:false,
    hight:400,
    width:350,
    modal:true,
    buttons:{
        "Save":() =>{
            
            const contact = getContact();

            if(!isContactValid(contact)){
                showError(newError('Контакт не валидный'));
                return;
            }

            saveContact(contact)
        },

        Cancel: function(){
            modalClose();
        }
},
close: function(){
    modalClose();
}
})
const FORM_DOM_ELEMENT = 0;
const form = $(`#dialogForm form`)[FORM_DOM_ELEMENT]

$(ADD_CONTACT_SELECTORE).on('click', onAddContactClick);
$contactsContainer
    .on('click', '.'+ DELETE_BTN_CLASS, onDeleteBtnClick)
    .on('click', '.'+ EDIT_BTN_CLASS, onEditBtnClick)

getContactList()

function onAddContactClick(){
    modalOpen(EMPTY_CONTACT)
}

function onDeleteBtnClick(e) {
    const contactEl = getContactEl(e.target);
    const id = getContactId(contactEl);

    if(id){
        contactApi.delete(id).catch(showError);
        contactEl.remove();
    }
}

function onEditBtnClick(e) {
    const contactEl = getContactEl(e.target);
    const id = getContactId(contactEl);
    const contact = getContactById(id);

    if (contact) {
        modalOpen(contact);
    }
}

function isContactValid(contact){
    return contact.firstName !== '' 
        && contact.lasstName !== '' 
        && contact.phone !== ''
        && contact.phone !== null
        && !siNan(contact.phone)
}

function getContactEl(el) {
    return el.closest(TODO_ITEM_SELECTORE);
}

function getContactId(contactEl){
    return contactEl.dataset.id;
}

function getContactList(){
    ContactApi.getList()
    .then(list => contactList = list)
    .then(renderContactList)
    .catch(showError)
}

function saveContact(contact) {
    if(contact.id) {
        ContactApi.update(contact.id, contact).catch(showError)

        const contactOld = getContactById(contact.id);
        contactOld.title = contact.tatle;

        replaceContactElById(contact.id, contact);
        clear();
    } else{
        ContactApi.Create(contact)
            .then(() => {
                addContactItem(contact)
                clear();
            })
            .catch(showError)
    }
    
}

function replaceContactElById(id, contact) {
    const $oldContactEl = $('[data-id="${id}"]');
    const newContactEl = generateContactItemHTML(contact);

    $oldContactEl.replaceWith(newContactEl);
}

function getContact(){
    const contact = EMPTY_CONTACT;

    for(const input of $inputs){
        contact[input.id] = input.value;
    }

    return contact;
}

function renderContactList(contactList) {
    $contactsContainer.html(contactList.map(generateContactItemHTML));
}

function addContactItem (contact) {
    const html = generateContactItemHTML(contact);

    $contactsContainer.append(html);
}

function generateContactItemHTML(contact) {
    return `
        <tr  class="contactItem" data-id="${contact.id}">
            <td>$(contact.firsName)</td>
            <td>$(contact.lastName)</td>
            <td>$(contact.phone)</td>
            <td>
                <button class="editBtn">[Edit]</button>
                <button class="deleteBtn">[Delete]</button>
            </td>
        </tr>
        `;
}


function showError(error) {
    alert(error.message);
}

function getContactById(id){
    return contactList.find(contact => contact.id === id)
}

function modalOpen(contact){
    fillForm(contact);
    dialog.dialog("open");
}

function fillForm(contact) {
    for(const input of $inputs){
        if (contact[input.id]) {
            input.value = contact[input.id];
        }
    }
}

function modalClose(){
    dialog.dialog("close");
    clear();
}

function clear(){
    form.reset();
}