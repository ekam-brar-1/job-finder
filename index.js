const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-app-password',    // Replace with the App Password generated from Gmail
  },
});

// Function to send email
const sendEmail = async (recipient, subject, message) => {
  const mailOptions = {
    from: 'your-email@gmail.com', // Replace with your Gmail
    to: recipient,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error); // Log detailed error message
  }
};

const checkJobs = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://hiring.amazon.com/', {
      waitUntil: 'networkidle2',
    });
    const noJobsDivExists = await page.evaluate(() => {
      const noJobsDiv = document.querySelector('div.no-jobs-message'); // Adjust the selector
      return !!noJobsDiv; e
    });

    await browser.close();

    if (!noJobsDivExists) {
      
      await sendEmail(
        'recipient-email@example.com', // Replace with recipient's email
        'Job Availability Notification',
        'Jobs are available at Amazon! Check out the listings here: https://hiring.amazon.com/'
      );
      console.log('Jobs are available!');
    } else {
      console.log('No jobs are available.');
    }
  } catch (error) {
    console.error('Error during job check:', error);
  }
};


setInterval(() => {
  console.log('Checking for jobs...');
  checkJobs();
}, 20000);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

