import React, { useEffect, useState } from "react";
import "./App.css";
import SplitText from "./SplitText";
import { SlideTabsExample } from "./SlideTabsExample";
import GradientText from "./GradientText/GradientText";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import Squares from "./Backgrounds/Squares";
import Dock from './Dock/Dock';
import CountUp from './CountUp/CountUp'

function App() {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", details: "" });

  // Fetch attendance data using SSE
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/attendance-data");

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getAttendancePercentage = (attended, total) => {
    if (attended === null || total === null) return "Loading...";
    return ((attended / total) * 100).toFixed(2);
  };

  const openModal = (title, details) => {
    setModalContent({ title, details });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const spotlightData = [
    {
      title: "CSE",
      attended: data.attendedClassesCS,
      total: data.totalClassesCS,
    },
    {
      title: "BEE", 
      attended: data.attendedClassesBEE,
      total: data.totalClassesBEE,
    },
    {
      title: "Physics",
      attended: data.attendedClassesPhysics,
      total: data.totalClassesPhysics,
    },
    {
      title: "Math",
      attended: data.attendedClassesMath,
      total: data.totalClassesMath,
    },
    {
      title: "PPS",
      attended: data.attendedClassesPPS,
      total: data.totalClassesPPS,
    },
  ];

  return (
    <>
      <Dock collapsible={false} position="left" responsive="bottom" />
      <Squares
        direction="diagonal"
        speed={0.3}
        borderColor="rgba(255, 255, 255, 0.1)"
        squareSize={40}
        hoverFillColor="rgba(255, 255, 255, 0.2)"
        backgroundColor="rgba(0, 0, 0, 0.8)"
        gridGap={10}
        animationSpeed={1.5}
      />

      <div id="root">
        <div>
          <SlideTabsExample />
        </div>
        <div>
          <SplitText
            text="Hello, BIT!"
            className="text-2xl font-semibold text-center"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
          />
        </div>
        <div className="text-2xl">
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
        <div className="card-container">
          {spotlightData.map((item, index) => (
            <SpotlightCard
              key={index}
              className="custom-spotlight-card"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <i className="fa fa-lock"></i>
              <h2 className="text-3xl font-bold">{item.title}</h2>
              <CountUp
                from={0}
                to={getAttendancePercentage(item.attended, item.total)}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              <div className="learn-more-btn-container">
                <button
                  onClick={() =>
                    openModal(
                      item.title,
                      `Attendance: ${item.attended} out of ${item.total} classes.`
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

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{modalContent.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: modalContent.details }}></p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
