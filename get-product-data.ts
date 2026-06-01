import { woocommerce } from "./lib/services/woocommerce";
import * as fs from "fs";

async function dumpProducts() {
  try {
    console.log("Fetching all products...");
    // Since there are 46 products, a single request with per_page=100 will fetch all of them.
    const result = await woocommerce.getProducts({ per_page: 100, status: "publish" });
    console.log("Total products fetched:", result.data.length);
    
    const summary = result.data.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
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
