"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouter for App Router
import { auth } from "@/context/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  // Helper: store user in MongoDB
  const storeUser = async (user: any) => {
    try {
      await axios.post("/api/users", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
      });
    } catch (err) {
      console.error("Error storing user in DB:", err);
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store in MongoDB
      await storeUser(user);

      setError(null);
      router.push("/"); // navigate to home page
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("Authentication service is not available");
      return;
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store in MongoDB
      await storeUser(user);

      setError(null);
      router.push("/"); // navigate to home page
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) return; // Skip if Firebase auth is not available

    const unsubscribe = onAuthStateChanged(auth, () => {
      // No need to set current user here as login functions handle navigation
    });

    return () => unsubscribe();
  }, []);



  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Login Section - Left Side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            padding: 30,
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleEmailLogin}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 4,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 15,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login with Email"}
          </button>

          <div style={{ textAlign: "center", marginBottom: 15 }}>OR</div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 4,
              border: "none",
              background: "#db4437",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login with Google"}
          </button>

          {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
        </div>
      </div>

     
    </div>
  );
};

export default LoginPage;
