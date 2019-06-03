const inputs = {
  sameEmailSignup: {
    username: 'readerUnknown',
    email: 'reader1@gmail.com',
    firstname: 'John',
    lastname: 'Doe',
    password: 'Books1',
  },
  validSignUpInputs: [
    {
      username: 'reader1',
      email: 'reader1@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1',
    },
    {
      username: 'reader2',
      email: 'reader2@gmail.com',
      firstname: 'Mark',
      lastname: 'Diamond',
      password: 'Books2',
    }
  ],

  invalidSignupInputs: [
    {
      username: 'reader1',
      email: 'reader1000@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1',
    },
    {
      username: 'reader1000',
      email: 'reader1@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1',
    },
  ],
  validAddBookInput: {
    title: 'newBook',
    body: 'The newbook from 1996',
    description: 'The best book of the century',
    genre: 'Fantacy',
    pages: 500
  }
};

export default inputs;
