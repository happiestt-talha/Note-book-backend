const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middlewares/fetchUser');
const Note = require('../models/Note');

// GET /api/notes
router.get('/getnote', fetchUser, async (req, res) => {
    try {
        // res.json({reqUser:req.user})
        const userNotes = await Note.find({ user: req.user._id });
        res.json({reqUser:req.user,userNotes});
        // res.json(userNotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// POST /api/notes
router.post('/addnote', fetchUser, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // res.json({reqUser:req.user})
    const { title, description, tag } = req.body;
    try {
        const newNote = new Note({
            user: req.user._id,
            title,
            description,
            tag
        });
        const savedNote = await newNote.save();
        res.json({reqUser:req.user,savedNote});
        // res.json(savedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
