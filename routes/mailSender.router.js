import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS_KEY,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve("../static"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./static"),
  extName: ".html",
};

const sendEmail = async (Phone,Name,City,tournament) => {
  let emailObj = {
    tournacity: tournament.CITY,
    competition: tournament.TOURNAMENT_NAME,
    entryFee: tournament.ENTRY_FEE,
    Category: "test cat",
    name: Name,
    city: City,
    mobile: Phone,
    dob: 1,
  };

  transporter.use("compile", hbs(handlebarOptions));

  var mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.TEST_USER_EMAIL,
    subject: "Test email",
    template: "entryMail",
    context: emailObj,
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      return console.log(error);
      throw error;
    }
    console.log("Message sent: %s", response.messageId);
  });
  
}

export default sendEmail