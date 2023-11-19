const express = require("express");
const router = express.Router();
const path = require("path");

// Path constants
const indexPath = path.join(__dirname, "../public/index.html");
const notesPath = path.join(__dirname, "../public/notes.html");

// Serve index.html for the root route
router.get("/", (req, res) => res.sendFile(indexPath)); 

// Serve notes.html for /notes route
router.get("/notes", (req, res) => res.sendFile(notesPath)); 

module.exports = router; 
