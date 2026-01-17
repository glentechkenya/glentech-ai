"use client";

import { useEffect, useState } from "react";

const introText = "glen-Ai — your future AI created by Glen Tech";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!loaded) {
    return (
      <div className="loader">
        <div className="circle one"></div>
        <div className="circle two"></div>
        <div className="circle three"></div>

        <h1 className="neon typing" style={{ marginTop: 40, textAlign: "center" }}>
          {introText.split("").map((c, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              {c}
            </span>
          ))}
        </h1>
      </div>
    );
  }

  return (
    <div className="chat-bg" style={{ minHeight: "100vh", padding: 16 }}>
      <header style={{ textAlign: "center", marginBottom: 12 }}>
        <span className="neon" style={{ fontSize: 20 }}>
          GLENTECH AI
        </span>
      </header>

      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        background: "rgba(0,0,0,0.65)",
        borderRadius: 16,
        padding: 16
      }}>
        <p style={{ opacity: 0.7 }}>
          Welcome to the futuristic world of AI.
        </p>
      </div>
    </div>
  );
}
