const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.text()); // Parse request body as plain text

app.get('/generate-pdf', (req, res) => {
    // Get HTML content from the request body
    const htmlContent = `<h1 style="color:red;"">Rushikesh</h1>`

    // Define absolute paths for the temporary HTML file and output PDF file
    const htmlFilePath = path.join(__dirname, 'temp.html');
    const pdfFilePath = path.join(__dirname, 'output.pdf');

    // Save HTML content to the temporary file
    fs.writeFileSync(htmlFilePath, htmlContent);

    // Use WeasyPrint to generate PDF from HTML
    const weasyprintProcess = spawn('weasyprint', [htmlFilePath, pdfFilePath]);

    weasyprintProcess.on('close', (code) => {
        if (code === 0) {
            // Send the generated PDF file back to the client
            res.sendFile(pdfFilePath, () => {
                // Clean up temporary and output files after sending
                fs.unlinkSync(htmlFilePath);
                fs.unlinkSync(pdfFilePath);
            });
        } else {
            res.status(500).send('Error generating PDF');
        }
    });
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
