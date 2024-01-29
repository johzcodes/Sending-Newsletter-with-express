const html = `
  <html>
  <body>
  
  </body>
  </html>
`


async function  emailTimer () {
    cron.schedule('0 12 10 * 0', () => {
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: this.address,
          subject: 'Periodic Email',
          text: `This is a periodic email to ${this.fullName} at ${this.address}. Phone Number: ${this.phoneNumber}`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending periodic email:', error);
          } else {
            console.log('Periodic email sent successfully:', info.response);
          }
        });
      });
}

module.exports = emailTimer ;