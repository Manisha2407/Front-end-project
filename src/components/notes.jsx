import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Notes.css";
const Notes = () => {
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("light");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");//check krta hai user loggid in hai ya nhi or notes ko load krta hai
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    setUsername(loggedInUser);
    const storedNotes =
      JSON.parse(localStorage.getItem(`notes_${loggedInUser}`)) || [];
    setNotes(storedNotes);
    const storedTheme = localStorage.getItem("notesTheme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [navigate]);
  const saveNotesToStorage = (updatedNotes, user = username) => {
    if (!user) return;
    localStorage.setItem(`notes_${user}`, JSON.stringify(updatedNotes));
  };
  const handleAddNote = (e) => {
    e.preventDefault();

    if (!text.trim() && !title.trim() && !imageData) {
      alert("Write something or upload an image to save a note.");
      return;
    }
    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? { ...note, title, text, imageData, updatedAt: Date.now() }
          : note
      );
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        text: text.trim(),
        imageData,
        pinned: false,
        createdAt: Date.now(),
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    }
    setTitle("");//form clear krdo
    setText("");
    setImageData(null);
  };
  const handleClear = () => {
    setTitle("");
    setText("");
    setImageData(null);
    setEditingId(null);
  };
  const handleDelete = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };
  const handlePinToggle = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };
  const handleEdit = (note) => {
    setTitle(note.title);
    setText(note.text);
    setImageData(note.imageData || null);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };
  const handleRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognitionRef.current = recognition;
    recognition.start();
  };
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) {
        return b.createdAt - a.createdAt;
      }
      return a.pinned ? -1 : 1;
    });
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("notesTheme", next);
      return next;
    });
  };
  return (
    <div
      className={`notes-page ${
        theme === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      {/* Top Navbar */}
      <header className="notes-header">
        <div className="notes-nav">
          <div className="notes-logo">
            <span className="logo-icon">⚒</span>
            <Link to="/main" className="logo-text">
              PlanForge
            </Link>
          </div>
          <div className="notes-user">
            {username && <span>Hi, {username}</span>}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <Link to="/main" className="back-link">
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="notes-main">
        <h1 className="notes-title">Notes</h1>
        <p className="notes-subtitle">
          Type or use voice capture — your notes are saved locally.
        </p>
        <div className="notes-layout">
          <section className="notes-card">
            <form onSubmit={handleAddNote}>
              <input
                type="text"
                className="note-input-title"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="note-toolbar">
                <button
                  type="button"
                  className={`record-btn ${isRecording ? "recording" : ""}`}
                  onClick={handleRecord}
                >
                  {isRecording ? "Recording..." : "Record 🎙"}
                </button>

                <label className="upload-btn">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <textarea
                className="note-textarea"
                placeholder="Write your note here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
              />
              {imageData && (
                <div className="image-preview">
                  <img src={imageData} alt="note" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => setImageData(null)}
                  >
                    Remove image
                  </button>
                </div>
              )}
              <div className="note-actions">
                <button type="submit" className="add-note-btn">
                  {editingId ? "Save Note" : "Add Note"}
                </button>
                <button
                  type="button"
                  className="clear-note-btn"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </form>
          </section>
          <section className="notes-list-section">
            <div className="notes-list-header">
              <input
                className="search-input"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="note-count">
                Showing {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                No notes yet — create one on the left 👈
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className={`note-item ${note.pinned ? "pinned" : ""}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="note-item-header">
                      <h3>{note.title || "Untitled"}</h3>
                      <button
                        className="pin-btn"
                        onClick={() => handlePinToggle(note.id)}
                        title={note.pinned ? "Unpin note" : "Pin note"}
                      >
                        {note.pinned ? "📌" : "📍"}
                      </button>
                    </div>
                    <p className="note-text">{note.text}</p>
                    {note.imageData && (
                      <div className="note-image-wrapper">
                        <img src={note.imageData} alt="note" />
                      </div>
                    )}

                    <div className="note-footer">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
export default Notes;
