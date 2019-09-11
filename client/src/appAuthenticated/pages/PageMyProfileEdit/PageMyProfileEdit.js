import React, { useState, useEffect, useContext, Fragment } from 'react';
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
import { faTimes, faLock, faUser, faImage } from '@fortawesome/free-solid-svg-icons';
import cloudinary from 'cloudinary-core';
import AppContext from '../../../contexts/AppContext';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

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
const SubmitButton = styled.div`
  text-decoration: none;
  cursor: pointer;
  border: none;
  display: grid;
  grid-template-columns: 2fr 8fr;
  align-items: center;
  text-align: center;
  padding: 1px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: gray;
  width: 200px;
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

const AvatarContainer = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Avatar = styled.img`
  height: 200px;
  width: 150px;
  object-fit:cover;
  border-radius: ${props => props.theme.borderRadius};
  margin: 0 auto;
  background-color: black;
`;
const UploadLabel = styled.label`
  text-decoration: none;
  cursor: pointer;
  border: none;
  display: grid;
  grid-template-columns: 2fr 8fr;
  align-items: center;
  text-align: center;
  padding: 15px 1px;
  margin: 20px auto;
  background-color: gray;
  width: 200px;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 0.9em;
  font-weight: bold;
  &:hover {
    background-color: #C50C15;
  }
`;

export default function PageProfileEdit(props) {

  const { t } = useContext(AppContext);
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
    avatarPublicId: null,
    avatarPublicIdError: false,
    avatarPublicIdHelper: null,
    isOAuth: true,
  });

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      const res = await axios.get(`/users?authToken=${authToken}`);
      const { username, email, firstName, lastName, avatarPublicId, isOAuth } = res.data.user;
      if (isSubscribed) {
        setValues( curr => ({...curr, username, email, firstName, lastName, avatarPublicId, isOAuth}) )
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
      email: t.errorMsg.email,
      firstName: t.errorMsg.firstName,
      lastName: t.errorMsg.lastName,
      username: t.errorMsg.username,
      currentPassword: t.errorMsg.currentPassword,
      newPassword: t.errorMsg.newPassword,
      avatarPublicId: t.errorMsg.uploadAValidPicture,
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


  async function uploadAvatar(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result)
        let bytes = []
        uint.forEach((byte) => {
            bytes.push(byte.toString(16))
        })
        const hex = await bytes.join('').toUpperCase();
        if (file.size && file.size < 1000000 && (hex === '89504E47' || hex === 'FFD8FFE0')) {
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const image  = reader.result;
            const res = await axios.post(`/users/uploadAvatarEdit?authToken=${authToken}`, { image })
            setValues({ ...values, avatarPublicId: res.data.avatarPublicId, avatarPublicIdError: false, avatarPublicIdHelper: '' });
          }
        } else if (hex) {
            setValues({ ...values, avatarPublicId: values.avatarPublicId, avatarPublicIdError: true, avatarPublicIdHelper: 'Please upload a valid JPG or PNG picture less than 1Mo' });
        }
      }
    };
    if (file) {
      const blob = file.slice(0, 4);
      reader.readAsArrayBuffer(blob);
    }
  }

  // async function uploadAvatar(event) {
  //   event.preventDefault();
  //   const file = event.target.files[0];
  //   if (file.size && file.size < 1000000) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = async () => {
  //       const image  = reader.result;
  //       const res = await axios.post(`/users/uploadAvatarEdit?authToken=${authToken}`, { image })
  //       setValues({ ...values, avatarPublicId: res.data.avatarPublicId });
  //     }
  //   }
  // }
  
  return (
    <Hero>
      <LoginSection>
        <FormContainer>
          <CloseEdit to="/myProfile">
            <FontAwesomeIcon  style={{fontSize: '15px', color: 'white'}} icon={faTimes}/>
          </CloseEdit>
          <h1>{t.myProfileEdit.editProfile}</h1>
          <AvatarContainer>
            <Avatar src={cloudinaryCore.url(values.avatarPublicId)}/>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="uploadFileButton"
              type="file"
              onChange={uploadAvatar}
            />
            <UploadLabel htmlFor="uploadFileButton"><FontAwesomeIcon style={{marginLeft: '10px', fontSize: '15px', color: 'white'}} icon={faImage}/> {t.myProfileEdit.avatarUploadButton}</UploadLabel>
            {values.avatarPublicIdError && <FormHelperText style={{color: '#ef3a2d'}} id="upload-helper-text">{values.avatarPublicIdHelper}</FormHelperText>}          
          </AvatarContainer>
          <LineBreak></LineBreak>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              id="standard-username"
              label={t.myProfileEdit.username}
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              error={values.usernameError}
              helperText={values.usernameHelper}
              margin="normal"
              value={values.username || ''}
            />
            <StyledTextField
              id="standard-email"
              label={t.myProfileEdit.email}
              onBlur={handleBlur('email')}
              onChange={handleChange('email')}
              error={values.emailError}
              helperText={values.emailHelper}
              margin="normal"
              value={values.email || ''}
            />
            <StyledTextField
              id="standard-firstName"
              label={t.myProfileEdit.firstName}
              onBlur={handleBlur('firstName')}
              onChange={handleChange('firstName')}
              error={values.firstNameError}
              helperText={values.firstNameHelper}
              margin="normal"
              value={values.firstName || ''}              
            />
            <StyledTextField
              id="standard-lastName"
              label={t.myProfileEdit.lastName}
              onBlur={handleBlur('lastName')}
              onChange={handleChange('lastName')}
              error={values.lastNameError}
              helperText={values.lastNameHelper}
              margin="normal"
              value={values.lastName || ''}
            />
            <SubmitButton type="submit">
              <FontAwesomeIcon  style={{marginLeft: '10px', fontSize: '15px', color: 'white', marginRight:'10px'}} icon={faUser}/>
              <p>{t.myProfileEdit.updateInfoButton}</p>
            </SubmitButton>
          </Form>
          {values.isOAuth === false && 
          <Fragment>
            <LineBreak></LineBreak>
            <Form noValidate autoComplete="off" onSubmit={handleSubmitPassword}>
              <FormControl>
                <StyledInputLabel htmlFor="adornment-password">{t.myProfileEdit.currentPassword}</StyledInputLabel>
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
                  <StyledInputLabel htmlFor="adornment-new-password">{t.myProfileEdit.newPassword}</StyledInputLabel>
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
                <p>{t.myProfileEdit.updatePasswordButton}</p>
              </SubmitButton>
            </Form>
          </Fragment>
          }
        </FormContainer>
      </LoginSection>
    </Hero>
  );
}
