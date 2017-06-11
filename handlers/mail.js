const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/password-reset.pug`, options);
    const inlined = juice(html);
    return inlined;
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    from_email = new helper.Email("Daksh from GetFit <dakshshah96@gmail.com>");
    to_email = new helper.Email(options.user.email);
    subject = options.subject;
    content = new helper.Content("text/html", html);
    mail = new helper.Mail(from_email, subject, to_email, content);
    
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
    
    sg.API(request, function(error, response) {
      console.log('Password reset email sent!');
    })

    return;
};