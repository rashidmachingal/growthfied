const emailTemplate = (subject, content) => {
    return  `
    <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif; color: #000000;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0f0f0;">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dcdcdc;">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-bottom: 1px solid #dcdcdc;">
                               <img src="https://i.postimg.cc/Z0tfbmYW/logo.png" width="180px" />
                            </td>
                        </tr>
                      <tr>
                         <td style="padding: 10px; padding-bottom: 0; text-align: center;">
                                <h3 style="margin: 0; color: #000000;">${subject}</h3>
                          </td>
                      </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left;">
                                <p style="margin: 0; line-height: 1.5;">
                                    ${content}
                                </p>
                                <p style="margin: 20px 0 0 0; line-height: 1.5;">
                                    If you have any questions, feel free to contact our support team <b>growthfied@gmail.com</b>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #dcdcdc;">
                                <p style="margin: 0; font-size: 12px; color: #888888;">&copy; Growthfied - All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `
}


const customerOrderEmailTemplate = (data) => {
   return  `
    <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif; color: #000000;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0f0f0;">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dcdcdc;">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-bottom: 1px solid #dcdcdc;">
                               <img src="${data.store_image}" style="width: 5.7rem; height: 5.7rem; border-radius: 50%; object-position: center; object-fit: cover; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  "/>
                              <h3 style="margin: 0; color: #000000; margin-top: 5px;">${data.store_name}</h3>

                            </td>
                        </tr>
                      <tr>
                         <td style="padding: 10px; padding-bottom: 0; text-align: center;">
                                <h3 style="margin: 0; color: #000000;">Order Notification</h3>
                          </td>
                      </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left;">
                                <p style="margin: 0; line-height: 1.5; font-size: 15px;">
                                    Hi ${data.customer_name}, ${data.content}
                                </p>
                               <div style="margin-top: 5px;" >
                                 <a target="_blank" href="${data.tracking_link}" >Track Order ↗</b></a>
                               </div>
                                <p style="margin: 20px 0 0 0; line-height: 1.5; font-size: 15px;">
                                    If you have any questions, feel free to contact through whatsapp <b>+91 ${data.store_whatsapp_number}</b>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #dcdcdc;">
                                <p style="margin: 0; color: #888888;">${data.store_name}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `
}
const adminOrderEmailTemplate = (data) => {
   return  `
    <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif; color: #000000;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0f0f0;">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #dcdcdc;">
                        <tr>
                            <td style="padding: 20px; text-align: center; border-bottom: 1px solid #dcdcdc;">
                               <img src="${data.store_image}" style="width: 5.7rem; height: 5.7rem; border-radius: 50%; object-position: center; object-fit: cover; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  "/>
                              <h3 style="margin: 0; color: #000000; margin-top: 5px;">${data.store_name}</h3>

                            </td>
                        </tr>
                      <tr>
                         <td style="padding: 10px; padding-bottom: 0; text-align: center;">
                                <h3 style="margin: 0; color: #000000;">New Order</h3>
                          </td>
                      </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left;">
                                <p style="margin: 0; line-height: 1.5; font-size: 15px;">
                                    Hi ${data.store_name}, ${data.content}
                                </p>
                               <div style="margin-top: 5px;" >
                                 <a target="_blank" href="${data.tracking_link}" >View Order Details ↗</b></a>
                               </div>
                                <p style="margin: 20px 0 0 0; line-height: 1.5; font-size: 15px;">
                                   If you have any questions, feel free to contact our support team growthfied@gmail.com
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; border-top: 1px solid #dcdcdc;">
                                <p style="margin: 0; color: #888888;">${data.store_name}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `
}

module.exports = { emailTemplate, customerOrderEmailTemplate, adminOrderEmailTemplate }