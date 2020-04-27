const AWS = require('aws-sdk');
const querystring = require("querystring");
const moment = require('moment-timezone');

exports.handler = function (event, context, callback) {
  try {
    let data = querystring.parse(event.body);
    let name = data.name;
    let company = data.company;
    let email = data.email;
    let phone = data.phone;
    let message = data.message;
    let messageHTML = message.replace(/\r?\n/g, '<br />');
    let date = moment().tz('America/Sao_Paulo');

    function getStyle(element) {
      let style = {
        h1: {
          "font-family": "'Raleway', 'Arial', sans-serif",
          "font-size": "40px",
          "background-color": "#f7931b",
          "padding": "25px",
          "color": "white"
        },
        h2: {
          "color":" #f7931b",
          "font-size": "18px",
          "margin": "3pt 0 5pt 0",
          "font-weight": "bold"
        },
        logo: {
          "margin": "auto",
          "display": "block"
        },
        main: {
          "font-family": "'Open Sans', 'Arial', sans-serif",
          "font-size": "16px",
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
        ul: {
          "margin": "0"
        },
        li: {
          "list-style": "none"
        },
        line: {
          "width": "100%",
          "border-top": "1px #666 dotted"
        },
        footer: {
          "color": "grey",
          "font-size": "13px",
          "padding": "40px 0 0 0",
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

    let html = `
      <div style="${getStyle("main")}">
        <div style="${getStyle("inner")}">
          <img src="http://www.locamex.com.br/wp-content/uploads/2018/04/Locamex_Logo_Slogan.png" height="150" style="${getStyle("logo")}"/>
          <div>Data: ${date.format("DD-MM-YYYY")} | Horário: ${date.format("HH:MM")}</div>
          <div style="${getStyle("line")}"></div>
          <h2 style="${getStyle("h2")}">Dados Informados</h2>
          <ul style="${getStyle("ul")}">
            <li style="${getStyle("li")}">Nome: ${name}</li>
            <li style="${getStyle("li")}">Empresa: ${company}</li>
            <li style="${getStyle("li")}">Email: ${email}</li>
            <li style="${getStyle("li")}">Telefone: ${phone}</li>
          </ul>
          <div style="${getStyle("line")}"></div>
          <h2 style="${getStyle("h2")}">Descrição do Projeto</h2>
          <div>
              ${messageHTML}
          </div>
          <div style="${getStyle("line")}"></div>
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
      Source: 'Contato <tgnemecek@gmail.com>',
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