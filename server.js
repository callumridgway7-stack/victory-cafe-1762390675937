const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Contact form handler
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // SMTP configuration - Use environment variables for production
    // For testing, you can use Ethereal or set up Gmail with app password
    let transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || 'testuser@ethereal.email', // placeholder
            pass: process.env.EMAIL_PASS || 'testpass' // placeholder
        }
    });

    const mailOptions = {
        from: email,
        to: 'hello@victorycafe.com',
        subject: `Contact Form: Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/contact.html?success=true'); // Redirect with success flag
    } catch (error) {
        console.error('Error sending email:', error);
        res.redirect('/contact.html?error=true'); // Redirect with error flag
    }
});

// Handle success/error messages (optional enhancement)
app.get('/contact.html', (req, res) => {
    if (req.query.success) {
        // Could serve modified HTML, but for simplicity, just redirect
        res.redirect('/contact.html');
    } else if (req.query.error) {
        res.redirect('/contact.html');
    } else {
        res.sendFile(path.join(__dirname, 'contact.html'));
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});