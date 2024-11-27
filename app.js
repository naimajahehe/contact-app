const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {updateContact, deleteContact, loadContact, findContact, addContact, cekDuplikat} = require('./utility/contact');
const {body, validationResult,check, cookie} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

//gunakan ejs
app.set('view engine', 'ejs')

//third-party middleware
app.use(expressLayouts);

// built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));

//konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
    cookie : { maxAge : 6000 },
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
}));
app.use(flash());


app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama : "Muhammad Naim",
            email : "naimmnaim123@gmail.com"
        },
        {
            nama : "Ninda Sintawati",
            email : "nindasintawati@gmail.com"
        }
    ]

    res.render('index', {
        layout : 'layouts/main-layout',
        nama : "Muhammad Naim",
        title : "Halaman Home",
        mahasiswa,
    })
});

app.get('/about', (req,res) => {
    res.render('about', {
        layout : 'layouts/main-layout',
        title : 'Halaman About',
    })
});

app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact', {
        layout : 'layouts/main-layout',
        title : 'Halaman Contact',
        contacts,
        msg : req.flash('msg'),
    })
});

// halaman form tambah data contact
app.get('/contact/add',(req, res) => {
    res.render('add-contact', {
        title : 'Form tambah data contact',
        layout : 'layouts/main-layout'
    })
})

// process data contact
app.post(
    '/contact', 
    [
        body('nama').custom((value) => {
            const duplikat = cekDuplikat(value);
            if (duplikat) {
                throw new Error('Nama contact sudah digunakan');
            }
            return true;
        }),
        check('email','Email tidak valid!').isEmail(),
        check('nomorHP','nomor HP tidak valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array(),});
        res.render('add-contact', {
            title : 'Form Tambah Data Contact',
            layout : 'layouts/main-layout',
            errors: errors.array(),
        })
    } else {
        addContact(req.body);
        // kirimkan flash message dulu
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
    }
})

// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    //jika kontak tidak ada
    if(!contact){
        res.status(404);
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Data contact berhasil dihapus!');
        res.redirect('/contact');
    }
})

// form ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('edit-contact', {
        title: 'Mengubah Data Contact',
        layout: 'layouts/main-layout',
        contact,
    })
})

// proses ubah data
app.post(
    '/contact/update', 
    [
        body('nama').custom((value, {req}) => {
            const duplikat = cekDuplikat(value);
            if (value !== req.body.oldNama && duplikat) {
                throw new Error('Nama contact sudah digunakan');
            }
            return true;
        }),
        check('email','Email tidak valid!').isEmail(),
        check('nomorHP','nomor HP tidak valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array(),});
        res.render('edit-contact', {
            title : 'Form Edit Data Contact',
            layout : 'layouts/main-layout',
            errors : errors.array(),
            contact : req.body,
        })
    } else {
        updateContact(req.body);
        // kirimkan flash message dulu
        req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
    }
})

// halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    res.render('detail', {
        layout : 'layouts/main-layout',
        title : 'Halaman Detail Contact',
        contact,
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('Page not found');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});