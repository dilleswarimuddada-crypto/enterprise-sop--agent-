const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const upload = multer({
  dest: "uploads/"
});

let pdfText = "";


app.post("/upload", upload.single("pdf"), async (req, res) => {

  try {

    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);

    pdfText = data.text;

    res.json({
      message: "PDF uploaded successfully"
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Error uploading PDF"
    });

  }

});



app.post("/ask", async (req, res) => {

  try {

    const question = req.body.question.toLowerCase();

    const paragraphs = pdfText.split("\n");

    let answer = "Answer not found in SOP document";


    for (let para of paragraphs) {

      if (para.toLowerCase().includes(question)) {

        answer = para;
        break;

      }

    }


    res.json({
      answer: answer
    });

  }
  catch (error) {

    res.status(500).json({
      answer: "Error processing request"
    });

  }

});



const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
