const AWS = require('aws-sdk');
const querystring = require("querystring");
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const uploadFile = require('./upload-file.js');

function getStyle(element) {
  let style = {
    h1: {
      "font-family": "'Open Sans', 'Arial', sans-serif",
      "font-size": "40px",
      "background-color": "#f7931b",
      "padding": "25px",
      "color": "white"
    },
    h2: {
      "color":" #f7931b",
      "font-size": "1.5em",
      "margin": "3pt 0 5pt 0",
      "font-weight": "bold"
    },
    logo: {
      "margin": "auto",
      "display": "block"
    },
    main: {
      "font-family": "'Open Sans', 'Arial', sans-serif",
      "font-size": "14px",
      "border": "1px solid #cccccc",
      "background-color": "#f9f9f9",
      "padding": "0",
      "margin": "auto",
      "width": "100%",
      "max-width": "700px",
      "box-shadow": "3px 3px 5px grey"
    },
    inner: {
      "margin": "auto",
      "width": "100%",
      "max-width": "600px",
      "padding": "0 10px",
    },
    line: {
      "width": "100%",
      "border-top": "1px #666 dotted"
    },
    footer: {
      "color": "grey",
      "font-size": "0.9em",
      "margin": "20px 0",
      "text-align": "center"
    }
  }
  if (!style[element]) return "";

  let string = "";
  for (key in style[element]) {
    string += `${key}: ${style[element][key]}; `
  }
  return string;
}

exports.handler = function (event, context, callback) {
  try {
    let data = querystring.parse(event.body);
    if (data.bot) {
      callback(null, true);
      return;
    }

    let name = data.name;
    let company = data.company;
    let email = data.email;
    let phone = data.phone;
    let message = data.message;
    let messageHTML = message.replace(/\r?\n/g, '<br />');
    let date = moment().tz('America/Sao_Paulo');
    let file = data.file;
    let code = new Date().getTime() + "-";
    let filename = data.filename ? code + data.filename : undefined;

    let locamexEmail = 'locamex@locamex.com.br';

    let token = data.token;
    let secret = process.env.RECAPTCHA_SECRET_KEY;
    let reCaptchaURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    fetch(reCaptchaURL, {method: "POST"})
      .then(res => res.json())
      .then(body => {
        if (!body.success || body.score < 0.6) {
          console.log('reCaptcha failed');
          callback(null, true);
          return;
        } else {
          if (file) {
            uploadFile(file, filename, sendEmail);
          } else sendEmail();
        }
      });

    function sendEmail(err, fileURL) {
      console.log("Sending Email");
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      let html = `
      <div style="${getStyle("main")}" class="main">
        <div style="${getStyle("inner")}">
          <img src="https://www.locamex.com.br/assets/logo-email.png" height="150" style="${getStyle("logo")}"/>
          <div>Data: ${date.format("DD-MM-YYYY")} | Horário: ${date.format("HH:MM")}</div>
          <div style="${getStyle("line")}"></div>
          <h2 style="${getStyle("h2")}">Dados Informados</h2>
          <div>
            <div>Nome: ${name}</div>
            <div>Empresa: ${company}</div>
            <div>Email: ${email}</div>
            <div>Telefone: ${phone}</div>
          </div>
          <div style="${getStyle("line")}"></div>
          <h2 style="${getStyle("h2")}">Descrição do Projeto</h2>
          <div>
              ${messageHTML}
          </div>
          <div style="${getStyle("line")}"></div>
          ${fileURL ?
            `<h2 style="${getStyle("h2")}">Arquivo Enviado</h2>
            <a href="${fileURL}">${fileURL}</a>
            <div style="${getStyle("line")}"></div>`
          : ""}
          <div style="${getStyle("footer")}">
          LOCAMEX - Containers Personalizados<br/>
          <a href="https://www.locamex.com.br">www.locamex.com.br</a><br/>
          <a href="mailto:engenharia@locamex.com.br">engenharia@locamex.com.br</a><br/>
          (11) 5532-0790 / 5533-5614 / 5031-4762 / 3132-7175<br/>
          São Paulo - SP
        </div>
      </div>
    `

    // Set the region
    AWS.config.update({
      region: 'us-east-1'
    });

    // Create sendEmail params to Client
    let paramsClient = {
      Destination: {
        CcAddresses: [],
        ToAddresses: [email]
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
          Data: 'LOCAMEX - Pedido de Orçamento de Container'
        }
      },
      Source: `Locamex <${locamexEmail}>`,
      ReplyToAddresses: [locamexEmail],
    };

    // Create sendEmail params to Locamex
    let paramsLocamex = {
      ...paramsClient,
      Destination: {
        CcAddresses: [],
        ToAddresses: [locamexEmail]
      },
      ReplyToAddresses: [email],
    }

    let awsConfig = {
      apiVersion: '2010-12-01',
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_KEY
    }

    // Create the promise and SES service object
    let sendToClient = new AWS.SES(awsConfig).sendEmail(paramsClient).promise();
    let sendToLocamex = new AWS.SES(awsConfig).sendEmail(paramsLocamex).promise();

    Promise.all([sendToClient, sendToLocamex])
      .then(() => {
        console.log("Email Sent!");
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            success: true
          })
        });
      })
      .catch((err) => {
        console.error(err, err.stack);
        callback(err);
      });
    }
  } 
  catch (err) {
    console.log(err);
    callback(err);
  }
}