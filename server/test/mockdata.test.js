import encypt from '../helpers/encrypt';

const password1 = encypt.encryptPassword('1234');
const password2 = encypt.encryptPassword('1235');

const inputs = {
  sameEmailSignup: {
    username: 'readerUnknown',
    email: 'reader1@gmail.com',
    firstname: 'John',
    lastname: 'Doe',
    password: 'Books1'
  },
  validSignUpInputs: [
    {
      username: 'reader1',
      email: 'reader1@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1'
    },
    {
      username: 'reader2',
      email: 'reader2@gmail.com',
      firstname: 'Mark',
      lastname: 'Diamond',
      password: 'Books2'
    },
    {
      username: 'reader3',
      email: 'igwechinonso77@gmail.com',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'Books3'
    }
  ],

  invalidSignupInputs: [
    {
      username: 'reader1',
      email: 'reader1000@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1'
    },
    {
      username: 'reader1000',
      email: 'reader1@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1'
    },
    {
      username: 'reader1000',
      email: 'reader1@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Books1'
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
  ]
};

export default inputs;
