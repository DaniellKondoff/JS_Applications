/**
 * Created by Kondoff on 03-Dec-16.
 */
function attachEvents() {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContacts);

    let baseURL='https://phonebook-nakov.firebaseio.com/phonebook'

    function loadContacts() {
        $('#phonebook').empty();
        $.ajax({
            method:'GET',
            url:baseURL +'.json'
        })
            .then(displayContacts)
            .catch(displayError)
    }
    function displayError(err) {
            $('#phonebook').text('Error')
    }
    function displayContacts(contacts) {
        let keys=Object.keys(contacts);
        for(let key of keys){
            let person=contacts[key].person;
            let phone=contacts[key].phone;
            let contact=person+': '+phone+' ';
            let li=($('<li>'));
            li.append(contact)
            $('#phonebook').append(li);
            li.append($('<button>Delete</button>').click(function () {
                deleteContact(key)
            }))
        }
    }

    function deleteContact(key) {
        $.ajax({
            method:"DELETE",
            url:baseURL+'/'+key+'.json'
        })
            .then(loadContacts)
            .catch(displayError)
    }



    function createContacts() {
        let person=$('#person').val();
        let phone=$('#phone').val();
        let contactData={person,phone};
        $.ajax({
            method:'POST',
            url:baseURL +'.json',
            data:JSON.stringify(contactData)
        })
            .then(loadContacts)
            .catch(displayError)
        $('#person').val('');
        $('#phone').val('')
    }
}