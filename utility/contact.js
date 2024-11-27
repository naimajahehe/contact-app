// const readline = require('readline'); // core modul "Readline"
const fs = require('fs');// core modul "File System"

// mengecek apakah contacts.json sudah ada atau belum
if(!fs.existsSync('contacts.json')){
    fs.writeFileSync('contacts.json','[]','utf-8');// jika belum maka dibuatkan contacts.json
};

// load contact
const loadContact = () => {
    const file = fs.readFileSync('contacts.json','utf-8'); // membaca file json
    const contacts = JSON.parse(file); // mengubah string menjadi json
    return contacts;
}

// cari contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find(contact => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('contacts.json', JSON.stringify(contacts));
}

// menambahkan data contact baru ke dalam array
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

// cek nama yang duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
}

// menghapus contact
const deleteContact = (nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact)=>contact.nama !== nama);
    saveContacts(filteredContacts);
}

// mengubah contacts 
const updateContact = (contactBaru) => {
    const contacts = loadContact();
    // hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}

module.exports = {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContact};