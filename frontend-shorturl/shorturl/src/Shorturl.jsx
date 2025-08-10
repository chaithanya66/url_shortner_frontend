import React, { useState } from "react";

export default function Shorturl() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://url-shortner-1-73j8.onrender.com/api/shorten",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ longUrl }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setShortUrl(
          `https://url-shortner-1-73j8.onrender.com/${data.shortCode}`
        );
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="shortener-container">
      <div className="shortener-card">
        <h1 className="title">URL Shortener</h1>
        <p className="subtitle">Shorten your links instantly</p>

        <input
          type="text"
          placeholder="Enter your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="input"
        />

        <button onClick={handleShorten} className="button" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
