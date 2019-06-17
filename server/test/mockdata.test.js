const inputs = {
  sameEmailSignup: {
    userName: 'readerUnknown',
    email: 'reader1@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Books123',
    role: 'author'
  },
  validSignUpInputs: [
    {
      userName: 'reader1',
      email: 'reader1@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books123',
      role: 'patron'
    },
    {
      userName: 'reader2',
      email: 'reader2@gmail.com',
      firstName: 'Mark',
      lastName: 'Diamond',
      password: 'Books231',
      role: 'author'
    },
    {
      userName: 'reader3',
      email: 'toolzdman@gmail.com',
      firstName: 'Rihanna',
      lastName: 'Obayomi',
      password: 'Books123',
      role: 'patron'
    },
    {
      userName: 'darthVad3r',
      email: 'darthvad3r@gmail.com',
      firstName: 'Darth',
      lastName: 'Vader',
      password: 'Empire231',
      role: 'author'
    }
  ],

  invalidSignupInputs: [
    {
      userName: 'reader1',
      email: 'reader1000@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books1',
      role: 'author'
    },
    {
      userName: 'reader100',
      email: 'reader1@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books1',
      role: 'patron'
    }
  ],

  validLoginInputs: [
    {
      userLogin: 'reader2',
      password: 'Books231'
    },
    {
      userLogin: 'reader2@gmail.com',
      password: 'Books231'
    }
  ],

  validAddBookInput: {
    title: 'newBook',
    body: 'The newbook from 1996',
    description: 'The best book of the century',
    genre: 'Fantacy',
    author: 'justin',
    pages: 500
  },

  validNewBookRequestInput: {
    userId: 1,
    title: "You don't know JS: Up & Going",
    author: 'Kylie Simpson'
  },

  userTableSeed: {
    userName: 'oluphetty360',
    email: 'oluphetty360@domain.com',
    firstName: 'Olu',
    lastName: 'Phetty',
    password: 'Oluphetty360',
    role: 'patron'
  },

  duplicateNewBookRequestInput: {
    userId: 1,
    title: "You don't know JS: Scope & Closures",
    author: 'Kylie Simpson'
  }
};

export default inputs;
