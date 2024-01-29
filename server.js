const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const Email = require('./emailModel');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'))

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EmailNewsletter');

// Middleware
app.use(bodyParser.json());




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ifeoluwajohz@gmail.com',
    pass: 'kwzjvaapycadrefe',
  },
});


app.get('/', (req, res) => {
    res.render('index');
})
// Define routes
app.post('/add-email', async (req, res) => {
  try {
    // Save email to the database`
    const newEmail = new Email(req.body);
    const savedEmail = await newEmail.save();

    res.json(savedEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Automatically send an email 

const sendWeeklyEmail = async () => {
  try {
    // Fetch all emails from the database
    const allEmails = await Email.find();

    // Create an array of recipient addresses
    const recipients = allEmails.map((email) => email.address);

    // Send email using nodemailer
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: recipients.join(', '), // Combine addresses into a comma-separated string
      subject: 'Weekly Newsletter',
      text: 'This is your weekly newsletter. Thank you for being part of our community!',
    };

    await transporter.sendMail(mailOptions);
    console.log('Weekly email sent successfully');
  } catch (error) {
    console.error('Error sending weekly email:', error);
  }
};

// Schedule the weekly email task to run every Sunday at 12:00 PM
cron.schedule('* * * * *', sendWeeklyEmail);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
