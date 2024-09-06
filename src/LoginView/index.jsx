import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { setUserAction, setForeclosureListingsAction } from '../actions';
import { doLogin, doSignup } from '../utils/apolloClient';
import { mapDataToProperty } from '../utils/Property';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(0%, 150%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(0%, 0%) scale(1);
  }
`;

const Container = styled.div`
    display: flex; /* Use Flexbox layout */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100vh; /* Full viewport height */
    flex-flow: column; /* DEMO CODE */
`

const Box = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  animation: ${fadeIn} 1s ease-out;
  z-index: 1000;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled(Button)`
  background: #007bff;

  &:hover {
    background: #0056b3;
  }
`;

const SignupButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

const StatusMessage = styled.div`
  margin-bottom: 15px;
  color: red;
`;

const auth = {
  username: '',
  password: '',
  password2: '',
};

function LoginView(props) {
  const [statusMsg, setStatusMsg] = useState('');
  const [showView, setView] = useState('');
  const { setUser, setForeclosureListings } = props;

  useEffect(() => {
    doLogin().then(({ login, getForeclosureListings }) => {
      setForeclosureListings(mapDataToProperty(getForeclosureListings));
      setUser(login);
    }).catch((e) => {
      console.log(e)
    });
  }, []);

  const handleLogin = async () => {
    const { username, password } = auth;
    try {
      const resp = await doLogin(username, password);
      if (resp) {
        setForeclosureListings(mapDataToProperty(resp.getForeclosureListings));
        setUser(resp.login); // This will update redux that will set new routes that are now allowed
      }
    } catch (error) {
      console.error(error);
      setStatusMsg(error.cause.message || 'An error occurred logging in');
    }
  };

  const handleSignup = async () => {
    const { username, password, password2 } = auth;

    if (password === password2) {
      try {
        const { createUser: user, getForeclosureListings: foreclosureListings } = await doSignup(username, password);
        if (user && statusMsg) {
          setStatusMsg('');
        }
        setForeclosureListings(mapDataToProperty(foreclosureListings));
        setUser(user);
        setView(''); // Redirect to login after signup
      } catch (error) {
        console.error(error);
        setStatusMsg(error.cause.message || 'An error occurred signing up');
      }
    } else {
      setStatusMsg('Passwords do not match, please try again');
    }
  };

  const keyPress = (e, type) => {
    auth[type] = e.target.value;
    if (e.keyCode === 13) {
      return showView === 'signup' ? handleSignup() : handleLogin();
    }
  };

  const renderSignUp = () => (
    <Box>
      <h1>Signup</h1>
      <StatusMessage>{statusMsg}</StatusMessage>
      <FormGroup>
        <Label>Username:</Label>
        <Input onKeyUp={(e) => keyPress(e, 'username')} />
      </FormGroup>
      <FormGroup>
        <Label>Password:</Label>
        <Input type="password" onKeyUp={(e) => keyPress(e, 'password')} />
      </FormGroup>
      <FormGroup>
        <Label>Confirm Password:</Label>
        <Input type="password" onKeyUp={(e) => keyPress(e, 'password2')} />
      </FormGroup>
      <SubmitButton onClick={() => handleSignup()}>Submit</SubmitButton>
    </Box>
  );

  const renderLogin = () => (
    <Box>
      <h1>Login</h1>
      <StatusMessage>{statusMsg}</StatusMessage>
      <FormGroup>
        <Label>Username:</Label>
        <Input name="username" onChange={(e) => keyPress(e, 'username')} />
      </FormGroup>
      <FormGroup>
        <Label>Password:</Label>
        <Input
          type="password"
          name="password"
          onChange={(e) => keyPress(e, 'password')}
        />
      </FormGroup>
      <SubmitButton onClick={() => handleLogin()}>Submit!</SubmitButton>
      <SignupButton onClick={() => setView('signup')}>Signup!</SignupButton>
    </Box>
  );

  return (
    <Container>
      {showView === 'signup' ? renderSignUp() : renderLogin()}
      <img src="/demo.gif" alt="App Demo" style={{width: 500, marginTop: 20, border: "5px solid #888"}} />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUserAction(user)),
  setForeclosureListings: (fListings) => dispatch(setForeclosureListingsAction(fListings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
