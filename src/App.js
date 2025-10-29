import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setBooks([]);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setBooks(data.docs.slice(0, 20));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchBooks();
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📚 Book Finder</h1>
      <p>Search any book title and explore details powered by Open Library.</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            padding: "0.5rem",
            width: "70%",
            marginRight: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button onClick={fetchBooks} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {books.map((book, i) => {
          const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://via.placeholder.com/150x220?text=No+Cover";
          return (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={coverUrl}
                alt={book.title}
                style={{ width: "100%", borderRadius: "6px" }}
              />
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong>{" "}
                {book.author_name?.join(", ") || "Unknown"}
              </p>
              <p>
                <strong>Year:</strong> {book.first_publish_year || "N/A"}
              </p>
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Open Library →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
