export const sendEmailGQLTAG = `mutation sendEmail($email: String!, $subject: String!, $message: String!) {
    sendEmail(email: $email, subject: $subject, message: $message) {
      data
    }
  }`


  /*
  {
  "email": "naaziya@neosme.com",
  "subject": "Test Email",
  "message": "TEST TEST TEST TEST"
} */