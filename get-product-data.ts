import * as fs from "fs";
import * as path from "path";

// Simple manual .env parser
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join("=").trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (e) {}

async function dumpProducts() {
  try {
    const { woocommerce } = await import("./lib/services/woocommerce");
    console.log("Fetching all products...");
    // Since there are 46 products, a single request with per_page=100 will fetch all of them.
    const result = await woocommerce.getProducts({ per_page: 100, status: "publish" });
    console.log("Total products fetched:", result.data.length);
    
    const summary = result.data.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      on_sale: p.on_sale,
      categories: p.categories.map(c => c.name),
      attributes: p.attributes.map(a => ({
        name: a.name,
        options: a.options
      }))
    }));
    
    fs.writeFileSync("products_dump.json", JSON.stringify(summary, null, 2));
    console.log("Saved dump to products_dump.json");
  } catch (err) {
    console.error("Error:", err);
  }
}

dumpProducts();
