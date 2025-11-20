import { useState } from "react";
import { Button } from "../components/Button";
import { EyeOpen } from "../icons/EyeOpen";
import { EyeClose } from "../icons/EyeClose";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface InputProps {
  id?: string;
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  setValue: (e: string) => void;
  ariaLabel?: string;
}

function Input({
  id,
  label,
  placeholder,
  type = "text",
  value,
  setValue,
  ariaLabel,
}: InputProps) {
  return (
    <div className="my-3">
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        aria-label={ariaLabel ?? placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-gray-100 w-full rounded-lg py-2.5 px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        type={type}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

export function Signup() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passType, setPassType] = useState<"text" | "password">("password");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  function handleVisibility() {
    setPassType((p) => (p === "text" ? "password" : "text"));
  }

  function validate(): boolean {
    const newErrs: typeof fieldErrors = {};
    if (!email.trim()) newErrs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrs.email = "Enter a valid email";
    if (!userName.trim()) newErrs.username = "Username is required";
    else if (userName.trim().length < 3)
      newErrs.username = "Username must be at least 3 characters";
    if (!password) newErrs.password = "Password is required";
    else if (password.length < 6)
      newErrs.password = "Password must be ≥ 6 characters";
    setFieldErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  }

  async function onSignup(e?: React.FormEvent) {
    e?.preventDefault();
    setErrorMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        username: userName.trim(),
        password,
        email: email.trim(),
      });

      if (response.status === 201) {
        navigate("/verify-otp", { state: { email: email.trim() } });
      } else {
        setErrorMsg("Unexpected response from server.");
        console.warn("Signup response:", response);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message ?? err.message;
        if (status === 409) {
          setErrorMsg("A user with this email/username already exists.");
        } else {
          setErrorMsg(message || "Failed to create user — try again later.");
        }
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg px-6 py-7">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start building — it only takes a minute.
          </p>
        </header>

        <form
          onSubmit={onSignup}
          aria-describedby={errorMsg ? "form-error" : undefined}>
          <Input
            id="email"
            label="Email"
            placeholder="you@company.com"
            type="email"
            value={email}
            setValue={setEmail}
            ariaLabel="Email address"
          />
          {fieldErrors.email ? (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
          ) : null}

          <Input
            id="username"
            label="Username"
            placeholder="choose a username"
            value={userName}
            setValue={setUserName}
            ariaLabel="Username"
          />
          {fieldErrors.username ? (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.username}</p>
          ) : null}

          <div className="relative">
            <Input
              id="password"
              label="Password"
              placeholder="At least 6 characters"
              type={passType}
              value={password}
              setValue={setPassword}
              ariaLabel="Password"
            />
            {password ? (
              <button
                type="button"
                onClick={handleVisibility}
                aria-label={
                  passType === "text" ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-9 p-1 rounded-md hover:bg-gray-100">
                {passType === "text" ? <EyeClose /> : <EyeOpen />}
              </button>
            ) : null}
          </div>
          {fieldErrors.password ? (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
          ) : null}

          {errorMsg ? (
            <div
              id="form-error"
              role="alert"
              className="mt-3 text-sm text-red-700">
              {errorMsg}
            </div>
          ) : null}

          <div className="mt-6">
            <Button
              onClick={(e: any) => onSignup(e)}
              varient="primary"
              customCSS={`w-full justify-center ${
                loading ? "opacity-70 pointer-events-none" : ""
              }`}
              text={loading ? "Creating account..." : "Create account"}
              disabled={loading}
            />
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          <p>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
