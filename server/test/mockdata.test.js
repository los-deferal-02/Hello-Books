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
    },
    {
      username: 'reader3',
      email: 'toolzdman@gmail.com',
      firstname: 'Rihanna',
      lastname: 'Obayomi',
      password: 'incorrect',
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
  ]
};

export default inputs;
