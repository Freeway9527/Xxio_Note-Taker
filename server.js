const express = require("express");
const apiRoutes = require("./Develop/routes/apiRoutes");
const htmlRoutes = require("./Develop/routes/htmlRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Develop/public"));

// Mount API routes at /notes
app.use("/api", apiRoutes);

// Mount HTML routes at /
app.use("/", htmlRoutes);   

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);