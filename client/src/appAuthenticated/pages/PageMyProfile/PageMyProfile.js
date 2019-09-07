import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
const Edit = styled.p`
  color: gray;
  font-size: 1rem;
  font-family: Roboto;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 50px;
  &:hover {
    color: ${props => props.theme.color.red};
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

export default function PageMyProfile(props) {

  const authToken = localStorage.getItem('authToken');
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      const res = await axios.get(`/users?authToken=${authToken}`);
      const { username, email, firstName, lastName } = res.data.user;
      if (isSubscribed) {
        setUser({ username, email, firstName, lastName })
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken]);

  return (
    <Hero>
      <ProfileSection>
        <Container>
          <Link to="/myProfileEdit">
            <Edit>Edit</Edit>
          </Link>
          <h1>Profile</h1>
          <Field>
            <Title>Username</Title>
            <Value>{user.username}</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>Email</Title>
            <Value>{user.email}</Value>
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
          {/* <LineBreak></LineBreak>
          <Field>
            <Title>Password</Title>
            <Value>********</Value>
            <ChangePasswordButton>
              <p><FontAwesomeIcon  style={{fontSize: '15px', color: 'white'}} icon={faLock}/> Change Password</p>
            </ChangePasswordButton>
          </Field> */}
        </Container>
      </ProfileSection>
    </Hero>
  );
}