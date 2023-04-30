export const Validations = {
    name: {
      value: /^[\.a-zA-Z, ]*$/,
      message: 'Please enter characters from A to Z only'
    },
    // username: (userName) => {
    //   if (currRow.userName === userName) {
    //     clearErrors("userName");
    //   }
    //   else if (usersInfo.some(i => i.userName === userName)) {
    //     return "Username already exists. Please use another.";
    //   }
    // },
    username: {
      value: true,
      message: "Username already exists. Please use another."
    },
    password: {
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      // comparePasswords: (confirmPassword) => {
      //   const password = watch('password');
      //   if (password !== confirmPassword) {
      //     return "Passwords do not match"
      //   }
      // }
    }
  };