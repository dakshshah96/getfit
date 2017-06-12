const pug = require('pug');
const juice = require('juice');
const promisify = require('es6-promisify');
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;

// generate HTML from email template written in Pug
const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/password-reset.pug`, options);
    const inlined = juice(html);
    return inlined;
}

// send email handler
exports.send = async (options) => {
    // store generated html so it can be passed
    const html = generateHTML(options.filename, options);

    // email details
    from_email = new helper.Email("Daksh from GetFit <dakshshah96@gmail.com>");
    to_email = new helper.Email(options.user.email);
    subject = options.subject;
    content = new helper.Content("text/html", html);
    mail = new helper.Mail(from_email, subject, to_email, content);
    
    // use sendgrid to handle reset password emails
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
    
    // log to console once password reset link is sent by email
    sg.API(request, function(error, response) {
      console.log('Password reset email sent!');
    })

    return;
};