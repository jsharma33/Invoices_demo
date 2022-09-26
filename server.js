import "dotenv/config"; // loads variables from .env file
import express from "express";
import * as paypal from "./paypal-api.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.render('../public/index.html')
})

app.post("/api/draftinvoice", async (req, res) => {
  const inv_num = await paypal.getinvoicenumber();
  let invoice_obj = {
    "detail":{
        "invoice_number":inv_num,
        "invoice_date":"2022-08-11",
        "currency_code":req.body.currency,
        "reference":"E-learning-1011",
        "term":"Non refundible",
        "payment_term":{
            "term_type":"NET_30"
        }
    },
      "invoicer": {
    "name": {
      "given_name": "Joe",
      "surname": "B"
    },
    "address": {
      "address_line_1": "1234 First Street",
      "address_line_2": "337673 Hillside Court",
      "admin_area_2": "Random town",
      "admin_area_1": "CA",
      "postal_code": "98765",
      "country_code": "US"
    },
    "email_address": "usmerchant_jiten@gmail.com",
    "phones": [
      {
        "country_code": "001",
        "national_number": "4085551234",
        "phone_type": "MOBILE"
      }
    ]
    },
    "primary_recipients":[
        {
            "billing_info":{
                "name":{
                    "given_name":req.body.first_name,
                    "surname":"S"
                },
                "email_address":req.body.email
            },
        }
    ],
    "items":[
        {
            "name":req.body.item_name,
            "description":req.body.description,
            "quantity":req.body.quantity,
            "unit_amount":{
                "currency_code":req.body.currency,
                "value":req.body.amount
            },
            "unit_of_measure":"QUANTITY"
        }
    ],
    "configuration":{
        "partial_payment":{
            "allow_partial_payment":"false",
        },
        "allow_tip":"false",
        "tax_inclusive":"true"
    }
}
const invoice = await paypal.createInvoice(invoice_obj);
console.log(invoice.href);
const inv_url=invoice.href;
const f_inv= await paypal.sendInvoice(inv_url);
console.log(f_inv);

res.render('../public/invoicelink.html',{data:f_inv})
})


app.get('/createinvoice', async (req, res) => {
  res.render('../public/createInvoice.html')
})

app.listen(9898);
