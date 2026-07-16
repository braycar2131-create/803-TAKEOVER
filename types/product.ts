export type ProductInventory = {
  size: string;
  quantity: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  displayPrice: string;
  category: string;
  tag: string;
  color: string;
  image: string;
  images: string[];
  sizes: string[];
  inventory: ProductInventory[];
  description: string;
  featured: boolean;
  active?: boolean;
};
