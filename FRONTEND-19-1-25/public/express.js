const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON payloads from webhooks

const port = 3000;

// File path for storing attendance data
const dataFilePath = path.join(__dirname, 'attendanceData.json');

// Function to read the data from the file
function readAttendanceData() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } else {
        return {
            attendedClassesCS: 0, totalClassesCS: 0,
            attendedClassesEE_Lab: 0, totalClassesEE_Lab: 0,
            attendedClassesPhysics: 0, totalClassesPhysics: 0,
            attendedClassesMath: 0, totalClassesMath: 0,
            attendedClassesPPS: 0, totalClassesPPS: 0,
            attendedClassesBEE: 0, totalClassesBEE: 0,
            attendedClassesBSE: 0, totalClassesBSE: 0,
            attendedClassesNSS: 0, totalClassesNSS: 0,
            attendedClassesPhysics_Lab: 0, totalClassesPhysics_Lab: 0
        };
    }
}

// Function to write the data back to the file
function writeAttendanceData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Your class schedule (as before)
const classSchedule = {
    Monday: ["Communication Skills", "EE Lab", "Physics", "Math", "PPS"],
    Tuesday: ["PPS", "Physics Lab"],
    Wednesday: ["Math", "PPS", "BEE", "Physics"],
    Thursday: ["BSE", "BEE", "PPS", "Math", "Physics", "NSS"],
    Friday: ["BEE", "Physics", "Math", "PPS", "BSE", "EE Lab"]
};

// Function to mark all classes as present for the current day
function markAttendanceForToday() {
    const data = readAttendanceData();
    const dayOfWeek = new Date().getDay(); // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    let currentDay;
    switch (dayOfWeek) {
        case 0: currentDay = 'Sunday'; break;
        case 1: currentDay = 'Monday'; break;
        case 2: currentDay = 'Tuesday'; break;
        case 3: currentDay = 'Wednesday'; break;
        case 4: currentDay = 'Thursday'; break;
        case 5: currentDay = 'Friday'; break;
        case 6: currentDay = 'Saturday'; break;
        default: currentDay = '';
    }

    if (classSchedule[currentDay]) {
        classSchedule[currentDay].forEach((subject) => {
            // Increment totalClasses and attendedClasses for the specific subject
            if (subject === "Communication Skills") {
                data.totalClassesCS++;
                data.attendedClassesCS++;
            }
            if (subject === "EE Lab") {
                data.totalClassesEE_Lab++;
                data.attendedClassesEE_Lab++;
            }
            if (subject === "Physics") {
                data.totalClassesPhysics++;
                data.attendedClassesPhysics++;
            }
            if (subject === "Math") {
                data.totalClassesMath++;
                data.attendedClassesMath++;
            }
            if (subject === "PPS") {
                data.totalClassesPPS++;
                data.attendedClassesPPS++;
            }
            if (subject === "BEE") {
                data.totalClassesBEE++;
                data.attendedClassesBEE++;
            }
            if (subject === "BSE") {
                data.totalClassesBSE++;
                data.attendedClassesBSE++;
            }
            if (subject === "NSS") {
                data.totalClassesNSS++;
                data.attendedClassesNSS++;
            }
            if (subject === "Physics Lab") {
                data.totalClassesPhysics_Lab++;
                data.attendedClassesPhysics_Lab++;
            }
        });
    }

    // Write updated data back to the file
    writeAttendanceData(data);
    console.log(`Attendance for ${currentDay} marked as present for all classes.`);
}

// Routes for handling user requests

// Mark attendance manually for a specific day
app.post('/mark-attendance', (req, res) => {
    markAttendanceForToday();
    res.send('Attendance for today has been marked as present for all classes.');
});

// Endpoint to mark a subject as missed (mark absence)
app.post('/mark-absent', (req, res) => {
    const { subject } = req.body;
    if (!subject) {
        return res.status(400).send("Please provide a subject.");
    }

    const data = readAttendanceData();

    // Deduct attendance for the missed subject
    if (subject === "Communication Skills" && data.attendedClassesCS > 0) data.attendedClassesCS--;
    if (subject === "EE Lab" && data.attendedClassesEE_Lab > 0) data.attendedClassesEE_Lab--;
    if (subject === "Physics" && data.attendedClassesPhysics > 0) data.attendedClassesPhysics--;
    if (subject === "Math" && data.attendedClassesMath > 0) data.attendedClassesMath--;
    if (subject === "PPS" && data.attendedClassesPPS > 0) data.attendedClassesPPS--;
    if (subject === "BEE" && data.attendedClassesBEE > 0) data.attendedClassesBEE--;
    if (subject === "BSE" && data.attendedClassesBSE > 0) data.attendedClassesBSE--;
    if (subject === "NSS" && data.attendedClassesNSS > 0) data.attendedClassesNSS--;
    if (subject === "Physics Lab" && data.attendedClassesPhysics_Lab > 0) data.attendedClassesPhysics_Lab--;

    // Write updated data back to the file
    writeAttendanceData(data);
    res.send(`Attendance for ${subject} has been marked as missed.`);
});

// Function to mark multiple absents for a given subject and count
function markMultipleAbsents(subject, count) {
    return new Promise((resolve, reject) => {
        const data = readAttendanceData();

        if (count <= 0) {
            return reject("Count must be a positive number.");
        }

        // Subtract the number of missed classes (count) for the specific subject
        switch (subject) {
            case "Communication Skills":
                data.attendedClassesCS = Math.max(0, data.attendedClassesCS - count);
                break;
            case "EE Lab":
                data.attendedClassesEE_Lab = Math.max(0, data.attendedClassesEE_Lab - count);
                break;
            case "Physics":
                data.attendedClassesPhysics = Math.max(0, data.attendedClassesPhysics - count);
                break;
            case "Math":
                data.attendedClassesMath = Math.max(0, data.attendedClassesMath - count);
                break;
            case "PPS":
                data.attendedClassesPPS = Math.max(0, data.attendedClassesPPS - count);
                break;
            case "BEE":
                data.attendedClassesBEE = Math.max(0, data.attendedClassesBEE - count);
                break;
            case "BSE":
                data.attendedClassesBSE = Math.max(0, data.attendedClassesBSE - count);
                break;
            case "NSS":
                data.attendedClassesNSS = Math.max(0, data.attendedClassesNSS - count);
                break;
            case "Physics Lab":
                data.attendedClassesPhysics_Lab = Math.max(0, data.attendedClassesPhysics_Lab - count);
                break;
            default:
                return reject(`Subject ${subject} is not valid.`);
        }

        // Write updated data back to the file
        writeAttendanceData(data);
        resolve(`${count} absences for ${subject} have been marked.`);
    });
}

// Endpoint to calculate how many more classes to attend to reach a target percentage
app.post('/calculate-classes-required', (req, res) => {
    const { subject, targetPercentage } = req.body;

    if (!subject || !targetPercentage || targetPercentage <= 0) {
        return res.status(400).send("Please provide a valid subject and target percentage.");
    }

    const data = readAttendanceData();

    // Ensure the subject exists in the data file
    const attendedClassesKey = `attendedClasses${subject.replace(/\s+/g, '_')}`;
    const totalClassesKey = `totalClassesInSemester${subject.replace(/\s+/g, '_')}`;

    if (!data[attendedClassesKey] || !data[totalClassesKey]) {
        return res.status(400).send(`No data available for the subject: ${subject}`);
    }

    const attendedClasses = data[attendedClassesKey];
    const totalClassesInSemester = data[totalClassesKey];

    // Calculate how many more classes the user needs to attend to meet the target percentage
    const currentPercentage = (attendedClasses / totalClassesInSemester) * 100;

    if (currentPercentage >= targetPercentage) {
        return res.json({
            message: `You are already meeting the target of ${targetPercentage}% attendance.`
        });
    }

    // Formula to calculate remaining classes required to meet the target percentage
    const requiredClasses = Math.ceil(((targetPercentage / 100) * totalClassesInSemester) - attendedClasses);
    
    if (requiredClasses <= 0) {
        return res.json({
            message: `You need to attend all remaining classes to maintain ${targetPercentage}% attendance.`
        });
    }

    res.json({
        message: `You need to attend ${requiredClasses} more class(es) in ${subject} to reach ${targetPercentage}% attendance.`
    });
});

// Endpoint to retrieve attendance stats
app.get('/', (req, res) => {
    const data = readAttendanceData();

    // Calculate attendance percentage for each subject
    const attendanceStats = {
        attendance: {
            "Communication Skills": data.totalClassesCS > 0 ? (data.attendedClassesCS / data.totalClassesCS) * 100 : 0,
            "EE Lab": data.totalClassesEE_Lab > 0 ? (data.attendedClassesEE_Lab / data.totalClassesEE_Lab) * 100 : 0,
            "Physics": data.totalClassesPhysics > 0 ? (data.attendedClassesPhysics / data.totalClassesPhysics) * 100 : 0,
            "Math": data.totalClassesMath > 0 ? (data.attendedClassesMath / data.totalClassesMath) * 100 : 0,
            "PPS": data.totalClassesPPS > 0 ? (data.attendedClassesPPS / data.totalClassesPPS) * 100 : 0,
            "BEE": data.totalClassesBEE > 0 ? (data.attendedClassesBEE / data.totalClassesBEE) * 100 : 0,
            "BSE": data.totalClassesBSE > 0 ? (data.attendedClassesBSE / data.totalClassesBSE) * 100 : 0,
            "NSS": data.totalClassesNSS > 0 ? (data.attendedClassesNSS / data.totalClassesNSS) * 100 : 0,
            "Physics Lab": data.totalClassesPhysics_Lab > 0 ? (data.attendedClassesPhysics_Lab / data.totalClassesPhysics_Lab) * 100 : 0
        }
    };

    res.json(attendanceStats);
});

// Webhook route to handle requests from Dialogflow
app.post('/webhook', (req, res) => {
    console.log('Received webhook request:', req.body);  // Debugging log

    const { queryResult } = req.body;
    const subject = queryResult.parameters.subject;  // Get the subject from Dialogflow request
    const count = queryResult.parameters.MissedClassesCount;      // Get the count of absences

    // Validate input
    if (!subject || !count || count <= 0) {
        return res.json({
            fulfillmentText: "Please provide a valid subject and a positive number of missed classes."
        });
    }

    // Mark multiple absents for the subject
    markMultipleAbsents(subject, count)
        .then(responseMessage => {
            // Send the response to Dialogflow
            return res.json({
                fulfillmentText: responseMessage
            });
        })
        .catch(error => {
            return res.json({
                fulfillmentText: "Something went wrong while marking absences."
            });
        });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Attendance app listening at http://localhost:${port}`);
});