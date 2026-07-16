import { logoutAction } from "../../app/auth/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        className="admin-logout-button"
        type="submit"
      >
        LOG OUT
      </button>
    </form>
  );
}
