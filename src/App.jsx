import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Land from "./components/Landing";
import Main from "./components/Main";
import Login from "./components/Login";
import Home from "./components/Home";
import Mansi from "./components/Mansi";
import Calender from "./components/Calender";
import Contact from "./components/Contact";
import Notes from "./components/notes";
// FIXED

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mansi" element={<Mansi />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;
