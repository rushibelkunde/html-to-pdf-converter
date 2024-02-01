const express = require("express");
const bodyParser = require("body-parser");
const {exec} = require("child_process");
const fs = require("fs");
const path = require("path");
const canvas = require("chartjs-node-canvas");

const app = express();
const port = 3000;



app.use(bodyParser.text());

app.get("/generate-pdf", async (req, res) => {
  const htmlContent = "<h1>Chart</h1></hr><!-- INSERT_CHART_HERE -->";

  const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
  const yValues = [55, 49, 44, 24, 15];
  const barColors = ["red", "green", "blue", "orange", "brown"];

  const chartConfiguration = {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "World Wine Production 2018",
      },
      
    },
  };
  const Canvas = new canvas.ChartJSNodeCanvas({ height: 500, width: 500 , backgroundColour:"white"});

  const image = await Canvas.renderToBuffer(chartConfiguration);

  const imagePath = path.join(__dirname, "chart.png");
  console.log(imagePath);
  fs.writeFileSync(imagePath, image);

  const updatedHtmlContent = htmlContent.replace(
    "<!-- INSERT_CHART_HERE -->",
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
