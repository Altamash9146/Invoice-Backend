const express = require("express");
const dotenv = require("dotenv")
dotenv.config()
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin:"*"
}))

const generateInvoice = require("./Routes/generateInvoiceRoutes");
app.use("/api", generateInvoice);


Port = process.env.PORT
app.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
});
