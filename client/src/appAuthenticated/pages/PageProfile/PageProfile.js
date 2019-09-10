import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import cloudinary from 'cloudinary-core';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Hero = styled.section`
  background-color: ${props => props.theme.color.grey};
  height: 100vh;
`;
const ProfileSection = styled.section`
  display: flex;
  justify-content: center;
  padding-top: 10%;
`;
const Container = styled.section`
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
const LineBreak = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  border: inset 1px rgb(0,0,0,0.2);
`;
const Field = styled.div`
  margin-left: 20px;
`;
const Title = styled.p`
  color: gray;
  font-size: 0.8rem;
  font-family: Roboto;
  font-weight: 700;
  margin-top: 30px;
`;
const Value = styled.p`
  margin: 10px 0;
  font-size: 1.2rem;
  font-family: Roboto;
  font-weight: 900;
  color: ${props => props.theme.color.white};
  word-break: break-word;
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

export default function PageMyProfile(props) {

  const authToken = localStorage.getItem('authToken');
  const [error, setError] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    avatarPublicId: '',
  });

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try {
        const res = await axios.get(`/users/${props.match.params.username}?authToken=${authToken}`);
        const { username, firstName, lastName, avatarPublicId } = res.data.user;
        if (isSubscribed) setUser({ username, firstName, lastName, avatarPublicId });
      } catch(err) {
        if (err.response.status === 400 && isSubscribed) setError(true);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, props.match.params.username]);

  return (
    <Hero>
      <ProfileSection>
        <Container>
        {error === true ?
          <h1>This profile does not exist</h1>
          :
          <Fragment>
            <h1>Profile</h1>
            <AvatarContainer>
              <Avatar src={cloudinaryCore.url(user.avatarPublicId)}/>
            </AvatarContainer>
            <Field>
              <Title>Username</Title>
              <Value>{user.username}</Value>
            </Field>
            <LineBreak></LineBreak>
            <Field>
              <Title>First Name</Title>
              <Value>{user.firstName}</Value>
            </Field>
            <LineBreak></LineBreak>
            <Field>
              <Title>Last Name</Title>
              <Value>{user.lastName}</Value>
            </Field>
          </Fragment>
        }
        </Container>
      </ProfileSection>
    </Hero>
  );
}
