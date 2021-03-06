import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect, useHistory } from 'react-router-dom';
import app from '../../utils/Firebase.js';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Wrapper,
  AuthWrapper,
  HeaderWrapper,
  Heading,
  HeaderText,
  Form,
  Label,
  Input,
  Button,
  AuthLink,
} from '../../components/AuthForm/styles/styles.js';
import AuthThemeChanger from '../../components/AuthForm/AuthThemeChanger/AuthThemeChanger';
import { ModalContext } from '../../contexts/ModalContext.js';

const Login = () => {
  const { setModalContent, setShowModal } = useContext(ModalContext);

  let history = useHistory();

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        setModalContent(
          <>
            There has been an issue with the Login. Please try again and make
            sure your input is correct.
          </>
        );
        setShowModal(true);
      }
    },
    [history, setModalContent, setShowModal]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper>
      <AuthWrapper>
        <HeaderWrapper>
          <Heading>Robin's Pokédex</Heading>
          <HeaderText>
            Thanks for checking out my Pokédex Web App! <br />
            <br />
            After signing up you will be able to get information on the
            originial 151 Pokémon and mark which ones you have caught. Have fun!
          </HeaderText>
        </HeaderWrapper>

        <Form onSubmit={handleLogin}>
          <Label htmlFor="email">Email</Label>

          <Input name="email" type="email" placeholder="Email" />
          <Label hmtlFor="password">Password</Label>

          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit">Log in</Button>
        </Form>
        <AuthThemeChanger />
        <AuthLink to="/signup">Sign up instead</AuthLink>
      </AuthWrapper>
    </Wrapper>
  );
};

export default withRouter(Login);
