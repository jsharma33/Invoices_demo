import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

export async function createInvoice(inv_obj){
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/invoicing/invoices`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
      /*"PayPal-Request-Id": "7b92603e-43fg-4978-8e78-5dea20509001ab01"*/
    },
    body: JSON.stringify(inv_obj),
  });
  const data = await response.json();
  return data;
}

export async function sendInvoice(inv_url){
  const accessToken = await generateAccessToken();
  console.log(inv_url);
  const url = `${inv_url}/send/`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
      /*"PayPal-Request-Id": "7b92603e-43fg-4978-8e78-5dea20509001ab01"*/
    },
    body: JSON.stringify({"send_to_recipient": false}),
  });
  const data = await response.json();
  return data;
}


export async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}


export async function getinvoicenumber() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/invoicing/generate-next-invoice-number`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
      //"PayPal-Request-Id": "7b92603e-43fg-4978-8e78-5dea20509001ab01" 
   },
   body:JSON.stringify({"invoice_number": "E-Learn-INV-00099"}),
  });
  const data = await response.json();
  return data.invoice_number;
}


