const express = require("express");
const { File_Data } = require("../models");
const restrict_to_loggedin_candidates_only = require("../middlewares/restrict");
const upload = require("../services/fileupload");


const router = express.Router();

router.get("/", restrict_to_loggedin_candidates_only, async (req, res) => {
  try {
    const allfiledetails = await File_Data.findAll();
    console.log("All File Details : ", JSON.stringify(allfiledetails));
    return res.render("upload", { allfiledetails: allfiledetails });
  } catch (error) {
    console.log("Error Retrieveing File Details from The DB or NO FILES");
    return res.render("upload", { allfiledetails: [] });
  }
});

router.post("/", upload.single("file_upload"), async (req, res) => {
  if (!req.file) {
    return res.render("failed");
  }
  try {
    const insert_records = await File_Data.create({
      filename: req.file.filename,
      orig_filename: req.file.originalname,
      size: req.file.size,
    });
    console.log("The records are :", insert_records);
    return res.render("success", { title: req.file.originalname });
  } catch (error) {
    console.error("Error:", error);
    return res.render("failed");
  }
});



module.exports = router;
