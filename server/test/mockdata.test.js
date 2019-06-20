import encypt from '../helpers/encrypt';

const password1 = encypt.encryptPassword('Chinonso1234');
const password2 = encypt.encryptPassword('Chinonso123456');

const inputs = {
  userSignupInputforAuthor: {
    userName: 'test',
    email: 'testing@yahoo.com',
    firstName: 'namey',
    lastName: 'Lastname',
    password: 'Njdudubb82828',
    role: 'patron'
  },
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
      role: 'superAdmin'
    },
    {
      userName: 'reader2',
      email: 'reader2@gmail.com',
      firstName: 'Mark',
      lastName: 'Diamond',
      password: 'Books231',
      role: 'patron'
    },
    {
      userName: 'chiboycalix',
      email: 'igwechinonso77@gmail.com',
      firstName: 'chinonso',
      lastName: 'calix',
      password: 'Chinonso123',
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
    },
    {
      userName: 'kyloRen',
      email: 'kyloren@gmail.com',
      firstName: 'Kylo',
      lastName: 'Ren',
      password: 'Empire231',
      role: 'admin'
    },
    {
      userName: 'erlicBach',
      email: 'erlich@bachman.com',
      firstName: 'Erlich',
      lastName: 'Bachman',
      password: 'Aviato123',
      role: 'cashier'
    }
  ],

  invalidSignupInputs: [
    {
      userName: 'reader1',
      email: 'reader1000@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books1456'
    },
    {
      email: 'reader3@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books1567'
    },
    {
      userName: 'reader1000',
      email: 'reader4@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Books1567'
    }
  ],

  validResetPasswordInput: [
    {
      newPassword: password1,
      confirmPassword: password1
    }
  ],
  invalidResetPasswordInput: [
    {
      newPassword: password1,
      confirmPassword: password2
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
    title: 'Antman & The Wasp',
    body: 'Antman is back!',
    description: 'Scott Lang teams up with the Wasp to save the world again',
    genre: 'Fantasy',
    hardcopy: true,
    pages: 70,
    author: 'Stan Lee'
  },

  signupForBookRequest: {
    userName: 'darthVad',
    email: 'darthvad@gmail.com',
    firstName: 'Darth',
    lastName: 'Vader',
    password: 'Empire231',
    role: 'patron'
  },

  validNewBookRequestInput: {
    title: "You don't know JS: Up & Going",
    author: 'Kylie Simpson'
  },

  duplicateNewBookRequestInput: {
    userId: 1,
    title: "You don't know JS: Scope & Closures",
    author: 'Kylie Simpson'
  }
};

export default inputs;
