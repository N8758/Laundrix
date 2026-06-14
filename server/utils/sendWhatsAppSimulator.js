const axios = require("axios");

async function sendWhatsAppSimulator(
  to,
  templateName,
  parameters = []
) {
  try {

    let body = {
      messaging_product: "whatsapp",
      to: String(to),
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "en"
        }
      }
    };

    // OTP Authentication template
    if (templateName === "otp_cutomer") {

  body.template.components = [
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: String(parameters[0])
        }
      ]
    },
    {
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [
        {
          type: "text",
          text: String(parameters[0])
        }
      ]
    }
  ];

} else {

      // Normal templates
      body.template.components = [
        {
          type: "body",
          parameters: parameters.map(item => ({
            type: "text",
            text: String(item)
          }))
        }
      ];
    }

    const response = await axios.post(
      process.env.WHATSAPP_API_URL,
      body,
      {
        headers: {
          apikey: process.env.WHATSAPP_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("WhatsApp Sent:", response.data);

  } catch (error) {
    console.log(
      "WhatsApp Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = sendWhatsAppSimulator;