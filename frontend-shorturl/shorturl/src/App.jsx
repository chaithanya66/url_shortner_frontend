import React, { useState } from "react";

/*
  This component sends POST /api/shorten to backend at http://localhost:5000
  and displays the returned shortUrl.
  If you host backend elsewhere, change API_BASE.
*/
const API_BASE = "http://localhost:5000";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!longUrl.trim()) {
      setError("Please enter a long URL.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, shortCode: shortCode || undefined }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Server error");
      } else {
        setResult(data);
        setLongUrl("");
        setShortCode("");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Could not connect to server. Make sure backend is running on http://localhost:5000"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>URL Shortener</h1>
        <p className="muted">
          Paste a long URL and (optionally) a custom shortcode.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Long URL</label>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
          />

          <label>Custom shortcode (optional)</label>
          <input
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="my-custom-code (letters, numbers, -, _)"
            maxLength={50}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create short URL"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div>Short URL:</div>
            <a href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
            <div className="small">Long URL: {result.longUrl}</div>
          </div>
        )}
      </div>
    </div>
  );
}
