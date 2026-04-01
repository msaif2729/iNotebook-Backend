const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const Notes = require('../models/Notes')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { query, body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/finduser');


router.post('/createnote', fetchuser, [
    body("title", "Enter the Title").notEmpty(),
    body("desc", "Enter the desc").notEmpty()

], async (req, res, next) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.errors = result.array();
        return next(error);
    }

    try {
        const { title, desc, tag } = req.body;
        const notes = await Notes({
            title, desc, tag, user: req.user.id
        })
        const savednotes = await notes.save()
        res.send(savednotes)

    } catch (error) {
        console.log(error)
        return next(error);
    }

});


router.get('/getall', fetchuser, async (req, res, next) => {
    try {

        const notes = await Notes.find({ user: req.user.id })
        res.send(notes)

    } catch (error) {
        console.log(error)
        return next(error);
    }

});

router.get('/getone/:id', fetchuser, async (req, res, next) => {
    try {

        const notes = await Notes.findOne({ _id:req.params.id,user: req.user.id })
        res.send(notes)

    } catch (error) {
        console.log(error)
        return next(error);
    }

});

router.delete('/deletenote/:id', fetchuser, async (req, res, next) => {
    try {
        const user = await Notes.findOne({_id:req.params.id,user:req.user.id})
        if(!user)
        {
            const error = new Error("Not a valid user");
            error.status = 401;
            return next(error);
        }
        const del = await Notes.findByIdAndDelete(req.params.id)
        // console.log(user)
        if(!del)
        {
            const error = new Error("Note not deleted");
            error.status = 401;
            return next(error);
        }
        const notes = await Notes.find({user:req.user.id})
        // console.log(notes)
        res.json(notes)

    } catch (error) {
        console.log(error)
        return next(error);
    }

});


router.put('/updatenote/:id', fetchuser, async (req, res, next) => {
    try {
        const {title,desc,tag} = req.body;

        const notes = {}
        if(title) {notes.title = title}
        if(desc) {notes.desc = desc}
        if(tag) {notes.tag = tag}
        const user = await Notes.findOne({_id:req.params.id,user:req.user.id})
        if(!user)
        {
            const error = new Error("Not a valid user");
            error.status = 401;
            return next(error);
        }
        // console.log(user)
        const updatednote = await Notes.findByIdAndUpdate(req.params.id,notes,{new:true})
        if(!updatednote)
        {
            const error = new Error("Note not updated");
            error.status = 401;
            return next(error);
        }
        res.json(updatednote)

    } catch (error) {
        console.log(error)
        return next(error);
    }

});

module.exports = router