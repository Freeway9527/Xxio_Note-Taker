const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const uniqid = require("uniqid");

// Sever config
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Develop/public"));

// Path constants
const dbFilePath = path.join(__dirname, "Develop/db/db.json");
const indexPath = path.join(__dirname, "Develop/public/index.html");
const notesPath = path.join(__dirname, "Develop/public/notes.html");

// Get route handlers
app.get("/", (req, res) => res.sendFile(indexPath));

app.get("/notes", (req, res) => res.sendFile(notesPath));

// API endpoint to get notes
app.get("/api/notes", async (req, res) => {
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
app.post("/api/notes", async (req, res) => {
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
app.delete("/api/notes/:id", async (req, res) => {
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

// Start server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);