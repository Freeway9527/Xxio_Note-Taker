const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const uniqid = require("uniqid");

// Path constants
const dbFilePath = path.join(__dirname, "../db/db.json");

// API endpoint to get notes
router.get("/notes", async (req, res) => {
  try {
    const data = await fs.readFile(dbFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading data");
  }
});

// Function to read JSON file
const readJSONFile = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${file}: ${err.message}`);
  }
};

// Function to write JSON file
const writeJSONFile = async (file, content) => {
  try {
    await fs.writeFile(file, JSON.stringify(content, null, 4));
    console.info(`Data written to ${file}`);
  } catch (err) {
    throw new Error(`Error writing to ${file}: ${err.message}`);
  }
};

// API endpoint to create a new note
router.post("/notes", async (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uniqid(),
  };

  try {
    const existingData = await readJSONFile(dbFilePath);
    existingData.push(newNote);
    await writeJSONFile(dbFilePath, existingData);

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving note" });
  }
});

//*************** BONUS BONUS BONUS ***************//
//*************** BONUS BONUS BONUS **************//
// Delete route handler
router.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let existingData = await readJSONFile(dbFilePath);
    const filteredData = existingData.filter((note) => note.id !== id);
    await writeJSONFile(dbFilePath, filteredData);

    res.send(`Deleted note with ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting note" });
  }
});

module.exports = router;
