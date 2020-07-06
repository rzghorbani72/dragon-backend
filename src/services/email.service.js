const {mailJet } = require('../config/vars');
const mailjet = require('node-mailjet')
  .connect(mailJet.publicKey, mailJet.privateKey);

/**
 *sending email using mailjet web API.
 * @private
 */
exports.sendByMailJetByTemplate = ({
  toEmail = null,
  toName = null,
  fromName = null,
  fromEmail = null,
  subject = null,
  templateId = null,
  variables = {},
}) => {
  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: subject,
          TemplateLanguage: true,
          TemplateID: templateId,
          Variables: variables,
          /*          "TemplateErrorReporting": {
            "Email": "reza7gh7290@gmail.com",
            "Name": "Your name"
          } */
        },
      ],
    });
  request
    .then((result) => {
      // console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};