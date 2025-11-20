import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EyeOpen } from "../icons/EyeOpen";
import { EyeClose } from "../icons/EyeClose";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface InputProps {
  id?: string;
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  setValue: (v: string) => void;
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

export function Signin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState<"text" | "password">("password");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  function handleVisibility() {
    setPassType((p) => (p === "text" ? "password" : "text"));
  }

  function validate() {
    const errs: typeof fieldErrors = {};
    if (!userName.trim()) errs.username = "Username is required";
    if (!password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSignin(e?: React.FormEvent) {
    e?.preventDefault();
    setErrorMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/signin`,
        { username: userName.trim(), password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        setErrorMsg("Unexpected server response.");
        console.warn("Signin response:", response);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message ?? err.message;
        if (status === 401 || status === 403) {
          setErrorMsg("Incorrect username or password.");
        } else {
          setErrorMsg(message || "Sign in failed — try again later.");
        }
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
      console.error("Signin error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg px-6 py-7">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back — please enter your credentials.
          </p>
        </header>

        <form
          onSubmit={onSignin}
          aria-describedby={errorMsg ? "form-error" : undefined}>
          <Input
            id="username"
            label="Username"
            placeholder="your username"
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
              placeholder="your password"
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
              onClick={(e: any) => onSignin(e)}
              varient="primary"
              customCSS={`w-full justify-center ${
                loading ? "opacity-70 pointer-events-none" : ""
              }`}
              text={loading ? "Signing in..." : "Sign in"}
              disabled={loading}
            />
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
