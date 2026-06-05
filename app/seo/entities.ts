export interface EntityRelation {
  category: string;
  location: string;
  condition: string;
}

export const brandEntities: Record<string, EntityRelation> = {
  Dell: {
    category: "Refurbished Laptop",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  },
  HP: {
    category: "Refurbished Laptop",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  },
  Apple: {
    category: "Refurbished Macbook",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  },
  Lenovo: {
    category: "Refurbished ThinkPad",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  },
  Microsoft: {
    category: "Refurbished Surface Tablet",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  },
};

export function getBrandEntity(brandName: string): EntityRelation {
  const cleanBrand = brandName?.trim() || "";
  
  // Try exact match first, then case insensitive fallback
  if (brandEntities[cleanBrand]) {
    return brandEntities[cleanBrand];
  }
  
  const foundKey = Object.keys(brandEntities).find(
    (key) => key.toLowerCase() === cleanBrand.toLowerCase()
  );
  
  if (foundKey) {
    return brandEntities[foundKey];
  }
  
  // Default fallback entity
  return {
    category: "Refurbished IT Hardware",
    location: "Mumbai",
    condition: "Grade A Refurbished",
  };
}
