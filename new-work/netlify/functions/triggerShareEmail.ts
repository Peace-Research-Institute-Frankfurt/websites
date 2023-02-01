import { Handler } from "@netlify/functions";
import validator from "validator";
import fetch from "node-fetch";

// const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

interface Post {
  title: string;
  link: string;
  authors: Array<string>
}

interface RequestBody {
  userEmail: string;
  message?: string;
  targetEmails: Array<string>;
  posts: Array<Post>;
  origin: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const validateRequestBody = async function (requestBody: RequestBody) {
  let errors: Array<ValidationError> = []

  // // Validate captcha token
  // if (!requestBody.token || requestBody.token === "") {
  //   errors.push({ field: "token", message: "Bitte löse das Captcha." } as ValidationError)
  // } else {
  //   const tokenData = await verify(HCAPTCHA_SECRET, requestBody.token)
  //   if (tokenData.success !== true) {
  //     errors.push({ field: "token", message: "Captcha ist ungültig." } as ValidationError)
  //   }
  // }

  // Validate user email
  if (!validator.isEmail(requestBody.userEmail)) {
    errors.push({ field: "userEmail", message: "Email-Adresse ist ungültig." } as ValidationError)
  }
  // Validate there are recipients
  if (requestBody.targetEmails.length === 1 && requestBody.targetEmails[0] === "") {
    errors.push({ field: "targetEmails", message: "Bitte trage mindestens eine Empfängerin ein." } as ValidationError)
  } else {
    // Validate recipient emails
    for (let i = 0; i < requestBody.targetEmails.length; i++) {
      const email = requestBody.targetEmails[i]
      if (!validator.isEmail(email)) {
        errors.push({ field: "targetEmails", message: "Eine oder mehrere Email-Adressen sind ungültig." } as ValidationError)
        break;
      }
    }
    // Validate there aren't too many recipients
    if (requestBody.targetEmails.length > 5) {
      errors.push({ field: "targetEmails", message: "Zu viele Empfänger." } as ValidationError)
    }
  }

  // Validate message isn't too long
  if (!validator.isLength(requestBody.message, { min: 0, max: 400 })) {
    errors.push({ field: "message", message: "Nachricht muss kürzer als 400 Zeichen sein." } as ValidationError)
  }

  // Validate posts are present and contain the right fields
  if (requestBody.posts.length === 0) {
    errors.push({ message: "Keine Artikel gefunden." } as ValidationError)
  }
  for (let i = 0; i < requestBody.posts.length; i++) {
    const p = requestBody.posts[i]
    if (!validator.isURL(p.link, { require_tld: false })) {
      errors.push({ message: "Ein oder mehrere Artikel sind ungültig (URL)." } as ValidationError)
      break;
    }
    if (validator.isEmpty(p.title)) {
      errors.push({ message: "Ein oder mehrere Artikel sind ungültig." } as ValidationError)
      break;
    }
  }

  return errors;
}

const handler: Handler = async function (event) {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify("Payload required"),
    };
  }

  const requestBody = JSON.parse(event.body) as RequestBody
  const errors = await validateRequestBody(requestBody);

  if (errors.length === 0) {
    const userEmail = validator.normalizeEmail(requestBody.userEmail)
    const targetEmails = requestBody.targetEmails.map(email => {
      return validator.normalizeEmail(email)
    })
    const message = validator.escape(requestBody.message)
    const url = `${process.env.URL}/.netlify/functions/emails/share/`
    console.log(url)
    const res = await fetch(url, {
      headers: {
        "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET as string,
      },
      method: "POST",
      body: JSON.stringify({
        from: process.env.EMAIL_SENDER,
        to: targetEmails,
        replyTo: userEmail,
        subject: `${userEmail} hat ${requestBody.posts.length} Artikel mit dir geteilt`,
        parameters: {
          userEmail: requestBody.userEmail,
          targetEmails: requestBody.targetEmails,
          message: message,
          posts: requestBody.posts,
          origin: requestBody.origin
        },
      }),
    });
    if (res.status !== 200) {
      const body = await res.json();
      console.log(res.status)
      console.log(res.statusText)
      console.log(body)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server error, could not deliver email." }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Subscribe email sent!" }),
      };
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Bad request", errors: errors }),
    };
  }
};

export { handler };

