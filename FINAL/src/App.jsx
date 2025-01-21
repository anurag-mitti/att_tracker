import React, { useState, useEffect } from "react";
import Squares from "./Backgrounds/Squares";
import SplitText from "./SplitText";
import GradientText from "./GradientText/GradientText";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import CountUp from "./CountUp/CountUp";

function App() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [subject, setSubject] = useState("");
  const [missedCount, setMissedCount] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("");
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", details: "" });

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3000/")
        .then((response) => response.json())
        .then((data) => {
          setAttendanceData(data.attendance);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const renderAttendancePercentage = (subject) => {
    if (attendanceData && attendanceData[subject] !== undefined) {
      return attendanceData[subject].toFixed(2);
    }
    return "N/A";
  };

  const handleAbsentSubmit = (event) => {
    event.preventDefault();
    if (!subject || !missedCount || isNaN(missedCount) || missedCount <= 0) {
      setError("Please provide a valid subject and a positive number of missed classes.");
      return;
    }
    setError("");
    const data = { subject, count: parseInt(missedCount, 10) };
    fetch("http://localhost:3000/mark-absent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setResponseMessage(responseData.message);
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
        setResponseMessage("Error occurred while marking as absent.");
      });
  };

  const handleCalculateSubmit = (event) => {
    event.preventDefault();
    if (!subject || !targetPercentage || isNaN(targetPercentage) || targetPercentage <= 0) {
      setError("Please provide a valid subject and a target percentage greater than 0.");
      return;
    }
    setError("");
    const data = { subject, targetPercentage: parseFloat(targetPercentage) };
    fetch("http://localhost:3000/calculate-classes-required", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setResponseMessage(responseData.message);
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
        setResponseMessage("Error occurred while calculating required classes.");
      });
  };

  const openModal = (title, details) => {
    setModalContent({ title, details });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!attendanceData) {
    return <div>Loading attendance data...</div>;
  }

  return (
    <div
      className="App"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Squares background animation */}
      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#fff"
        hoverFillColor="black"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />

      {/* Black block containing main content */}
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          maxWidth: "800px",
          margin: "50px auto",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
          zIndex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Updated heading */}
        <div>
          <SplitText
            text="Hello, BIT!"
            className="text-[10rem] font-semibold text-center" // Adjusted font size
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
          />
        </div>

        {/* Centered Gradient Text */}
        <div
          className="flex flex-col justify-center items-center text-center text-2xl h-[20vh] w-full"
        >
          Your sleep is our{" "}
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff"]}
            animationSpeed={3}
            className="inline-block"
          >
            priority
          </GradientText>
          !
        </div>

        {/* Attendance Section */}
        <div className="card-container flex flex-wrap justify-center">
          {Object.keys(attendanceData).map((subject) => (
            <SpotlightCard
              key={subject}
              className="custom-spotlight-card m-4" // Add margin for spacing
              spotlightColor="rgba(0, 229, 255, 0.2)"
              style={{ margin: "10px" }} // Additional margin for spacing
            >
              <h2 className="text-3xl font-bold">{subject}</h2>
              <CountUp
                from={0}
                to={renderAttendancePercentage(subject)}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              <div className="learn-more-btn-container">
                <button
                  onClick={() =>
                    openModal(
                      subject,
                      `Attendance Percentage: ${renderAttendancePercentage(subject)}%`
                    )
                  }
                  className="learn-more-btn"
                >
                  <span>Learn </span>
                  <span>more</span>
                </button>
              </div>
            </SpotlightCard>
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

        {error && <div style={{ color: "red" }}>{error}</div>}
        {responseMessage && (
          <div style={{ marginTop: "20px" }}>
            <strong>{responseMessage}</strong>
          </div>
        )}

        <h2>Chat with our Assistant</h2>
        <iframe
          width="350"
          height="430"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/522b241d-8513-4381-8ee1-336b93bfc6a6"
          title="Dialogflow Chatbot"
        ></iframe>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modalContent.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: modalContent.details }}></p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;