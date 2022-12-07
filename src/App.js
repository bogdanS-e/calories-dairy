import React from "react";
import { Routes, Route } from "react-router-dom";
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

import { GlobalContextProvider } from "./context/globalContext";

import StartPage from "./components/startPage";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import PostRegistration from "./components/PostRegistration";
import Statistic from "./components/Statistic";
import Nutrition from "./components/Nutrition";
import Food from "./components/Food";
import ChooseFood from "./components/ChooseFood";
//import Hydration from "./components/Hydration";

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <GlobalContextProvider>
      <Page>
        <ToastContainer />

        <Content>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/post-registration" element={<PostRegistration />} />
            <Route path="/statistic" element={<Statistic />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/food/:foodId" element={<Food />} />
            <Route path="/food/:foodId/:categoryId" element={<ChooseFood />} />
            {/* <Route path="/hydration" element={<Hydration />} /> */}
          </Routes>
        </Content>
        <Overlay />
      </Page>
    </GlobalContextProvider>
  );
}

const Overlay = styled.div`
  background: url(/assets/avocado.png);
  filter: blur(20px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

const Page = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 800px;
  height: calc(100vh - 40px);
  border-radius: 20px;
  overflow: hidden;
`;