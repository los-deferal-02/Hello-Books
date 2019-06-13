import encypt from '../helpers/encrypt';

const password1 = encypt.encryptPassword('Chinonso1234');
const password2 = encypt.encryptPassword('Chinonso123456');

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
      userName: 'chiboycalix',
      email: 'igwechinonso77@gmail.com',
      firstName: 'chinonso',
      lastName: 'calix',
      password: 'Chinonso123',
      role: 'patron'
    },
    {
      userName: 'reader3',
      email: 'toolzdman@gmail.com',
      firstName: 'Rihanna',
      lastName: 'Obayomi',
      password: 'Books123',
      role: 'patron'
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
  ]
};

export default inputs;
