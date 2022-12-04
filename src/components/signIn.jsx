import React, { useState } from "react";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useContext } from "../context/globalContext";
import { useNavigate } from "react-router-dom";

const NewSignIn = () => {
  const { baseUrl, checkUser } = useContext();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsFetching(true);

      const resp = await fetch(`${baseUrl}/token/`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          "Accept": "*/*",
        },
        body: JSON.stringify({
          username: login,
          password,
        }),
      });

      const json = await resp.json();

      console.log(resp.status);
      console.log(json);
      if (resp.status !== 201 && resp.status !== 200) {
        return toast.warn(json.detail, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }

      localStorage.setItem("access_token", json.access);
      checkUser(navigate);
    } catch (_) {
      toast.warn("Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Container>
      <Text1>Continue your challenge</Text1>
      <div>
        <Titles>
          <FontAwesomeIcon icon={faUser} size={14} color="black" />
          <TextTitles>Name</TextTitles>
        </Titles>
        <Input onChange={({ target }) => setLogin(target.value)} value={login} />
        <Titles>
          <FontAwesomeIcon icon={faLock} size={14} color="black" />
          <TextTitles>Password</TextTitles>
        </Titles>
        <Input
          onChange={({ target }) => setPassword(target.value)}
          value={password}
          type='password'
        />
      </div>
      <div>
        <Helper>
          Thank you for using our app! Don't stop and continue reach new goals
        </Helper>
        <Button
          onClick={handleSignIn}
          disabled={isFetching}
        >
          <TextButton>
            {isFetching ? "Loading..." : "Sign in"}
          </TextButton>
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
  height: 45px;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 40px;
  background-color: #B1D430;
  cursor: pointer;

  ${({ disabled }) => disabled && css`
    opacity: 0.5,
  `}
`;

const Helper = styled.div`
  text-align: center;
  color: #3A4320;
  font-size: 14px;
  margin: 40px 50px;
`;

export default NewSignIn;
