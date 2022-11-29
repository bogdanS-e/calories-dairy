import React, { useState } from "react";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

import { useContext } from "../context/globalContext";

const NewSignUp = () => {
  const { baseUrl, checkUser } = useContext();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleSignUp = async () => {
    if (login && password && passwordRepeat) {
      if (passwordRepeat === password) {
        try {
          setIsFetching(true);

          const resp = await fetch(`${baseUrl}/register/`, {
            method: 'post',
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              username: login,
              password,
            }),
          });

          const json = await resp.json();

          if (resp.status !== 201) {
            return toast.warn(json.username[0], {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }

          localStorage.setItem('access_token', json.access_token);

          toast.warn("User hass been created", {
            position: toast.POSITION.BOTTOM_CENTER
          });

          checkUser(navigate);
        } catch (_) {
          
          toast.warn("Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER
          });
        } finally {
          setIsFetching(false);
        }
      } else {
        toast.warn("Password confirmation error", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  return (
    <Container>
      <Text1>Join the challange</Text1>
      <div>
        <Titles>
          <FontAwesomeIcon icon={faUser} color="black" />
          <TextTitles>Name</TextTitles>
        </Titles>
        <Input onChange={({target}) => setLogin(target.value)} value={login} />
        <Titles>
          <FontAwesomeIcon icon={faLock} size={14} color="black" />
          <TextTitles>Password</TextTitles>
        </Titles>
        <Input
          type='password'
          onChange={({target}) => setPassword(target.value)}
          value={password}
        />
        <Titles>
          <FontAwesomeIcon icon={faLock} size={14} color="black" />
          <TextTitles>Repeat password</TextTitles>
        </Titles>
        <Input
          type='password'
          onChange={({target}) => setPasswordRepeat(target.value)}
          value={passwordRepeat}
        />
      </div>
      <div>
        <Helper>
          By signing up you agree with ours terms and conditions
        </Helper>
        <Button
          onClick={handleSignUp}
          disabled={isFetching || !login || !password || !passwordRepeat}
        >
          <TextButton>{isFetching ? 'Loading...' : 'Create Account'}</TextButton>
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background-color: #F4F4F4;
  padding: 1px;
  border-radius: 20px;
`;

const Text1 = styled.div`
  font-weight: bold;
  color: #393939;
  text-align: center;
  font-size: 32px;
  margin-top: 100px;
`;

const Titles = styled.div`
  flex-direction: row;
  max-height: 25px;
  align-items: center;
  margin: 20px 30px;
  display: flex;
`;

const TextTitles = styled.div`
  font-weight: bold;
  color: #393939;
  font-size: 14px;
  margin-left: 10px;
`;

const Input = styled.input`
  border-radius: 10px;
  background-color: #FFFFFF;
  height: 27px;
  margin: 0 30px;
  padding: 10px;
  display: block;
  width: calc(100% - 90px);
`;

const TextButton = styled.div`
  font-size: 16px;
  line-height: 21;
  font-weight: bold;
  letter-spacing: 0.25;
  color: #3A4320;
`;

const Button = styled.div`
  margin: 20px auto;
  display: flex;
  width: 50%;
  height: 35px;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 40px;
  background-color: #B1D430;
  cursor: pointer;

  ${({ disabled }) => disabled && css`
    opacity: 0.5;
    cursor: inherit;
  `}
`;

const Helper = styled.div`
  text-align: center;
  color: #3A4320;
  font-size: 14px;
  margin: 40px 50px;
`;

export default NewSignUp;
