import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});




export const send_mail = async (to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};



// export const send_mail = ({recipient_email, email_type, template})=> {
//     // const recipient_email = recipient_email;
//     // const email_type = email_type;
//     // const template = template;

//     console.log("email credentials: ", recipient_email, email_type, template)
// }