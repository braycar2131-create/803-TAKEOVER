import { notFound } from "next/navigation";
import ProductEditor from "../../../../../components/admin/ProductEditor";
import { prisma } from "../../../../../lib/prisma";
import { updateProductAction } from "../../actions";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditAdminProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
      inventory: {
        orderBy: {
          size: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const action = updateProductAction.bind(null, product.slug);

  return (
    <ProductEditor
      title={`EDIT ${product.name}`}
      submitLabel="SAVE CHANGES"
      action={action}
      product={product}
    />
  );
}
