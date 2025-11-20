import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../components/Button";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email as string | undefined;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((c) => (c > 0 ? c - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="bg-white w-full max-w-sm rounded-xl shadow px-6 py-7 text-center">
          <p className="text-red-600 font-medium">
            No email provided. Please sign up first.
          </p>
          <Link
            to="/signup"
            className="mt-4 inline-block text-indigo-600 hover:underline">
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  function validateOtp(value: string) {
    return /^\d{6}$/.test(value);
  }

  const onVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setMessage("");

    if (!validateOtp(otp.trim())) {
      setError("Enter the 6-digit numeric OTP sent to your email.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/otp-verification`,
        { email, otp: otp.trim() },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setMessage("Verification successful — redirecting to sign in...");
        setTimeout(() => navigate("/signin"), 1400);
      } else {
        setError(response.data?.message || "Verification failed.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Verification failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
    if (isResending || resendCooldown > 0) return;
    setError("");
    setMessage("");
    setIsResending(true);
    try {
      const resp = await axios.post(
        `${apiUrl}/resend-otp`,
        { email },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        setMessage("OTP resent. Check your inbox (and spam).");
        setResendCooldown(30);
      } else {
        setError(
          resp.data?.message || "Could not resend OTP. Try again later."
        );
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to resend OTP.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md px-6 py-7">
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Verify your email
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-slate-700">{email}</span>
        </p>

        <form onSubmit={onVerify} className="mt-6">
          <label htmlFor="otp" className="sr-only">
            OTP
          </label>
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(cleaned);
              if (error) setError("");
            }}
            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-lg tracking-widest text-center placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="• • • • • •"
            aria-label="Enter 6 digit OTP"
            autoFocus
          />

          {message && (
            <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              onClick={onVerify}
              varient="primary"
              customCSS={`w-full ${
                isLoading ? "opacity-70 pointer-events-none" : ""
              }`}
              text={isLoading ? "Verifying…" : "Verify"}
              disabled={isLoading}
            />

            <Button
              onClick={onResend}
              varient="secondary"
              customCSS={`w-full ${
                isResending || resendCooldown > 0
                  ? "opacity-70 pointer-events-none"
                  : ""
              }`}
              text={
                isResending
                  ? "Resending…"
                  : resendCooldown > 0
                  ? `Resend (${resendCooldown}s)`
                  : "Resend OTP"
              }
              disabled={isResending || resendCooldown > 0}
            />
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            If you used the wrong email,{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign up again
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
