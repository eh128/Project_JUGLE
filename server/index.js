require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./storage/db");
const multer = require("multer");
const { uploadFile, getImage } = require("./storage/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());
app.use(express.json());

//get list of all schools
app.get("/schools", async (req, res) => {
  try {
    const schools = await pool.query("SELECT * FROM schools");
    res.json(schools.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/images/:id", async (req, res) => {
  try {
    const image_path = await pool.query(
      "SELECT image_path FROM schools WHERE id = $1",
      [req.params.id]
    );
    const readStream = getImage(image_path.rows[0].image_path.toString());
    readStream.pipe(res);
  } catch (error) {
    console.error(error);
  }

  // key = image_path.rows[0].image_path;
  // const downloadParams = {
  //   Key: key,
  //   Bucket: process.env.AWS_BUCKET_NAME,
  // };
  // s3.getObject(downloadParams, (error, data) => {
  //   if (error) console.log(error);
  //   console.log(data.Body);
  //   res.send(data.Body);
  // });
});

//get a specific school
app.get("/schools/:id", async (req, res) => {
  try {
    const school = await pool.query("SELECT * FROM schools WHERE id = $1", [
      req.params.id,
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
  } catch (err) {
    console.error(err.message);
  }
});

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
    // const { id } = req.params;
    const { school_name, about } = req.body;
    const updateSchool = await pool.query(
      "UPDATE schools SET school_name = $1, about = $2 WHERE id = $3 RETURNING *",
      [school_name, about, req.params.id]
    );
    res.json("School updated");
  } catch (err) {
    console.error(err);
  }
});

app.listen(process.env.PORT);
