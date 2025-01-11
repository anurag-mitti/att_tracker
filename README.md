**Attendance Tracker 
**This project is a web-based application built using React for the frontend and Node.js with Express for the backend. The main objective is to help students track their class attendance, mark classes as missed, and calculate how many more classes they need to attend to maintain a specific attendance percentage.

The chatbot is integrated with Dialogflow for natural language processing, allowing students to interact with the system using voice or text input. Students can query attendance data, mark absences, and check the number of classes they need to attend to maintain a target attendance percentage.

Features
Mark Attendance: Students can mark their attendance as present for specific subjects.
Mark Absence: Students can mark certain subjects as missed (absence).
Calculate Target Percentage: Students can ask how many more classes they need to attend to reach a specific attendance percentage.
Real-Time Attendance Tracking: Displays the attendance percentage of each subject.
Dialogflow Chatbot: Integrated with a Dialogflow chatbot to interact with the application through natural language.
Technologies Used
Frontend: React.js
Backend: Node.js, Express
Database: File-based storage using JSON (attendance data is stored in a attendanceData.json file).
Dialogflow: For creating the chatbot and handling natural language understanding (NLU).
Cron Jobs: For scheduling regular tasks (if required in the future)

Features Overview
1. Frontend (React)
Dashboard: Displays attendance information for different subjects. It fetches data from the backend every few seconds to keep the attendance data updated.
Mark Absent Form: A form to mark a specific number of missed classes for a subject. This data is sent to the backend where attendance is updated accordingly.
Target Percentage Form: Allows the user to enter a target percentage and calculates how many more classes they need to attend to reach that target.
2. Backend (Node.js with Express)
Mark Attendance: Updates the attendance records for each subject when a student attends a class.
Mark Absence: Allows marking a subject as missed for a certain number of classes.
Calculate Classes Required: Given a subject and a target percentage, the backend calculates how many more classes a student needs to attend to meet the target.
Endpoints:
GET /: Fetches the attendance data and attendance percentage for all subjects.
POST /mark-absent: Marks a specific number of missed classes for a subject.
POST /calculate-classes-required: Calculates how many more classes are required to reach a target attendance percentage for a given subject.
3. Dialogflow Integration
Dialogflow Intents: Several intents are set up to handle user queries related to attendance, absences, and target percentage calculations.
Mark Absence: For marking missed classes. The user can say something like "I missed 3 classes of Math".
Target Percentage: For asking how many more classes need to be attended to maintain a target percentage. For example, "How many more classes can I miss in Math to maintain 75% attendance?".
Webhook: The Dialogflow webhook is connected to the backend, and the intent triggers either attendance marking or percentage calculation based on the user's query.
