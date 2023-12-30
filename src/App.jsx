import React, { useState, useEffect } from "react";
import "./App.css";
import * as fs from "fs";
function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState("UTC");
  const [weeklyWorkingDays, setWeeklyWorkingDays] = useState([]);

  const todayDate = new Date();

  useEffect(() => {
    loadWeeklyData();
  }, [currentDate, timezone]);

  const loadWeeklyData = () => {
    // Calculate start and end dates of the week based on the current date
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    // Load weekly working days and times based on UTC-0
    const workingDays = [];
    for (let i = 2; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      workingDays.push({
        date: day,
        startTime: "08:00 AM",
        endTime: "11:00 PM",
      });
    }

    // Adjust working days and times based on the selected timezone
    const adjustedWorkingDays = workingDays.map((day) => {
      const adjustedDate = new Date(
        day.date.toLocaleString("en-US", { timeZone: timezone })
      );
      adjustedDate.setHours(8, 0, 0, 0); // Adjust start time
      day.date = adjustedDate;
      return day;
    });

    setWeeklyWorkingDays(adjustedWorkingDays);
  };

  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateAllTimes = () => {
    const times = [];
    const startTime = 8;
    const endTime = 23;

    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minute of ["00", "30"]) {
        const formattedHour = hour % 12 || 12; // Convert 0 to 12
        const formattedTime = `${formattedHour}:${minute} ${
          hour < 12 ? "AM" : "PM"
        }`;
        times.push(formattedTime);
      }
    }

    return times;
  };

  const selectdTimes = [];

  const allTimes = generateAllTimes(); // Function to generate all half-hour intervals

  const handleCheckboxChange = (time) => {
    // Toggle the selected state of the clicked checkbox
    selectdTimes.push(time);
    console.log(selectdTimes);
  };
  let id = 1;
  const exportJSON = () => {
    let Name = prompt("Enter Name - ");
    const jsonData = selectdTimes.map(([Id, Time, Date]) => ({
      Id,
      Name,
      Date,
      Time,
    }));

    // Convert array of objects to JSON string
    const jsonString = JSON.stringify(jsonData, null, 2); // The third argument (2) is for indentation

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "data.json";

    // Append the link to the body and trigger the click event
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the body
    document.body.removeChild(downloadLink);
  };
  return (
    <>
      <div>
        <div className="week_btn">
          <button onClick={() => handleDateChange(-7)}>
            &larr; &nbsp;Previous Week
          </button>
          <h2>{`${
            days[todayDate.getDay()]
          }, ${todayDate.getDate()} ${todayDate.getFullYear()}`}</h2>
          <button onClick={() => handleDateChange(7)}>
            Next Week &nbsp; &rarr;
          </button>
        </div>

        <div className="timezone">
          <label>Timezones:</label>
          <br />
          <select
            className="select_timezone"
            value={timezone}
            onChange={handleTimezoneChange}
          >
            <option value="UTC">[UTC] Coordinated Universal Time</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
        {weeklyWorkingDays.map((day) => (
          <div className="all_days" key={day.date.toISOString()}>
            <div className="all_days_0">
              <h3 style={{ color: "red" }}>{days[day.date.getDay()]}</h3>
              <p>{`${day.date.getMonth() + 1}/${day.date.getDate()}`}</p>
            </div>
            <div className="all_days_1">
              {/* <h3>Past</h3> */}
              {day.date < todayDate ? (
                <h3>Past</h3>
              ) : (
                allTimes.map((time) => (
                  <div key={time}>
                    <input
                      type="checkbox"
                      id={time}
                      onChange={() =>
                        handleCheckboxChange([
                          id++,
                          time,
                          `${day.date.getDate()}-${
                            day.date.getMonth() + 1
                          }-${day.date.getFullYear()}`,
                          name,
                        ])
                      }
                    />
                    <label htmlFor={time}>{time}</label>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button onClick={exportJSON}>Export in JSON</button>
        </div>
      </div>
    </>
  );
}

export default App;
