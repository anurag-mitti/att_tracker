import React, { useState, useEffect } from 'react';

function App() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [subject, setSubject] = useState('');
  const [missedCount, setMissedCount] = useState('');
  const [targetPercentage, setTargetPercentage] = useState('');
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState(''); // State to store response message

  useEffect(() => {
    // Function to fetch the latest attendance data from the backend
    const fetchData = () => {
      fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => {
          setAttendanceData(data.attendance);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    };

    // Fetch data once when the component mounts
    fetchData();

    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchData, 3000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const renderAttendancePercentage = (subject) => {
    if (attendanceData && attendanceData[subject] !== undefined) {
      return attendanceData[subject].toFixed(2);
    }
    return 'N/A';
  };

  // Handle the form submission for marking attendance as absent
  const handleAbsentSubmit = (event) => {
    event.preventDefault();

    // Check for valid subject and missed count
    if (!subject || !missedCount || isNaN(missedCount) || missedCount <= 0) {
      setError('Please provide a valid subject and a positive number of missed classes.');
      return;
    }

    // Reset the error message if everything is valid
    setError('');

    // Send a POST request to mark the attendance as missed (absent)
    const data = { subject, count: parseInt(missedCount, 10) };

    fetch('http://localhost:3000/mark-absent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        setResponseMessage(responseData.message); // Set the response message from backend
        fetchData(); // Refresh attendance data after updating
      })
      .catch(err => {
        console.error("Error submitting data:", err);
        setResponseMessage('Error occurred while marking as absent.');
      });
  };

  // Handle the form submission for calculating required classes
  const handleCalculateSubmit = (event) => {
    event.preventDefault();

    // Check for valid subject and target percentage
    if (!subject || !targetPercentage || isNaN(targetPercentage) || targetPercentage <= 0) {
      setError('Please provide a valid subject and a target percentage greater than 0.');
      return;
    }

    // Reset the error message if everything is valid
    setError('');

    // Send a POST request to calculate the required classes
    const data = { subject, targetPercentage: parseFloat(targetPercentage) };

    fetch('http://localhost:3000/calculate-classes-required', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        setResponseMessage(responseData.message); // Set the response message from backend
      })
      .catch(err => {
        console.error("Error submitting data:", err);
        setResponseMessage('Error occurred while calculating required classes.');
      });
  };

  if (!attendanceData) {
    return <div>Loading attendance data...</div>;
  }

  return (
    <div className="App">
      <h1>Attendance Tracker</h1>
      <div>
        {/* Render attendance percentage for each subject */}
        {Object.keys(attendanceData).map((subject) => (
          <div key={subject}>
            <h3>{subject}</h3>
            <p>Attendance Percentage: {renderAttendancePercentage(subject)}%</p>
          </div>
        ))}
      </div>

      <h2>Mark Attendance as Absent</h2>
      <form onSubmit={handleAbsentSubmit}>
        <div>
          <label htmlFor="subject">Subject: </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select a Subject</option>
            <option value="Communication Skills">Communication Skills</option>
            <option value="EE Lab">EE Lab</option>
            <option value="Physics">Physics</option>
            <option value="Math">Math</option>
            <option value="PPS">PPS</option>
            <option value="BEE">BEE</option>
            <option value="BSE">BSE</option>
            <option value="NSS">NSS</option>
            <option value="Physics Lab">Physics Lab</option>
          </select>
        </div>
        <div>
          <label htmlFor="missedCount">Number of Missed Classes: </label>
          <input
            id="missedCount"
            type="number"
            value={missedCount}
            onChange={(e) => setMissedCount(e.target.value)}
            min="1"
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      <h2>Calculate Classes Required to Reach Target Percentage</h2>
      <form onSubmit={handleCalculateSubmit}>
        <div>
          <label htmlFor="subject">Subject: </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select a Subject</option>
            <option value="Communication Skills">Communication Skills</option>
            <option value="EE Lab">EE Lab</option>
            <option value="Physics">Physics</option>
            <option value="Math">Math</option>
            <option value="PPS">PPS</option>
            <option value="BEE">BEE</option>
            <option value="BSE">BSE</option>
            <option value="NSS">NSS</option>
            <option value="Physics Lab">Physics Lab</option>
          </select>
        </div>
        <div>
          <label htmlFor="targetPercentage">Target Percentage: </label>
          <input
            id="targetPercentage"
            type="number"
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(e.target.value)}
            min="1"
            max="100"
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display the response message from the backend */}
      {responseMessage && <div style={{ marginTop: '20px' }}><strong>{responseMessage}</strong></div>}

      {/* Dialogflow Chatbot Iframe */}
      <h2>Chat with our Assistant</h2>
      <iframe
        width="350"
        height="430"
        allow="microphone;"
        src="https://console.dialogflow.com/api-client/demo/embedded/522b241d-8513-4381-8ee1-336b93bfc6a6"
        title="Dialogflow Chatbot"
      ></iframe>
    </div>
  );
}

export default App;
