// const path = require('path');
// const fs = require('fs');
// const pdf = require('html-pdf');
// const mustache = require('mustache');

// // Function to encode image to base64
// const encodeBase64 = (filePath) => {
//   const file = fs.readFileSync(filePath);
//   return `data:image/png;base64,${file.toString('base64')}`;
// };

// const generateInvoice = (req, res) => {
//   const invoiceData = req.body;

//   const templatePath = path.join(__dirname, '..', 'invoiceTemplate.html');
//   const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
//   const signaturePath = path.join(__dirname, '..', 'assets', 'signature.png');
//   const cssPath = path.join(__dirname, '..', 'InvoiceTemplate.css');

//   // Convert images to base64
//   const logoBase64 = encodeBase64(logoPath);
//   const signatureBase64 = encodeBase64(signaturePath);

//   // Read the HTML template
//   fs.readFile(templatePath, 'utf8', (err, template) => {
//     if (err) {
//       return res.status(500).send('Error reading template');
//     }

//     // Inject CSS into the template
//     const css = fs.readFileSync(cssPath, 'utf8');
//     const htmlWithCSS = template.replace('</head>', `<style>${css}</style></head>`);

//     // Render the HTML with Mustache
//     const html = mustache.render(htmlWithCSS, {
//       ...invoiceData,
//       logoBase64,
//       signatureBase64,
//     });

//     // Convert HTML to PDF
//     const options = { format: 'A4', orientation: 'portrait', border: '10mm' };
//     const fileName = `Invoice_${Date.now()}.pdf`; // Generate a unique filename
//     const filePath = path.join(__dirname, '..', 'invoices', fileName); // Path to save the PDF file

//     pdf.create(html, options).toFile(filePath, (err, result) => {
//       if (err) {
//         console.error('Error generating PDF:', err);
//         return res.status(500).send('Error generating PDF');
//       }
//       // Respond with the filename or identifier to access the PDF
//       res.json({ filename: fileName });
//     });
//   });
// };

// module.exports = { generateInvoice };

const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const mustache = require('mustache');
const os = require('os'); // For getting the system's temporary directory

// Function to encode image to base64
const encodeBase64 = (filePath) => {
  const file = fs.readFileSync(filePath);
  return `data:image/png;base64,${file.toString('base64')}`;
};

const generateInvoice = (req, res) => {
  const invoiceData = req.body;

  const templatePath = path.join(__dirname, '..', 'invoiceTemplate.html');
  const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
  const signaturePath = path.join(__dirname, '..', 'assets', 'signature.png');
  const cssPath = path.join(__dirname, '..', 'InvoiceTemplate.css');

  // Convert images to base64
  const logoBase64 = encodeBase64(logoPath);
  const signatureBase64 = encodeBase64(signaturePath);

  // Read the HTML template
  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error reading template');
    }

    // Inject CSS into the template
    const css = fs.readFileSync(cssPath, 'utf8');
    const htmlWithCSS = template.replace('</head>', `<style>${css}</style></head>`);

    // Render the HTML with Mustache
    const html = mustache.render(htmlWithCSS, {
      ...invoiceData,
      logoBase64,
      signatureBase64,
    });

    // Convert HTML to PDF
    const options = { format: 'A4', orientation: 'portrait', border: '10mm' };
    const fileName = `Invoice_${Date.now()}.pdf`; // Generate a unique filename
    const tempDir = os.tmpdir(); // Get the system's temporary directory
    const filePath = path.join(tempDir, fileName); // Path to save the PDF file

    pdf.create(html, options).toFile(filePath, (err, result) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).send('Error generating PDF');
      }
      // Respond with the filename or identifier to access the PDF
      res.json({ filename: fileName });

      // Optionally, clean up the file after sending the response
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temporary PDF:', err);
      });
    });
  });
};

module.exports = { generateInvoice };


