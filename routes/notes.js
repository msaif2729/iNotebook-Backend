const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const Notes = require('../models/Notes')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { query, body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/finduser');


router.post('/createnote', fetchuser, [
    body("title", "Enter the Title").isEmpty(),
    body("desc", "Enter the desc").isEmpty()

], async (req, res) => {

    const result = validationResult(req);
    if (!result) {
        return res.status(500).send({ error: "Something went wrong" })
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
        res.status(500).send({ error: "Internal Error" })
    }

});


router.get('/getall', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id })
        res.send(notes)

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Error" })
    }

});

router.get('/getone/:id', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.findOne({ _id:req.params.id,user: req.user.id })
        res.send(notes)

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Error" })
    }

});

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const user = await Notes.findOne({_id:req.params.id,user:req.user.id})
        if(!user)
        {
            return res.send("Not a valid user")
        }
        const del = await Notes.findByIdAndDelete(req.params.id)
        console.log(user)
        if(!del)
        {
            return res.status(401).send({error:"Note not deleted"})
        }
        const notes = await Notes.find({user:req.user.id})
        // console.log(notes)
        res.json(notes)

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Error" })
    }

});


router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title,desc,tag} = req.body;

        const notes = {}
        if(title) {notes.title = title}
        if(desc) {notes.desc = desc}
        if(tag) {notes.tag = tag}
        const user = await Notes.findOne({_id:req.params.id,user:req.user.id})
        if(!user)
        {
            return res.status(401).send("Not a valid user")
        }
        console.log(user)
        const updatednote = await Notes.findByIdAndUpdate(req.params.id,notes,{new:true})
        if(!updatednote)
        {
            return res.status(401).send({error:"Note not updated"})
        }
        res.json(updatednote)

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Error" })
    }

});

module.exports = router