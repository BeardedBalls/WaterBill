// CalendarComponent.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <h2>My Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <p>Selected date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;
