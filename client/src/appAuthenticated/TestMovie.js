import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const Hero = styled.section`
  background-color: ${props => props.theme.color.grey};
  height: 100vh;
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
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SubmitButton = styled.div`
  text-decoration: none;
  cursor: pointer;
  border: none;
  text-align: center;
  padding: 1px;
  margin-top: 20px;
  background-color: black;
  width: 170px;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 0.9em;
  font-weight: bold;
  &:hover {
    background-color: #C50C15;
  }
`;
const FormContainer = styled.section`
  width: 400px;
  padding: 50px;
  margin: 0 auto;
  background-color: dimGray;
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
const CommentsContainer = styled.section`
  display: grid;
  grid-template-columns: 2fr 3fr 5fr;
  grid-gap: 10px;
  grid-template-areas:
    "avatarThumb username date"
    "avatarThumb comment comment";
  width: 400px;
  padding: 50px;
  margin: 0 auto;
  background-color: dimGray;
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
const AvatarThumb = styled.img`
  grid-area: avatarThumb;
`;
const Username = styled.p`
  grid-area: username;
`;
const Date = styled.p`
  grid-area: date;
`;
const Comment = styled.p`
  grid-area: comment;
`;

export default function TestMovie() {

  const imdbId = 'tt8485548';
  const authToken = localStorage.getItem('authToken');
  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(false);
  const [commentHelper, setCommentHelper] = useState(null);

  const handleBlur = name => event => {
    const regex = /^[\w\W]{0,250}$/;
    if (regex.test(String(comment))) {
      setComment(event.target.value);
      setCommentError(false);
      setCommentHelper(null);
    } else {
      setCommentError(true);
      setCommentHelper('You have max 250 characters');
    }
  };

  const handleChange = name => event => {
    const regex = /^[\w\W]{0,250}$/;
    if (regex.test(String(event.target.value))) {
      setComment(event.target.value);
      setCommentError(false);
      setCommentHelper(null);
    }
  };

  const handleSubmit = async event => {
    // trigger que avec enter et pas au click, why ?
    event.preventDefault();
    try {
      console.log(comment);
      const commentPayload = { 
        comment,
        imdbId,
      };
      const res = await axios.post(`/comments?authToken=${authToken}`, commentPayload);
      console.log(res);
    } catch(error) {console.log(error);}
  };

  return (
    <Hero>
      <CommentsContainer>
        <AvatarThumb></AvatarThumb>
        <Username></Username>
        <Date></Date>
        <Comment></Comment>
      </CommentsContainer>
      <FormContainer>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <StyledTextField
            id="standard-comment"
            label="Comment"
            onBlur={handleBlur('comment')}
            onChange={handleChange('comment')}
            error={commentError}
            helperText={commentHelper}
            margin="normal"
            value={comment || ''}
          />
          <SubmitButton type="submit">
            <p>Post</p>
          </SubmitButton>
        </Form>
      </FormContainer>
    </Hero>
  );
}