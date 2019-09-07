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
import { faTimes, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

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
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 8fr;
  text-align: center;
  padding: 1px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: gray;
  width: 170px;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 0.9em;
  font-weight: bold;
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
const LineBreak = styled.div`
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 40px;
  border: inset 1px rgb(0,0,0,0.2);
`;


export default function PageProfileEdit(props) {

  const [values, setValues] = useState({
    showPassword: false,
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    currentPassword: null,
    newPassword: null,
    emailError: false,
    firstNameError: false,
    lastNameError: false,
    usernameError: false,
    currentPasswordError: false,
    newPasswordError: false,
    emailHelper: null,
    firstNameHelper: null,
    lastNameHelper: null,
    currentPasswordHelper: null,
    newPasswordHelper: null,
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
      currentPassword: /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/,
      newPassword: /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/,
    };
    return regex[name].test(String(value));
  };

  const valueError = nameArr => {    
    const errorMsg = {
      email: 'Enter a proper email',
      firstName: 'Between 3 and 15 characters, only letters and "-"',
      lastName: 'Between 3 and 15 characters, only letters',
      username: 'Between 6 and 10 characters, only letters',
      currentPassword: 'Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character',
      newPassword: 'Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character',
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

  const handleChange = name => event => setValues({ ...values, [name]: event.target.value, [`${name+'Error'}`]: false, [`${name+'Helper'}`]: null });
  const toggleShowCurrentPassword = () => setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  const toggleShowNewPassword = () => setValues({ ...values, showNewPassword: !values.showNewPassword });

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const infoPayload = { 
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
      };
      const emptyFields = Object.keys(infoPayload).filter(key => !infoPayload[key]);
      if (emptyFields.length === 0) {
        axios.post(`/users/updateProfile?authToken=${authToken}`, infoPayload)
          .then(res => { if (res.status === 200) props.history.push('/myProfile'); })
          .catch(error => {
            const helpers = error.response.data;
            if (helpers.errors.length !== 0) valueError(helpers.errors);
            if (helpers.taken.length !== 0) valueIsTaken(helpers.taken);
          });
      } else { valueError(emptyFields); }
    } catch(error) {console.log(error);}
  };

  const handleSubmitPassword = async event => {
    event.preventDefault();
    try {
      const passwordPayload = { 
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const emptyFields = Object.keys(passwordPayload).filter(key => !passwordPayload[key]);
      if (!values.currentPasswordError && !values.newPasswordError && emptyFields.length === 0) {
        axios.post(`/users/updatePassword?authToken=${authToken}`, passwordPayload)
          .then(res => { if (res.status === 200) props.history.push('/myProfile'); })
          .catch(error => {
            if (error.response.data === 'currentPassword') {
              setValues(prev => ({ ...prev, currentPassword: null, currentPasswordError: true, currentPasswordHelper: 'The current password does not match' }));
            } else if (error.response.data === 'newPassword') {
              setValues(prev => ({ ...prev, newPassword: null, newPasswordError: true, newPasswordHelper: 'Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character' }));
            }
          });
      } else { valueError(emptyFields); }
    } catch(error) {console.log(error);}
  };

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
              id="standard-username"
              label="Username"
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              error={values.usernameError}
              helperText={values.usernameHelper}
              margin="normal"
              value={values.username || ''}
            />
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
            <SubmitButton type="submit">
              <FontAwesomeIcon  style={{marginLeft: '10px', fontSize: '15px', color: 'white', marginRight:'10px'}} icon={faUser}/>
              <p>Update Info</p>
            </SubmitButton>
          </Form>
          <LineBreak></LineBreak>
          <Form noValidate autoComplete="off" onSubmit={handleSubmitPassword}>
            <FormControl>
              <StyledInputLabel htmlFor="adornment-password">Current Password</StyledInputLabel>
              <StyledInput
                id="standard-current-password"
                type={values.showCurrentPassword ? 'text' : 'password'}
                onBlur={handleBlur('currentPassword')}
                onChange={handleChange('currentPassword')}
                error={values.currentPasswordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle current password visibility" onClick={toggleShowCurrentPassword}>
                      {values.showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{color: '#ef3a2d'}} id="current-password-helper-text">{values.currentPasswordHelper}</FormHelperText>
            </FormControl>
            <FormControl>
              <StyledInputLabel htmlFor="adornment-new-password">New Password</StyledInputLabel>
              <StyledInput
                id="standard-new-password"
                type={values.showNewPassword ? 'text' : 'password'}
                onBlur={handleBlur('newPassword')}
                onChange={handleChange('newPassword')}
                error={values.newPasswordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle new password visibility" onClick={toggleShowNewPassword}>
                      {values.showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{color: '#ef3a2d'}} id="new-password-helper-text">{values.newPasswordHelper}</FormHelperText>
            </FormControl>
            <SubmitButton>    
              <FontAwesomeIcon style={{marginLeft: '10px', fontSize: '15px', color: 'white'}} icon={faLock}/>
              <p>Update Password</p>
            </SubmitButton>
          </Form>
        </FormContainer>
      </LoginSection>
    </Hero>
  );
}
