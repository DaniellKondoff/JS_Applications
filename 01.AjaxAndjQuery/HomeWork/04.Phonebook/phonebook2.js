function attachEvents() {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContacts);

    let baseUrl="https://phonebook-nakov.firebaseio.com/phonebook";

    function loadContacts() {
        $('#phonebook').empty();
        $.get(baseUrl + '.json')
            .then(displayContacts)
            .catch(displayError)
    }

    function displayError(err) {
        $('#phonebook').html($('<li>Error</li>'))
    }

    function displayContacts(contacts) {
        let keys=Object.keys(contacts);
        for (let key of keys){
            let person=contacts[key].person;
            let phone=contacts[key].phone;
            let contact=person+': '+phone+' ';
            let li=$('<li>');
            li.text(contact).appendTo($('#phonebook'));
            li.append($('<button>Delete</button>').click(function () {
                deleteContact(key)
            }))
        }
    }
    function deleteContact (key) {
        let deleteReq={
            method:'DELETE',
            url:baseUrl+'/'+key+'.json'
        };
        $.ajax(deleteReq)
            .then(loadContacts)
            .catch(displayError)
    }

    function createContacts() {
        let person=$('#person').val();
        let phone=$('#phone').val();
        let newContact={person,phone}
        let postReq={
            method:"POST",
            url:baseUrl+'.json',
            data:JSON.stringify(newContact)
        }
        $.ajax(postReq)
            .then(loadContacts)
            .catch(displayError)
        $('#person').val('');
        $('#phone').val('')
    }



}