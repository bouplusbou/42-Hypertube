import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cloudinary from 'cloudinary-core';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

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
const SubmitButton = styled.button`
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
`;
const Comment = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 5fr;
  grid-template-areas:
    "avatarThumb username date"
    "avatarThumb comment comment";
  width: 400px;
  background-color: black;
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  color: white;
  font-family: Roboto;
  padding: 10px 30px;
  margin: 0 auto;
`;
const AvatarThumb = styled.img`
  grid-area: avatarThumb;
  height: 45px;
  width: 45px;
  object-fit:cover;
  border-radius: 100%;
  background-color: black;
  cursor: pointer;
  justify-self: center;
`;
const Username = styled(Link)`
  grid-area: username;
  font-size: 0.8rem;
  font-weight: 700;
  align-self: center;
  color: gray;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;
const Date = styled.p`
  grid-area: date;
  align-self: center;
  color: dimgray;
  font-size: 0.8rem;
`;
const CommentText = styled.p`
  grid-area: comment;
  margin: 0 0 20px 0;
  word-break: break-word;
`;

export default function TestMovie() {

  const imdbId = 'tt8485548';
  const authToken = localStorage.getItem('authToken');
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(false);
  const [commentHelper, setCommentHelper] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const res = await axios.get(`/comments/${imdbId}?authToken=${authToken}`);
      if (isSubscribed) setComments(res.data.comments);
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken]);

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
      const commentPayload = { 
        comment,
        imdbId,
      };
      await axios.post(`/comments?authToken=${authToken}`, commentPayload);
      setComment(null);
      setCommentError(false);
      setCommentHelper(null);
      const resFetch = await axios.get(`/comments/${imdbId}?authToken=${authToken}`);
      setComments(resFetch.data.comments);
    } catch(error) {console.log(error);}
  };

  return (
    <Hero>
      <CommentsContainer>
        {comments && comments.map(comment => 
          <Comment key={comment.date}>
            <AvatarThumb src={cloudinaryCore.url(comment.user.avatarPublicId)}></AvatarThumb>
            <Username to={`/users/${comment.user.username}`}>{comment.user.username}</Username>
            <Date></Date>
            <CommentText>{comment.comment}</CommentText>
          </Comment>
        )}
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