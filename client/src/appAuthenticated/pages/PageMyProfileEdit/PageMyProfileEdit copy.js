import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Hero = styled.section`
  background-color: ${props => props.theme.color.grey};
  height: 100vh;
`;
const LoginSection = styled.section`
  display: flex;
  justify-content: center;
  padding-top: 10%;
`;
const FormContainer = styled.section`
  flex-basis: 400px;
  padding: 50px;
  background-color: ${props => props.theme.color.black};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  h1 {
    font-size: 2rem;
    text-align: center;
    font-family: Roboto;
    color: ${props => props.theme.color.white};
  }
`;
const CloseEdit = styled(Link)`
  position: absolute;
  top: 30px;
  right: 30px;
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background-color: rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: rgba(255,255,255,0.2);
  }
`;


const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SubmitButton = styled.button`
  text-decoration: none;
  cursor: pointer;
  border: none;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  background-color: ${props => props.theme.color.red};
  width: 50%;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 1.1em;
  font-weight: medium;
  &:hover {
    background-color: #C50C15;
  }
`;



const StyledTextField = styled(TextField) `
  label {
    color: ${props => props.theme.color.white};
    &.MuiFormLabel-root.Mui-focused {
      color: ${props => props.theme.color.white};
    }
  }
  div {
    color: ${props => props.theme.color.white};
    &::after {
      border-bottom: 2px solid ${props => props.theme.color.white};
    }
  }
`;
const StyledInputLabel = styled(InputLabel) `
  label {
    color: ${props => props.theme.color.white};
  }
  &.MuiFormLabel-root {
    color: ${props => props.theme.color.white};
  }
  &.MuiFormLabel-root.Mui-focused {
    color: ${props => props.theme.color.white};
  }
`;
const StyledInput = styled(Input) `
  input {
    color: ${props => props.theme.color.white};
  }
  div {
    button {
      color: ${props => props.theme.color.white};
    }
  }
  &.MuiInput-underline::after {
    border-bottom: 2px solid ${props => props.theme.color.white};
  }
`;

export default function PageProfileEdit(props) {

  const [values, setValues] = useState({
    showPassword: false,
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    password: null,
    emailError: false,
    firstNameError: false,
    lastNameError: false,
    usernameError: false,
    passwordError: false,
    emailHelper: null,
    firstNameHelper: null,
    lastNameHelper: null,
    passwordHelper: null,
    usernameHelper: null,
  });

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      const res = await axios.get(`/users?authToken=${authToken}`);
      const { username, email, firstName, lastName } = res.data.user;
      if (isSubscribed) {
        setValues( curr => ({...curr, username, email, firstName, lastName}) )
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken]);


  const valueIsOk = (name, value) => {
    const regex = {
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      firstName: /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/,
      lastName: /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,15}$/,
      username: /^[A-Za-zÀ-ÖØ-öø-ÿ]{5,10}$/,
      password: /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/,
    };
    return regex[name].test(String(value));
  };

  const valueError = nameArr => {    
    const errorMsg = {
      email: 'Enter a proper email',
      firstName: 'Between 3 and 15 characters, only letters and "-"',
      lastName: 'Between 3 and 15 characters, only letters',
      username: 'Between 6 and 10 characters, only letters',
      password: 'Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character',
    };
    const stateArr = nameArr.map(name => {return { [`${name+'Error'}`]: true, [`${name+'Helper'}`]: errorMsg[name] }});
    const state = stateArr.reduce((acc, curr) => {
      acc = {...acc, ...curr};
      return acc;
    }, {});
    setValues({ ...values, ...state });
  };

  const valueIsTaken = nameArr => {
    const stateArr = nameArr.map(name => {return { [name]: null, [`${name+'Error'}`]: true, [`${name+'Helper'}`]: `This ${name} is already used` }});
    const state = stateArr.reduce((acc, curr) => {
      acc = {...acc, ...curr};
      return acc;
    }, {});
    setValues({ ...values, ...state });
  };

  const handleBlur = name => event => {
    if (valueIsOk(name, event.target.value)) {
      setValues({ ...values, [name]: event.target.value, [`${name+'Error'}`]: false, [`${name+'Helper'}`]: null });
    } else {
      valueError([name]);
    }
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const toggleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const newUser = { 
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        password: values.password,
      };
      const emptyFields = Object.keys(newUser).filter(key => !newUser[key]);
      if (emptyFields.length === 0) {
        axios.post(`/auth/signup`, newUser)
          .then(res => { if (res.status === 200) props.history.push('/myProfile'); })
          .catch(error => {
            const res = error.response.data;
            if (res.errors.length !== 0) valueError(res.errors);
            if (res.taken.length !== 0) valueIsTaken(res.taken);
          });
      } else {
        valueError(emptyFields);
      }
    } catch(error) {console.log(error);}
  }

  return (
    <Hero>
      <LoginSection>
        <FormContainer>
          <CloseEdit to="/myProfile">
            <FontAwesomeIcon  style={{fontSize: '15px', color: 'white'}} icon={faTimes}/>
          </CloseEdit>
          <h1>Edit Profile</h1>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              id="standard-email"
              label="Email"
              onBlur={handleBlur('email')}
              onChange={handleChange('email')}
              error={values.emailError}
              helperText={values.emailHelper}
              margin="normal"
              value={values.email || ''}
            />
            <StyledTextField
              id="standard-firstName"
              label="First Name"
              onBlur={handleBlur('firstName')}
              onChange={handleChange('firstName')}
              error={values.firstNameError}
              helperText={values.firstNameHelper}
              margin="normal"
              value={values.firstName || ''}              
            />
            <StyledTextField
              id="standard-lastName"
              label="Last Name"
              onBlur={handleBlur('lastName')}
              onChange={handleChange('lastName')}
              error={values.lastNameError}
              helperText={values.lastNameHelper}
              margin="normal"
              value={values.lastName || ''}
            />
            <StyledTextField
              id="standard-username"
              label="Username"
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              error={values.usernameError}
              helperText={values.usernameHelper}
              margin="normal"
              value={values.username || ''}
            />
            <FormControl>
              <StyledInputLabel htmlFor="adornment-password">Password</StyledInputLabel>
              <StyledInput
                id="standard-password"
                type={values.showPassword ? 'text' : 'password'}
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
                error={values.passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={toggleShowPassword}>
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{color: '#ef3a2d'}} id="password-helper-text">{values.passwordHelper}</FormHelperText>
            </FormControl>
            <SubmitButton type="submit">
              <p>Update</p>
            </SubmitButton>
          </Form>
        </FormContainer>
      </LoginSection>
    </Hero>
  );
}
