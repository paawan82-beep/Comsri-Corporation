const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
} catch (e) {
  console.error("Could not load env file manually", e);
}

const url = process.env.WOOCOMMERCE_URL || "";
const key = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

if (!url || !key || !secret) {
  console.error("Missing env keys!");
  process.exit(1);
}

const auth = Buffer.from(`${key}:${secret}`).toString("base64");

async function run() {
  const slug = 'dell-latitude-laptop-5480-intel-i5-6th-gen-14-fhd-win-10-pro-refurbished';
  const endpoint = `${url}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`;
  console.log("Fetching: " + endpoint);
  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });
  if (!res.ok) {
    console.error("Fetch failed", res.status, res.statusText);
    return;
  }
  const products = await res.json();
  if (products.length === 0) {
    console.log("No product found!");
    return;
  }
  const product = products[0];
  console.log("Name:", product.name);
  console.log("--- DESCRIPTION ---");
  console.log(product.description);
  console.log("--- SHORT DESCRIPTION ---");
  console.log(product.short_description);
  console.log("--- ATTRIBUTES ---");
  console.dir(product.attributes, { depth: null });
}

run().catch(console.error);
