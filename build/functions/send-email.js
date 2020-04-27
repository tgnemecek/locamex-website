const AWS = require('aws-sdk');
const querystring = require("querystring");
const moment = require('moment');

exports.handler = function (event, context, callback) {
  try {
    let data = querystring.parse(event.body);
    let name = data.name;
    let company = data.company;
    let email = data.email;
    let phone = data.phone;
    let message = data.message;

    function getStyle(element) {
      let style = {
        h1: {
          "font-family": "'Raleway', 'Arial', sans-serif",
          "font-size": "40px",
          "background-color": "#f7931b",
          "padding": "25px",
          "color": "white"
        },
        main: {
          "font-family": "'Open Sans', 'Arial', sans-serif",
          "font-size": "18px"
        }
      }
      let string = "";
      for (key in style[element]) {
        string += `${key}: ${style[element][key]}; `
      }
      return string;
    }

    let html = `
      <header>
          <h1 style=${getStyle(h1)}>
          LOCAMEX - Formulário de Contato
          </h1>
      </header>
      <main style=${getStyle(main)}>
          <div>
              ${message}
          </div>
          <ul>
              <li>Nome: ${name}</li>
              <li>Empresa: ${company}</li>
              <li>Email: ${email}</li>
              <li>Telefone: ${phone}</li>
          </ul>
      </main>
    `

    // Set the region
    AWS.config.update({
      region: 'us-east-1'
    });

    // Create sendEmail params 
    let params = {
      Destination: {
        CcAddresses: [],
        ToAddresses: ['thiago@locamex.com.br']
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html
          },
          Text: {
            Charset: "UTF-8",
            Data: `LOCAMEX - Formulário de Contato. Mensagem: ${message}. Nome: ${name}. Empresa: ${company}. Email: ${email}. Telefone: ${phone}.`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Formulário de Contato - Locamex'
        }
      },
      Source: 'Formulário de Contato <tgnemecek@gmail.com>',
      ReplyToAddresses: ['tgnemecek@gmail.com'],
    };

    // Create the promise and SES service object
    let sendPromise = new AWS.SES({
      apiVersion: '2010-12-01',
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_KEY
    }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
      function (data) {
        console.log(data.MessageId);
      }).catch(
      function (err) {
        console.error(err, err.stack);
      });
  } catch (err) {
    console.log(err);
    callback(err);
  }
}