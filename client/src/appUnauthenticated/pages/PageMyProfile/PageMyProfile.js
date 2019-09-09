import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hero = styled.section`
  background-color: ${props => props.theme.color.grey};
  height: 100vh;
`;
const Section = styled.section`
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
`;

export default function PageMyProfile(props) {

  return (
    <Hero>
      <Section>
        <Container>
          <Link to="/myProfileEdit">
            <Edit>Edit</Edit>
          </Link>
          <h1>Profile</h1>
          <Field>
            <Title>Username</Title>
            <Value>Boubou</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>Email</Title>
            <Value>baptiste.boucher@gmail.com</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>First Name</Title>
            <Value>Baptiste</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>Last Name</Title>
            <Value>Boucher</Value>
          </Field>
        </Container>
      </Section>
    </Hero>
  );
}
