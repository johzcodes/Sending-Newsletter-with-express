const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron =  require('node-cron');
const emailTimer = require('./controllers')

const emailSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  fullname:{
    type : String,
    required : [true, "FullName is required"],
    lowercase: true,
    trim : true
  },
  telephone:{
    type: Number,
    required: [true, "Please fill in your Phone number"],
    trim : true
  }
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ifeoluwajohz@gmail.com',
    pass: 'kwzjvaapycadrefe',
  },
});

// Pre-save hook to send an email using nodemailer
emailSchema.pre('save', async function (next) {
  try {
    // Ensure there is a valid email address before attempting to send
    if (!this.address) {
      console.error('No recipient defined for the email');
      return next();
    }

    const mailOptions = {
      from: 'ifeoluwajohz@gmail.com',
      to: this.address,
      subject: 'New Email Added',
      text: `This is a periodic email to ${this.fullname} at ${this.address}. Phone Number: ${this.telephone || 'Not provided'}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    next();

    emailTimer()

    console.log('Email scheduled successfully');
    next();
  } catch (error) {
    console.error('Error scheduling email:', error);
    next(error);
  }
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
