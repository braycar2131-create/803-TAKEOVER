export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  displayPrice: string;
  category: "SHIRTS" | "HOODIES" | "SHORTS";
  tag: string;
  color: "BLACK" | "WHITE" | "RED";
  image: string;
  images: string[];
  sizes: string[];
  description: string;
  featured: boolean;
};
