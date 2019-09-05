const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');


const emailIsOK = email => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(String(email).toLowerCase());
};
const firstNameIsOK = firstName => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/;
      return regex.test(String(firstName));
};
const lastNameIsOK = lastName => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,15}$/;
      return regex.test(String(lastName));
};
const usernameIsOK = username => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{5,10}$/;
      return regex.test(String(username));
};
const passwordIsOK = password => {
      const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
      return regex.test(String(password));
};

const newUserIsOK = async (email, firstName, lastName, username, password) => {
    try {
        const helpers = {
              errors: [],
              taken: [],
        };
        if (!emailIsOK(email)) { helpers.errors.push('email') };
        if (!firstNameIsOK(firstName)) { helpers.errors.push('firstName') };
        if (!lastNameIsOK(lastName)) { helpers.errors.push('lastName') };
        if (!usernameIsOK(username)) { helpers.errors.push('username') };
        if (!passwordIsOK(password)) { helpers.errors.push('password') };
        const emailExists = await UserModel.findOne({ email });
        if (emailExists) { helpers.taken.push('email') };
        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists) { helpers.taken.push('username') };
        return helpers;
    } catch(err) {
        console.log(err);
    }
};

const findOrCreateUser = (req, res) => {
      try {
            const manageNewUser = async ({ email, firstName, lastName, username, password }) => {
                const helpers = await newUserIsOK(email, firstName, lastName, username, password);
                if (helpers.errors.length !== 0 || helpers.taken.length !== 0) {
                    res.status(400).json(helpers);
                    return;
                }
                
                const salt = await bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hashSync(password, salt);
                const newUser = new User({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    password: hashedPassword
                });
                const user = await UserModel.collection.insertOne(newUser)
                res.status(200).json({ message: 'User created' });
            };
            manageNewUser(req.body);
      } catch (error) { Log.error(error, `createUser`, __filename) }
};

module.exports = {
    findOrCreateUser,
};
