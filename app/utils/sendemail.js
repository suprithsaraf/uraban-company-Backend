const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.PASS_KEY, // Your email password or app password
    },
});

const sendEmail = (to, subject, text) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.EMAIL, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

module.exports = sendEmail;
 