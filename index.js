var avatarInput = document.getElementById('avatarInput');
var avatarPreviewContainer = document.getElementById('avatarPreview');
var avatarBase64Input = document.getElementById('avatarBase64');

var fullNameInput = document.getElementById('fNameInput');
var phoneInput = document.getElementById('phoneInput');
var emailInput = document.getElementById('emailInput');
var addressInput = document.getElementById('AddressInput');
var groupInput = document.getElementById('contactGroupInput');
var notesInput = document.getElementById('contactNotesInput');

var favCheckbox = document.getElementById('favCheck');
var emCheckbox = document.getElementById('emCheck');

var addContactBtn = document.getElementById('addContact');
var searchInput = document.getElementById('searchInput');

var contactModalElement = document.getElementById('addContactModal');
var contactModalInstance = new bootstrap.Modal(contactModalElement);

var contacts = [];
var currentIndex = null;
var duplicatePhoneFullName = '';

if (localStorage.getItem("contactContainer") !== null) {
    contacts = JSON.parse(localStorage.getItem("contactContainer"));
    displayContact();
}

function mainIcon(fullName) {
    var name = typeof fullName === 'string' ? fullName.trim() : '';
    if (!name) return '';
    var nameParts = name.split(' ');
    var firstInitial = nameParts[0]?.[0] || '';
    var lastInitial = '';
    if (nameParts.length > 1) {
        var lastName = nameParts[nameParts.length - 1];
        lastInitial = lastName?.[0] || '';
    }
    return (firstInitial + lastInitial).toUpperCase();
}

function validationFullname() {
    var regex = /^[A-Za-z ]{2,50}$/;
    if (regex.test(fullNameInput.value)) {
        fullNameInput.classList.remove('not-valid');
        document.getElementById('contactNameError').classList.add('d-none');
        return true;
    } else {
        fullNameInput.classList.add('not-valid');
        document.getElementById('contactNameError').classList.remove('d-none');
        return false;
    }
}

function validationPhone() {
    var regex = /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/;
    if (regex.test(phoneInput.value)) {
        phoneInput.classList.remove('not-valid');
        document.getElementById('contactPhoneError').classList.add('d-none');
        return true;
    } else {
        phoneInput.classList.add('not-valid');
        document.getElementById('contactPhoneError').classList.remove('d-none');
        return false;
    }
}

function validationEmail() {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailInput.value === "" || regex.test(emailInput.value)) {
        emailInput.classList.remove('not-valid');
        document.getElementById('contactEmailError').classList.add('d-none');
        return true;
    } else {
        emailInput.classList.add('not-valid');
        document.getElementById('contactEmailError').classList.remove('d-none');
        return false;
    }
}

function validationRepeatPhone(phone) {
    if (contacts.length == 0) return true;
    for (var i = 0; i < contacts.length; i++) {
        if (currentIndex !== null && i === currentIndex) continue;
        if (contacts[i].phone == phone) {
            duplicatePhoneFullName = contacts[i].fullName;
            return false;
        }
    }
    return true;
}

function clearForm() {
    avatarInput.value = null;
    avatarBase64Input.value = "";
    avatarPreviewContainer.innerHTML = `<i class="fa-solid fa-user"></i>`;
    fullNameInput.value = null;
    phoneInput.value = null;
    emailInput.value = null;
    addressInput.value = null;
    groupInput.value = "";
    notesInput.value = null;
    favCheckbox.checked = false;
    emCheckbox.checked = false;
}

function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            avatarPreviewContainer.innerHTML = `<img class="w-100 h-100 rounded-circle object-fit-cover" src="${e.target.result}" alt="Avatar">`;
            avatarBase64Input.value = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function displayContact() {
    var contactHTML = '';
    var favContactHTML = '';
    var emContactHTML = '';
    var favCount = 0;
    var emCount = 0;

    var contactGrid = document.getElementById('contact-grid');
    var favListGroup = document.getElementById('fav-list-group');
    var emListGroup = document.getElementById('em-list-group');

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].fav) favCount++;
        if (contacts[i].em) emCount++;

        var term = (searchInput.value || "").toLowerCase();
        var name = (contacts[i].fullName || "").toLowerCase();
        var phone = (contacts[i].phone || "");
        var email = (contacts[i].email || "").toLowerCase();

        if (name.includes(term) || phone.includes(term) || email.includes(term)) {
            var imgTag = contacts[i].image
                ? `<img class="main-icon object-fit-cover" src="${contacts[i].image}" alt="">`
                : mainIcon(contacts[i].fullName);

            contactHTML += `
            <div class="col">
                <div class="inner">
                    <div class="card mb-3 bg-white d-flex flex-column">
                        <div class="card-body d-flex flex-column gap-2">
                            <div class="d-flex align-items-center gap-3">
                                <div class="position-relative flex-shrink-0">
                                    <div class="main-icon d-flex align-items-center justify-content-center text-white fw-semibold">${imgTag}</div>
                                    <div class="em-icon position-absolute rounded-circle d-flex align-items-center justify-content-center ${!contacts[i].em ? 'd-none' : ''}"><i class="fa-solid fa-heart-pulse text-white"></i></div>
                                    <div class="fav-icon position-absolute rounded-circle d-flex align-items-center justify-content-center ${!contacts[i].fav ? 'd-none' : ''}"><i class="fa-solid fa-star text-white"></i></div>
                                </div>
                                <div style="min-width: 0;">
                                    <h3 class="fw-semibold text-gray-900 text-base text-truncate m-0">${contacts[i].fullName}</h3>
                                    <div class="contact-phone d-flex align-items-center gap-2 mt-1"><div class="icon bg-blue-100 d-flex align-items-center justify-content-center flex-shrink-0"><i class="fa fa-phone"></i></div><span class="text-truncate">${contacts[i].phone}</span></div>
                                </div>
                            </div>
                            <div class="contact-email d-flex align-items-center gap-2 mt-1"><div class="icon bg-blue-100 d-flex align-items-center justify-content-center flex-shrink-0"><i class="fa fa-envelope"></i></div><span class="text-truncate">${contacts[i].email}</span></div>
                            <div class="contact-address d-flex align-items-center gap-2 mt-1"><div class="icon bg-blue-100 d-flex align-items-center justify-content-center flex-shrink-0"><i class="fa fa-location-dot"></i></div><span class="text-truncate">${contacts[i].address}</span></div>
                            <div class="d-flex flex-wrap gap-2 mt-2">
                                <span class="${contacts[i].group == '' ? 'd-none' : ''} card-badge ${contacts[i].group}-badge d-inline-flex align-items-center fw-medium">${contacts[i].group}</span>
                                <span class="card-badge em-badge d-inline-flex align-items-center fw-medium ${!contacts[i].em ? 'd-none' : ''}"><i class="fa-solid fa-heart-pulse me-1"></i>emergency</span>
                            </div>
                        </div>
                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <div class="f-contact d-flex align-items-center gap-1">
                                <a href="tel:${contacts[i].phone}" class="f-contact-phone d-flex align-items-center justify-content-center"><i class="fa fa-phone"></i></a>
                                <a href="mailto:${contacts[i].email}" class="f-contact-email d-flex align-items-center justify-content-center"><i class="fa fa-envelope"></i></a>
                            </div>
                            <div class="f-control d-flex align-items-center gap-1">
                                <div onclick="favTgl(${i})" class="${contacts[i].fav ? 'f-control-fav-clk' : 'f-control-fav'} d-flex align-items-center justify-content-center"><i class="fa${contacts[i].fav ? '' : '-regular'} fa-star"></i></div>
                                <div onclick="emTgl(${i})" class="${contacts[i].em ? 'f-control-em-clk' : 'f-control-em'} d-flex align-items-center justify-content-center"><i class="fa${contacts[i].em ? '' : '-regular'} fa-heart${contacts[i].em ? '-pulse' : ''}"></i></div>
                                <div class="f-control-update d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#addContactModal" onclick="setUpdateInfo(${i})"><i class="fa fa-pen"></i></div>
                                <div class="f-control-del d-flex align-items-center justify-content-center" onclick="deleteContact(${i})"><i class="fa fa-trash"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            var item = `<div class="col-12 col-sm-6 col-xl-12 mb-2"><li class="list-group-item border-0 d-flex align-items-center justify-content-between gap-3"><div class="icon d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0">${contacts[i].image ? `<img class="icon object-fit-cover" src="${contacts[i].image}" alt="">` : mainIcon(contacts[i].fullName)}</div><div class="flex-shrink-1 w-100" style="min-width: 0;"><h4 class="m-0 text-truncate fw-medium">${contacts[i].fullName}</h4><p class="m-0 text-truncate">${contacts[i].phone}</p></div><a href="tel:${contacts[i].phone}" class="f-contact-phone flex-shrink-0 d-flex align-items-center justify-content-center"><i class="fa fa-phone"></i></a></li></div>`;
            if (contacts[i].fav) favContactHTML += item;
            if (contacts[i].em) emContactHTML += item;
        }
    }

    if (contactHTML == '') contactGrid.innerHTML = `<div class="no-contact w-100 d-flex align-items-center justify-content-center"><div class="inner"><div class="icon d-flex align-items-center justify-content-center mx-auto mb-4"><i class="fa fa-address-book"></i></div><p class="m-0 fw-medium text-center">No contacts found</p><p class="mt-1 text-center">Click "Add Contact" to get started</p></div></div>`;
    else contactGrid.innerHTML = contactHTML;

    favListGroup.innerHTML = favContactHTML || `<div class="empty d-flex align-items-center justify-content-center"><p>No favorites yet</p></div>`;
    emListGroup.innerHTML = emContactHTML || `<div class="empty d-flex align-items-center justify-content-center"><p>No emergency contacts</p></div>`;

    document.getElementById('stateTotal').innerHTML = contacts.length;
    document.getElementById('stateFav').innerHTML = favCount;
    document.getElementById('stateEm').innerHTML = emCount;
}

function setUpdateInfo(index) {
    currentIndex = index;
    if (contacts[index].image) {
        avatarPreviewContainer.innerHTML = `<img class="w-100 h-100 rounded-circle object-fit-cover" src="${contacts[index].image}" alt="">`;
        avatarBase64Input.value = contacts[index].image;
    } else {
        avatarPreviewContainer.innerHTML = `<i class="fa-solid fa-user"></i>`;
        avatarBase64Input.value = "";
    }
    fullNameInput.value = contacts[index].fullName;
    phoneInput.value = contacts[index].phone;
    emailInput.value = contacts[index].email;
    addressInput.value = contacts[index].address;
    groupInput.value = contacts[index].group;
    notesInput.value = contacts[index].notes;
    favCheckbox.checked = contacts[index].fav;
    emCheckbox.checked = contacts[index].em;
}

function addContact() {
    if (validationFullname() && validationPhone() && validationRepeatPhone(phoneInput.value) && validationEmail()) {
        var contact = {
            image: avatarBase64Input.value !== "" ? avatarBase64Input.value : null,
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value,
            email: emailInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value.trim(),
            fav: favCheckbox.checked,
            em: emCheckbox.checked
        };
        contacts.push(contact);
        localStorage.setItem("contactContainer", JSON.stringify(contacts));
        Swal.fire({ title: "Added!", text: "Contact has been added successfully", icon: "success", showConfirmButton: false, timer: 1500 });
        displayContact();
        clearForm();
        contactModalInstance.hide();
    }
}

function updateContact() {
    if (validationFullname() && validationPhone() && validationEmail()) {
        var contact = {
            image: avatarBase64Input.value !== "" ? avatarBase64Input.value : contacts[currentIndex].image,
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value,
            email: emailInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value.trim(),
            fav: favCheckbox.checked,
            em: emCheckbox.checked
        };
        contacts.splice(currentIndex, 1, contact);
        localStorage.setItem("contactContainer", JSON.stringify(contacts));
        Swal.fire({ title: "Updated!", text: "Contact updated successfully", icon: "success", showConfirmButton: false, timer: 1500 });
        displayContact();
        clearForm();
        contactModalInstance.hide();
        currentIndex = null;
    }
}

window.deleteContact = function(index) {
    Swal.fire({
        title: "Delete Contact?",
        text: `Delete ${contacts[index].fullName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            contacts.splice(index, 1);
            localStorage.setItem("contactContainer", JSON.stringify(contacts));
            Swal.fire({ title: "Deleted!", icon: "success", showConfirmButton: false, timer: 1500 });
            displayContact();
        }
    });
}

window.favTgl = function(index) {
    contacts[index].fav = !contacts[index].fav;
    localStorage.setItem("contactContainer", JSON.stringify(contacts));
    displayContact();
}

window.emTgl = function(index) {
    contacts[index].em = !contacts[index].em;
    localStorage.setItem("contactContainer", JSON.stringify(contacts));
    displayContact();
}

addContactBtn.addEventListener('click', function() {
    currentIndex === null ? addContact() : updateContact();
});

contactModalElement.addEventListener('hidden.bs.modal', function() {
    currentIndex = null;
    clearForm();
    fullNameInput.classList.remove('not-valid');
    phoneInput.classList.remove('not-valid');
    emailInput.classList.remove('not-valid');
    document.querySelectorAll('.text-danger').forEach(function(el) {
        el.classList.add('d-none');
    });
});
