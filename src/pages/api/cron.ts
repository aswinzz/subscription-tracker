import type { NextApiRequest, NextApiResponse } from 'next';
const mailgun = require("mailgun-js");
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
    const DOMAIN = "sandboxdc9528a0a8124e5eb68cba37c1b2d01d.mailgun.org";
    const mg = mailgun({apiKey: "99116b3990daa523d973c8f4da7d3c49-ed54d65c-10910d6d", domain: DOMAIN});
    const data = {
        from: "Mailgun Sandbox <postmaster@sandboxdc9528a0a8124e5eb68cba37c1b2d01d.mailgun.org>",
        to: "aswinvb.aswin6@gmail.com",
        subject: "Hello",
        text: "Testing some Mailgun awesomness!"
    };
    mg.messages().send(data, function () {
        console.log("SUCCESS");
    });
    
 
  return response.json({ success: true });
}