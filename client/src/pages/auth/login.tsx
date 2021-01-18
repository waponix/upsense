import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import Alert from '@paljs/ui/Alert';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { Link } from 'gatsby';
import Auth, { Group } from '../../components/Auth';
// import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import { handleLogin, isLoggedIn } from '../../services/auth';

export default function Login() {
  // do not load this page if user already logged in
  if (isLoggedIn()) navigate('/app/home/dashboard');

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const [error, setError] = useState('');

  const onCheckbox = () => {
    // v will be true or false
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // if login success redirect to home page
    handleLogin(
      credentials,
      function () {
        navigate('/app/home/dashboard');
      },
      function (err: string) {
        setError(err);
      },
    );
  };

  return (
    <Auth title="Sign in" subTitle="Enter your upsense account">
      <SEO title="Sign in" />
      <form onSubmit={onSubmit}>
        {error !== '' ? <Alert status="Danger">{error}</Alert> : ''}
        <InputGroup fullWidth>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            value={credentials.username}
          />
        </InputGroup>
        <InputGroup fullWidth>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            value={credentials.password}
          />
        </InputGroup>
        <Group>
          <Checkbox checked={false} onChange={onCheckbox}>Remember me</Checkbox>
          <Link to="/auth/request-password">Forgot Password?</Link>
        </Group>
        <Button status="Success" type="submit" shape="SemiRound" fullWidth>
          Login
        </Button>
      </form>
      {/*<Socials />*/}
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
}
