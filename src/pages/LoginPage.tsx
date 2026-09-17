import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../auth/auth-context-types";
import { MailIcon } from "../components/icons";
import BrandMark from "../components/BrandMark";
import Wordmark from "../components/Wordmark";

type Mode = "sign-in" | "sign-up";

export default function LoginPage() {
  const { status, signIn, signUp } = useAuth();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (status === "signed-in") {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setConfirmationSent(false);
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const result = mode === "sign-in" ? await signIn(email, password) : await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.needsConfirmation) {
        setConfirmationSent(true);
      }
      // On a successful sign-in, AuthProvider's state change fires and the
      // redirect above takes over — nothing else to do here.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
        <div className="mb-4">
          <BrandMark size={64} />
        </div>
        <h1 className="text-2xl">
          <Wordmark />
        </h1>
        <p className="mb-6 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
          {mode === "sign-in" ? "Sign in to your drink log" : "Start your drink log"}
        </p>

        {confirmationSent ? (
          <div className="nu-card w-full max-w-xs p-4 text-sm">
            <p className="font-display text-base" style={{ color: "var(--ink)" }}>
              Check your email
            </p>
            <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
              We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in below.
            </p>
            <button
              type="button"
              onClick={() => switchMode("sign-in")}
              className="nu-btn nu-btn-ghost mt-4 w-full py-2 text-sm"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
            <div>
              <label className="mb-1 block text-sm font-bold" style={{ color: "var(--ink)" }}>
                Email
              </label>
              <div className="relative">
                <MailIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--ink-faint)" }}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="nu-input text-sm"
                  style={{ paddingLeft: "2.25rem" }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold" style={{ color: "var(--ink)" }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="nu-input text-sm"
                placeholder="••••••••"
              />
            </div>

            {mode === "sign-up" && (
              <div>
                <label className="mb-1 block text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="nu-input text-sm"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <p className="text-xs font-semibold" style={{ color: "var(--coral-dark)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="nu-btn nu-btn-primary w-full py-2.5 text-sm">
              {submitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>

            <p className="text-center text-sm" style={{ color: "var(--ink-soft)" }}>
              {mode === "sign-in" ? (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("sign-up")}
                    className="font-bold"
                    style={{ color: "var(--coral-dark)" }}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("sign-in")}
                    className="font-bold"
                    style={{ color: "var(--coral-dark)" }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </PageContainer>
  );
}
