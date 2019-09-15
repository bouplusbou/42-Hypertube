import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cloudinary from 'cloudinary-core';
import AppContext from '../../../contexts/AppContext';
import { actionLogout } from '../../../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Hero = styled.section`
  background-color: black;
  /* height: 100  vh; */
  display: flex;
  color: white;
  font-family: Roboto;
  word-break: break-word;
`;

const PosterSection = styled.section`
  flex-basis: 1000px;
  padding: 50px;
`;
const Poster = styled.img`
  width: 100%;
`;
const InfoSection = styled.section`
  padding: 50px;

`;
const CloseButton = styled.div`
`;
const Title = styled.h1`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 20px;
`;
const Info = styled.section`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.9em;
`;
const Year = styled.p`
`;
const Runtime = styled.p`
`;
const Genre = styled.p`
`;
const ImdbLink = styled.a`
`;
const Rating = styled.p`
`;
const FullStar = styled(FontAwesomeIcon)`
  color: #E8BB1A;
`;
const EmptyStar = styled(FontAwesomeIcon)`
  color: dimgray;
`;
const Synopsis = styled.p`
  margin-bottom: 50px;
`;
const TorrentSection = styled.section`
`;
const ProviderLogo = styled.img`
  width: 50px;
  margin: 30px 0 10px 0;
`;
const Magnet = styled.div`
  height: 50px;
  background-color: dimgray;
  border-radius: 3px;
  max-width: 400px;
`;
const Separator = styled.div`
  width: 2px;
  height: 15px;
  border-right: solid 1px dimgray;
  margin: 0 20px;
`;
const ImdbLogo = styled.img`
  width: 35px;
`;
const CommentsTitle = styled.h1`
  color: white;
  font-weight: 700;
  font-size: 1.6em;
  margin-top: 50px;
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
  padding: 0 50px 20px 50px;
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
  padding: 10px 0;
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

  const { toggleConnected } = useContext(AppContext);
  const authToken = localStorage.getItem('authToken');
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(false);
  const [commentHelper, setCommentHelper] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/comments/${imdbId}?authToken=${authToken}`);
        console.log(res);
        if (isSubscribed) setComments(res.data.comments);
      } catch(err) {
        console.log(err);
        // if (err.response.status === 401) actionLogout(toggleConnected);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, toggleConnected]);

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
    } catch(err) {
      console.log(err);
      if (err.response.status === 401) actionLogout(toggleConnected);
    }
  };

  return (
    <Hero>
      {/* <CloseButton></CloseButton> */}
      <PosterSection>
        <Poster src="http://image.tmdb.org/t/p/w500/w5Gqcb6gfrgbk6utEHYVwDLPiiR.jpg"></Poster>
      </PosterSection>
      <InfoSection>
        <Title>Escape from New-york</Title>
        <Info>
          <Year>1981</Year>
          <Separator></Separator>
          <Runtime>99 min</Runtime>
          <Separator></Separator>
          <Genre>action / science-fiction</Genre>
          <Separator></Separator>
          <ImdbLink target="_blank" href={`https://www.imdb.com/title/${imdbId}`}>
            <ImdbLogo src={cloudinaryCore.url('imdb_logo')}></ImdbLogo>
          </ImdbLink>
          <Separator></Separator>
          <Rating>
            <FullStar icon={faStar}></FullStar>
            <FullStar icon={faStar}></FullStar>
            <FullStar icon={faStar}></FullStar>
            <FullStar icon={faStar}></FullStar>
            <EmptyStar icon={faStar}></EmptyStar>
          </Rating>
        </Info>
        <Synopsis>In 1997, the island of Manhattan has been walled off and turned into a giant maximum security prison within which the country's worst criminals are left to form their own anarchic society. However, when the President of the United States crash lands on the island, the authorities turn to a former soldier and current convict to rescue him.</Synopsis>
        <TorrentSection>
          <ProviderLogo src={cloudinaryCore.url('popcornTime_logo')}></ProviderLogo>
          <Magnet></Magnet>
        </TorrentSection>
        <TorrentSection>
          <ProviderLogo src={cloudinaryCore.url('yts_logo')}></ProviderLogo>
          <Magnet></Magnet>
        </TorrentSection>
        <CommentsContainer>
          <CommentsTitle>Comments</CommentsTitle>
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
      </InfoSection>
    </Hero>
  );
}