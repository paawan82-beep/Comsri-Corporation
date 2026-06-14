const https = require("https");

const url = "https://cms.comsri.com";
const key = "ck_a9810a7936cbebf7e972f9aff5179cf2bddd9daf";
const secret = "cs_df27545c1062a4436c6acb22b86874553d869ebd";

const authHeader = "Basic " + Buffer.from(key + ":" + secret).toString("base64");

const options = {
  hostname: "cms.comsri.com",
  path: "/wp-json/wc/v3/products/categories?per_page=1",
  method: "GET",
  headers: {
    "Authorization": authHeader,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
};

console.log("Testing connection to: https://cms.comsri.com/wp-json/wc/v3/products/categories?per_page=1");

const req = https.request(options, (res) => {
  console.log("Response Status:", res.statusCode);
  console.log("Response Headers:", res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response Body (Truncated):", data.slice(0, 500));
  });
});

req.on("error", (e) => {
  console.error("Request Error:", e);
});

req.end();
