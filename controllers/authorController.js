const { body, validationResult } = require('express-validator')

const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

exports.author_list = asyncHandler(async (req, res) => {
    const allAuthors = await Author.find().sort({family_name: 1}).exec();
    res.render('author_list', {
        title: 'Author List',
        author_list: allAuthors
    })
});

exports.author_detail = asyncHandler(async (req, res) => {
    const [
        author,
        allBooksByAuthor
    ] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}).exec(),
    ])

    if(author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
    }

    res.render('author_detail', {
        title: 'Author Detail',
        author: author,
        author_books: allBooksByAuthor
    })
});

exports.author_create_get = asyncHandler(async (req, res) => {
    res.render('author_form', { title: 'Create Author' });
});

exports.author_create_post = [
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.'),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Family name must be specified.'),
    body('date_of_birth', 'Invalid date of birth')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        })

        if(!errors.isEmpty()) {
            res.render('author_form', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array()
            })
            return;
        } else {
            const authorExists = await Author.findOne({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            })
            if(authorExists){
                res.redirect(authorExists.url);
            } else {
                await author.save();
                res.redirect(author.url);
            }
        }
    })
];

exports.author_delete_get = asyncHandler(async (req, res) => {
    res.send("Not implemented: Author delete GET");
});

exports.author_delete_post = asyncHandler(async (req, res) => {
    res.send("Not implemented: Author delete POST");
});

exports.author_update_get = asyncHandler(async (req, res) => {
    res.send("Not implemented: Author update GET");
});

exports.author_update_post = asyncHandler(async (req, res) => {
    res.send("Not implemented: Author update POST");
});