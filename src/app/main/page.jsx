"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Main() {
  const [mode, setMode] = useState("login"); // login or signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  // If already logged in, go directly to front
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      router.push("/front");
    }
  }, [router]);

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok) {
        localStorage.setItem(
          "token",
          JSON.stringify({
            email: data.email,
            username: data.username,
          })
        );

        setMessage(`Welcome, ${data.username}!`);
        router.push("/front");
      } else {
        setMessage(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  };

  // ---------------- SIGNUP ----------------
  const submitSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User registered successfully! Please login.");
        setEmail("");
        setPassword("");
        setUsername("");
        setMode("login");
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setMessage("Logged out successfully");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      
        src="/ChatGPT%20Image%20Sep%2013%2C%202025%2C%2004_46_17%20AM.png"
        alt="logo"
        className={styles.logo}
      />

      <div className={styles.verticalLine}></div>

      {mode === "login" && (
        <form className={styles.card} onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <button
            type="button"
            className={styles.signupButton}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>


          {message && <p>{message}</p>}
        </form>
      )}

      {mode === "signup" && (
        <form className={styles.card} onSubmit={submitSignup}>
          <h2>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className={styles.loginButton}>
            Register
          </button>

          <button
            type="button"
            className={styles.signupButton}
            onClick={() => setMode("login")}
          >
            Back to Login
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}