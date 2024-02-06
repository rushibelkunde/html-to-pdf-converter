const express = require("express");
const bodyParser = require("body-parser");
const {exec} = require("child_process");
const fs = require("fs");
const path = require("path");
const canvas = require("chartjs-node-canvas");

const app = express();
const port = 3000;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async(req,res)=>{

  res.render('index')
})

app.post("/generate-pdf", async (req, res) => {
  const htmlContent = req.body.htmlText

  

  const chartConfiguration = JSON.parse(req.body.chartConfig)

  console.log(chartConfiguration)

  
  const Canvas = new canvas.ChartJSNodeCanvas({ height: 500, width: 500 , backgroundColour:"white"});

  const image = await Canvas.renderToBuffer(chartConfiguration);

  const imagePath = path.join(__dirname, "chart.png");
  console.log(imagePath);
  fs.writeFileSync(imagePath, image);

  const updatedHtmlContent = htmlContent.replace(
    "%CHART%",
    `<img src="file://${imagePath}" alt="Chart">`
  );

  const htmlFilePath = path.join(__dirname, "temp.html");
  const pdfFilePath = path.join(__dirname, "output.pdf");

  fs.writeFileSync(htmlFilePath, updatedHtmlContent);

  const weasyprintProcess = exec(`weasyprint ${htmlFilePath} ${pdfFilePath}`);

  weasyprintProcess.on("close", (code) => {
    if (code === 0) {
      res.sendFile(pdfFilePath, () => {
        fs.unlinkSync(htmlFilePath);
        fs.unlinkSync(pdfFilePath);
        fs.unlinkSync(imagePath);
      });
    } else {
      res.status(500).send("Error generating PDF");
    }
  });
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

