import ProductEditor from "../../../../components/admin/ProductEditor";
import { createProductAction } from "../actions";

export default function NewAdminProductPage() {
  return (
    <ProductEditor
      title="NEW PRODUCT"
      submitLabel="CREATE PRODUCT"
      action={createProductAction}
    />
  );
}
