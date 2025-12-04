import React, { useState, useEffect } from "react";
import "../styles/calender.css";
import { Link } from "react-router-dom";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Calendar = () => {
  const todayDate = new Date();

  const [today] = useState(todayDate);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTimeFrom, setEventTimeFrom] = useState("");
  const [eventTimeTo, setEventTimeTo] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) setEventsArr(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

  const convertTime = (t) => {
    let [h, m] = t.split(":");
    h = parseInt(h);
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${p}`;
  };

  const generateDays = () => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const prevLast = new Date(year, month, 0);
    const prevDays = prevLast.getDate();
    const lastDate = last.getDate();
    const day = first.getDay();
    const nextDays = 7 - last.getDay() - 1;

    const days = [];

    for (let x = day; x > 0; x--) days.push({ dayNum: prevDays - x + 1, type: "prev-date" });
    for (let i = 1; i <= lastDate; i++) {
      const hasEvent = eventsArr.some(
        (e) => e.day === i && e.month === month + 1 && e.year === year
      );
      let type = "";
      //ye highlight krega aaj ka date agr ajj ki date hai 
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        type = activeDay === i ? "today active" : "today";
      } else if (i === activeDay) {
        type = "active";
      }
      if (hasEvent) type += " event";
      days.push({ dayNum: i, type: type.trim() });
    }
    for (let j = 1; j <= nextDays; j++) days.push({ dayNum: j, type: "next-date" });

    return days;
  };
  const days = generateDays();
  const prevMonth = () => (month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1));
  const nextMonth = () => (month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1));
  const gotoToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setActiveDay(today.getDate());
  };
  const gotoDate = () => {
    const parts = dateInput.split("/");
    if (parts.length === 2) {
      const m = parseInt(parts[0]);
      const y = parseInt(parts[1]);
      if (m > 0 && m < 13 && y.toString().length === 4) {
        setMonth(m - 1);
        setYear(y);
        return;
      }
    }
    alert("Invalid date format (mm/yyyy)");
  };
  const handleAddEvent = () => {
    if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
      alert("Please fill all fields");
      return;
    }

    const newEvent = {
      title: eventTitle,
      time: `${convertTime(eventTimeFrom)} - ${convertTime(eventTimeTo)}`
    };

    let updated = [...eventsArr];
    let added = false;
    updated.forEach((d) => {
      if (d.day === activeDay && d.month === month + 1 && d.year === year) {
        d.events.push(newEvent);
        added = true;
      }
    });
    if (!added)
      updated.push({ day: activeDay, month: month + 1, year, events: [newEvent] });
    setEventsArr(updated);
    setShowAddEvent(false);
    setEventTitle("");
    setEventTimeFrom("");
    setEventTimeTo("");
  };

  const handleDeleteEvent = (title) => {
    const updated = eventsArr
      .map((item) => {
        if (item.day === activeDay && item.month === month + 1 && item.year === year) {
          item.events = item.events.filter((e) => e.title !== title);
        }
        return item;
      })
      .filter((e) => e.events.length > 0);
    setEventsArr(updated);
  };

  const activeEvents =
    eventsArr.find((e) => e.day === activeDay && e.month === month + 1 && e.year === year)
      ?.events || [];

  const handleDayClick = (d) => {
    if (d.type.includes("prev-date")) {
      prevMonth();
      setActiveDay(d.dayNum);
    } else if (d.type.includes("next-date")) {
      nextMonth();
      setActiveDay(d.dayNum);
    } else {
      setActiveDay(d.dayNum);
    }
  };

  const getDayName = () => {//ye func day name deega jaise mon tues
    const d = new Date(year, month, activeDay);
    return d.toString().split(" ")[0];
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">⚒️</span> PlanForge
        </Link>
        <div className="nav-links"><Link to="/Main">DashBoard</Link></div>
      </nav>

      <div className="calendar-container">
        <div className="calendar-left">
          <div className="calender">
            <div className="month">
              <i className="fa fa-angle-left prev" onClick={prevMonth}>‹</i>
              <div className="date">{months[month]} {year}</div>
              <i className="fa fa-angle-right next" onClick={nextMonth}>›</i>
            </div>
            <div className="weekdays">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="days">
              {days.map((d, i) => (
                <div key={i} className={`day ${d.type}`} onClick={() => handleDayClick(d)}>
                  {d.dayNum}
                </div>
              ))}
            </div>
            <div className="goto-today">
              <div className="goto">
                <input type="text" placeholder="mm/yyyy" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
                <button className="goto-btn" onClick={gotoDate}>Go</button>
              </div>
              <button className="today-btn" onClick={gotoToday}>Today</button>
            </div>
          </div>
        </div>

        <div className="calendar-right">
          <div className="today-date">
            <div className="event-day">{getDayName()}</div>
            <div className="event-date">{activeDay} {months[month]} {year}</div>
          </div>

          <div className="events">
            {activeEvents.length ? activeEvents.map((e, i) => (
              <div className="event" key={i} onClick={() => handleDeleteEvent(e.title)}>
                <div className="title"><i>●</i><h3 className="event-title">{e.title}</h3></div>
                <div className="event-time">{e.time}</div>
              </div>
            )) : <div className="no-event"><h3>No Events</h3></div>}
          </div>

          <div className={`add-event-wrapper ${showAddEvent ? "active" : ""}`}>
            <div className="add-event-header">
              <div className="title">Add Event</div>
              <i className="close" onClick={() => setShowAddEvent(false)}>✕</i>
            </div>
            <div className="add-event-body">
              <div className="add-event-input"><input type="text" placeholder="Event Name" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} /></div>
              <div className="add-event-input"><input type="text" placeholder="From (HH:MM)" value={eventTimeFrom} onChange={(e) => setEventTimeFrom(e.target.value)} /></div>
              <div className="add-event-input"><input type="text" placeholder="To (HH:MM)" value={eventTimeTo} onChange={(e) => setEventTimeTo(e.target.value)} /></div>
            </div>
            <div className="add-event-footer"><button className="add-event-btn" onClick={handleAddEvent}>Add Event</button></div>
          </div>
        </div>

        <button className="add-event" onClick={() => setShowAddEvent(!showAddEvent)}>+</button>
      </div>
    </div>
  );
};

export default Calendar;
