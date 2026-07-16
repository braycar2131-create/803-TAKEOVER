"use client";

import { useState } from "react";

export default function ConfirmDelete({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        className="admin-danger-button"
        type="button"
        onClick={() => setConfirming(true)}
      >
        DELETE PRODUCT
      </button>
    );
  }

  return (
    <form className="admin-delete-confirm" action={action}>
      <span>THIS CANNOT BE UNDONE.</span>

      <div>
        <button type="submit">CONFIRM DELETE</button>

        <button
          type="button"
          onClick={() => setConfirming(false)}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
