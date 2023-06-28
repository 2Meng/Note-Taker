const notes = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

notes.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => 
        res.json(JSON.parse(data))
    );
});

notes.get('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });

notes.post("/", (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;

    if(req.body){
        const newNote = {
        title,
        text,
        id: uuidv4()
    }

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note successfully added!`);
    } else {
        console.error(err);
        res.error("There was a problem adding a note!")
    }
});

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all notes except the one with the ID provided in the URL
        const result = json.filter((note) => note.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
        console.log(`Item ${noteId} has been deleted 🗑️`);
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
  });

  module.exports = notes; 