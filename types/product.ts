export type ProductCategory =
  | "SHIRTS"
  | "HOODIES"
  | "SHORTS";

export type ProductColor =
  | "BLACK"
  | "WHITE"
  | "RED";

export type ProductInventoryItem = {
  size: string;
  quantity: number;
};

export type Product = {
  id: number | string;
  slug: string;
  name: string;

  price: number;
  displayPrice: string;

  category: ProductCategory;
  tag: string;
  color: ProductColor;

  image: string;
  images: string[];

  sizes: string[];
  inventory: ProductInventoryItem[];

  description: string;

  featured: boolean;
  active: boolean;
};