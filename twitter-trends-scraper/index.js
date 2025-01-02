// const express = require('express');
// const mongoose = require('mongoose');
// const fetchTrends = require('./scripts/scraper');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB Schema and Model
// const TrendSchema = new mongoose.Schema({
//     uniqueId: { type: String, required: true },
//     trends: { type: [String], required: true },
//     timestamp: { type: Date, default: Date.now },
//     ipAddress: { type: String, required: true },
// });

// const Trend = mongoose.model('Trend', TrendSchema);

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000,
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// // Serve Static Files
// app.use(express.static(path.join(__dirname, 'views')));


// // Scraper Route
// app.get('/run-scraper', async (req, res) => {
//     try {
//         const result = await fetchTrends();

//         if (!result.error) {
//             // Add unique ID and save to MongoDB
//             const uniqueId = uuidv4();
//             const newTrend = new Trend({ 
//                 uniqueId, 
//                 trends: result.trends, 
//                 ipAddress: result.ipAddress, 
//                 timestamp: new Date() 
//             });
//             await newTrend.save();

//             // Respond with the required JSON and HTML
//             res.json({
//                 message: 'Scraper ran successfully!',
//                 data: {
//                     uniqueId,
//                     trends: result.trends,
//                     timestamp: newTrend.timestamp,
//                     ipAddress: result.ipAddress,
//                 },
//             });
//         } else {
//             res.json({ message: 'Scraper encountered an issue', error: result.error });
//         }
//     } catch (error) {
//         console.error('Error running scraper:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
