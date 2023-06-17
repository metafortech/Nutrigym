//nodemailer
const nodemailer = require("nodemailer");

const sendEmail = async (emailOptions) => {
  //1)create transporter (service that eill send email like "gmail")
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465", // if secure is true -> port = 465 , if secure is false -> port =587
    secure: true,
    auth: {
      user: "",
      pass: "",
    },
  });
  //2)define email options (from whom ,to whome , email content )

  const mailOptions = {
    from: "Nutri Gym App <NutriGymApp@gmail.com>",
    to: emailOptions.email,
    subject: emailOptions.subject,
    text: emailOptions.message,
  };

  //3)send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
