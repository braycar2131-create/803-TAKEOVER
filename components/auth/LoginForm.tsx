import { loginAction } from "../../app/auth/actions";

type LoginFormProps = {
  error?: string;
  status?: string;
};

function getErrorMessage(error?: string) {
  if (!error) return null;

  if (error === "missing-fields") {
    return "Enter your email and password.";
  }

  if (error === "unauthorized") {
    return "This account is not authorized for the admin dashboard.";
  }

  return decodeURIComponent(error);
}

export default function LoginForm({
  error,
  status,
}: LoginFormProps) {
  const errorMessage =
    getErrorMessage(error);

  return (
    <form
      className="admin-login-form"
      action={loginAction}
    >
      {status === "signed-out" ? (
        <div className="admin-login-success">
          You have been signed out.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="admin-login-error">
          {errorMessage}
        </div>
      ) : null}

      <label>
        <span>ADMIN EMAIL</span>

        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label>
        <span>PASSWORD</span>

        <input
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </label>

      <button type="submit">
        ENTER CONTROL CENTER
      </button>

      <p>
        Protected by Supabase authentication.
      </p>
    </form>
  );
}
