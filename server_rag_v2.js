const express=require("express");
const multer=require("multer");
const fs=require("fs");
const path=require("path");
const pdfParse=require("pdf-parse");
const cors=require("cors");

const app=express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const uploadDir=path.join(__dirname,"uploads");

if(!fs.existsSync(uploadDir)){
fs.mkdirSync(uploadDir);
}

const storage=multer.diskStorage({

destination:function(req,file,cb){
cb(null,uploadDir);
},

filename:function(req,file,cb){
cb(null,"Onboarding.pdf");
}

});

const upload=multer({storage});

app.post("/upload",upload.single("pdf"),(req,res)=>{

res.json({
message:"PDF uploaded successfully"
});

});

app.post("/ask",async(req,res)=>{

try{

const question=req.body.question.toLowerCase();

const pdfPath=path.join(__dirname,"uploads","Onboarding.pdf");

const buffer=fs.readFileSync(pdfPath);

const data=await pdfParse(buffer);

const lines=data.text.split("\n");

let result="Answer not found in SOP";

for(let i=0;i<lines.length;i++){

if(lines[i].toLowerCase().includes(question)){

result=
lines[i]+"\n"+
(lines[i+1]||"")+"\n"+
(lines[i+2]||"");

break;

}

}

res.json({
answer:result
});

}
catch(error){

res.json({
answer:"Error processing request"
});

}

});

const PORT=3001;

app.listen(PORT,()=>{

console.log("Server running on port "+PORT);

});
