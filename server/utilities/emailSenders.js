import EmailModule from './emailModule';

/**
 * Class contaning methods for all emails to be sent
 * @exports
 * @class EmailSender
 */
export default class EmailSender {

  static sendVerifyEmail(receiver, subject) {
    const content = `
    <p>Dear valued customer, please click on this link to verify your email address.</p>
    <p>Kindly disregard this email if you did not sign up for an Hello-Books account.</p>
    <p>© Hello Books Inc. </p><a href=https://deferral-hello-books.herokuapp.com/api/v1>Hello Books</p>
    `
  }
}