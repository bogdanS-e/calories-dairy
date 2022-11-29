import React, { useEffect } from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

import { useContext } from "../context/globalContext";

const StartPage = ({ navigation }) => {
  const { checkUser } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser(navigation);
  }, []);

  return (
    <Container >
      <Gradient >
        <div>
          <TopMargin />
          <Top>
            <Text1>Challange accepted</Text1>
            <Text2>
              Chalange yourself and bring healthy back into your life
            </Text2>
          </Top>
        </div>
        <Image src="/assets/avocado.png" />
        <div>
          <Button
            key='a'
            onClick={() => navigate("sign-in")}
          >
            <TextButton>Get In</TextButton>
          </Button>
          <ButtonNew
            key='b'
            onClick={() => navigate("sign-up")}
          >
            <TextButton>Create an Account</TextButton>
          </ButtonNew>
        </div>
      </Gradient>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const TopMargin = styled.div`
  height: 60px;
`;

const Top = styled.div`
  background-color: #97C059;
  border-radius: 20px;
  padding: 10px;
`;

const Text1 = styled.div`
  font-weight: bold;
  color: #E6E7DE;
  text-align: center;
  font-size: 32px;
  margin-top: 30px;
`;

const Text2 = styled.div`
  color: #E6E7DE;
  text-align: center;
  font-size: 24px;
  margin-top: 30px;
  margin: 20px 50px 80px 50px;
`;

const Image = styled.img`
  display: block;
  margin: 0 auto;
  width: 300px;
`;

const Gradient = styled.div`
  background-image: linear-gradient(#81B23B, #709E60);
  min-height: 100vh;
  padding: 0 20px;
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
`;

const ButtonNew = styled(Button)`
  background-color: #ccc3d2;
`;

export default StartPage;
