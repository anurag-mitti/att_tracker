import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// File path to watch
const filePath = path.resolve('./public/Server_hosting_backend/attendanceData.json');

// Serve SSE for updates
app.get('/attendance-data', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('Client connected to /attendance-data');

  // Function to read and send data
  const sendFileData = () => {
    fs.readFile(filePath, 'utf8', (err, rawData) => {
      if (err) {
        console.error('Error reading file:', err.message);
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
        return;
      }
  
      try {
        // Parse and validate the JSON
        const data = JSON.parse(rawData);
        console.log('Sending data:', data); // Debug log for server
        // Send the data as a string in SSE format
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError.message);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Invalid JSON format' })}\n\n`);
      }
    });
  };
  
  // Send initial data
  sendFileData();

  // Watch for file changes
  const watcher = fs.watch(filePath, (eventType, filename) => {
    if (eventType === 'change') {
      console.log(`File ${filename} has changed.`);
      sendFileData();
    }
  });

  // Cleanup on client disconnect
  req.on('close', () => {
    console.log('Client disconnected');
    watcher.close(); // Stop watching the file
    res.end();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
