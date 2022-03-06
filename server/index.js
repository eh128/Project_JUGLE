if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const pool = require("./storage/db");
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: "uploads/" });

//import functions for S3 images
const { uploadFile, getImage, deleteImage } = require("./storage/s3");

const app = express();
app.use(cors());
app.use(express.json());

//get list of all schools (decending order by id)
app.get("/schools", async (req, res) => {
  try {
    const schools = await pool.query("SELECT * FROM schools ORDER BY id DESC");
    res.json(schools.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get image from S3
app.get("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image_path = await pool.query(
      "SELECT image_path FROM schools WHERE id = $1",
      [id]
    );
    const readStream = getImage(image_path.rows[0].image_path.toString());
    readStream.pipe(res);
  } catch (error) {
    console.error(error);
  }
});

//get a specific school
app.get("/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const school = await pool.query("SELECT * FROM schools WHERE id = $1", [
      id,
    ]);
    res.json(school.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//add new school data to database
app.post("/schools", async (req, res) => {
  try {
    const { school_name, about } = req.body;
    const newSchool = await pool.query(
      "INSERT INTO schools (school_name, about) VALUES ($1, $2) RETURNING *",
      [school_name, about]
    );
    res.json(newSchool.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//upload image to S3 and store image path in database
app.post("/images", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;
    const result = await uploadFile(image);
    await unlinkFile(image.path);
    const newImagePath = await pool.query(
      "UPDATE schools SET image_path = $1 WHERE id = (SELECT MAX(id) FROM schools)",
      [result.Key]
    );
    res.send({ imagePath: `/images/${result.Key}` });
  } catch (error) {
    console.error(error);
  }
});

//edit a specific school
app.put("/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { school_name, about } = req.body;
    const updateSchool = await pool.query(
      "UPDATE schools SET school_name = $1, about = $2 WHERE id = $3 RETURNING *",
      [school_name, about, id]
    );
    res.json("School updated");
  } catch (error) {
    console.error(error.message);
  }
});

//delete image and then post new image (update the image)
app.delete("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image_path = await pool.query(
      "SELECT image_path FROM schools WHERE id = $1",
      [id]
    );
    deleteImage(image_path.rows[0].image_path.toString());
    res.send("Image deleted");
  } catch (error) {
    console.error(error.message);
  }
});

//post image for specific school and store the image path in the database
app.post("/images/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file;
    const result = await uploadFile(image);
    await unlinkFile(image.path);
    const newImagePath = await pool.query(
      "UPDATE schools SET image_path = $1 WHERE id = $2",
      [result.Key, id]
    );
    res.send({ imagePath: `/images/${result.Key}` });
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(process.env.PORT);
