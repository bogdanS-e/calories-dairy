import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import styled, { css } from 'styled-components';
import { useNavigate } from "react-router-dom";

//import { Picker } from "@react-native-picker/picker";

import { toast } from 'react-toastify';

import { useContext } from "../context/globalContext";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const radioProps = [
  { label: "male", value: "male" },
  { label: "female", value: "female" },
];

const PostRegistration = () => {
  const { setUser, baseUrl, checkUser } = useContext();
  const navigate = useNavigate();

  const step1 = useRef(null);
  const step2 = useRef(null);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [date, setDate] = useState("");
  const [sex, setSex] = useState(radioProps[0].label);
  const [step, setStep] = useState(0);
  const [activity, setActivity] = useState();
  const [activityList, setActivityList] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (e) => {
    e.preventDefault();
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
    setTimeout(() => {
      hideDatePicker();

    }, 300);
  };

  const sendData = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const resp = await fetch(`${baseUrl}/profile/`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          "Accept": "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sex,
          weight: +weight,
          height: +height,
          birth_date: moment(date).format("YYYY-MM-DD"),
          physical_activity: activity,
        }),
      });

      const getEatingCategory = await fetch(`${baseUrl}/eating-category/`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "*/*",
        },
      });

      const eatingCategoryJson = await getEatingCategory.json();

      if (resp.status === 201 || resp.status === 200) {
        const json = await resp.json();

        if (json.message) return;

        setUser({
          name: json.user.username,
          height: json.height,
          weight: json.weight,
          birthDate: json.birth_date,
          caloriesNorm: json.calories_norm,
          carbohydrateNorm: json.carbohydrate_norm,
          fatsNorm: json.fats_norm,
          waterNorm: json.water_norm,
          proteinNorm: json.protein_norm,
          sex: json.sex,
          profile: json.id,
          todayWaterEvent: [],
          eatingCategory: eatingCategoryJson.results,
        });

        navigate("nutrition", { page: "nutrition" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const incrementStep = () => {
    if (step === 4) {
      sendData();
      return;
    }

    setStep((prev) => {
      if (prev === 0) {
        const validWeight = parseInt(weight);

        if (!validWeight || validWeight < 10 || validWeight > 300) {
          step1.current.focus();
          return prev;
        }
      } else if (prev === 1) {
        const validHeight = parseInt(height);

        if (!validHeight || validHeight < 50 || validHeight > 300) {
          step2.current.focus();
          return prev;
        }
      } else if (prev === 2) {
        console.log(date);
        if (!date) {

          toast.warn("Validation error", {
            position: toast.POSITION.BOTTOM_CENTER
          });

          return prev;
        }
      }

      return prev + 1;
    });
  };

  const getActivity = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const resp = await fetch(`${baseUrl}/physical-activity/`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "*/*",
        },
      });

      const json = await resp.json();

      console.log("Activity");
      console.log(json.results);
      setActivityList(json.results);
      setActivity(json.results[0].id);
    } catch (error) {
      checkUser(navigate);
    }
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <Container>
      <Step>Step {step + 1}</Step>
      {step === 0 && (
        <div>
          <Text1>Your current weight</Text1>
          <Gradient >
            <Text2>Enter Weight</Text2>
            <InputContainer>
              <NumberInput
                keyboardType="numeric"
                placeholder="68"
                ref={step1}
                onChange={({ target }) => setWeight(target.value)}
                value={weight}
              />
              <DisabledInput
                placeholder="Kg"
                value="Kg"
                readOnly
              />
            </InputContainer>
          </Gradient>
        </div>
      )}

      {step === 1 && (
        <div>
          <Text1>Your current height</Text1>
          <Gradient>
            <Text2>Enter height</Text2>
            <InputContainer>
              <NumberInput
                keyboardType="numeric"
                placeholder="160"
                ref={step2}
                onChange={({ target }) => setHeight(target.value)}
                value={height}
              />
              <DisabledInput
                placeholder="Cm"
                value="Cm"
                readOnly
              />
            </InputContainer>
          </Gradient>
        </div>
      )}

      {step === 2 && (
        <div>
          <Text1>How old are you?</Text1>
          <Gradient>
            <Text2>Your birthday date:</Text2>
            <Button type='button' style={{ padding: '0' }} onClick={showDatePicker}>
              <DisabledDate
                onClick={showDatePicker}
                value={date && moment(date).format("YYYY-MM-DD")}
                placeholder="Press here"
                readOnly
              />
              <DatePicker
                selected={date}
                open={isDatePickerVisible}
                onClickOutside={hideDatePicker}
                onChange={handleConfirm}
                customInput={<input type='hidden' />}
              />
            </Button>
          </Gradient>
        </div>
      )}

      {step === 3 && (
        <div>
          <Text1>Choose your sex:</Text1>
          <Gradient1 >
            {radioProps.map(({ value }, i) => (
              <label key={value}>
                {value}
                <input type='radio' value={value} name='sex' onClick={({ target }) => setSex(target.value)} />
              </label>
            ))}
          </Gradient1>
        </div>
      )}

      {step === 4 && (
        <div>
          <Text1>Select your activity:</Text1>
          {/* <Picker
            style={{
              width: 300,
              backgroundColor: "#9acf02",
              borderRadius: 40,
              fontSize: 20,
              overflow: "hidden",
            }}
            selectedValue={activity}
            onValueChange={(itemValue) => setActivity(itemValue)}
          >
            {Array.isArray(activityList) &&
              activityList.map((activity) => (
                <Picker.Item
                  label={activity.name}
                  value={activity.id}
                  key={activity.id}
                />
              ))}
          </Picker> */}
        </div>
      )}
      <ControllerContainer>
        <Text3>
          All your information is confidencial and will be only visible for you
        </Text3>
        <Button onClick={incrementStep}>
          <TextButton>Proceed</TextButton>
        </Button>
      </ControllerContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background-color: #F4F4F4aa;
  padding: 1px;
  border-radius: 20px;
`;

const ControllerContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TextButton = styled.div`
  font-size: 16px;
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

const InputContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Step = styled.div`
  font-weight: bold;
  color: #393939;
  text-align: center;
  font-size: 32px;
  margin-top: 40px;
`;

const Text1 = styled.div`
  font-weight: bold;
  color: #393939;
  text-align: center;
  font-size: 32px;
  margin-bottom: 30px;
`;

const Text2 = styled(Text1)`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Text3 = styled(Text2)`
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 10px;
`;

const Gradient = styled.div`
  background-image: linear-gradient(#81B23B, #709E60);
  width: 300px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  padding: 10px 25px;
  margin: 0 auto 30px;
`;

const Gradient1 = styled(Gradient)`
  background-image: linear-gradient(#9acf02, #6e9762);
  padding: 20px;
  display: flex;
  align-items: center;
`;

const NumberInput = styled.input`
  background: #fff;
  width: 170px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  font-size: 20px;
`;

const NumberInputAge = styled(NumberInput)`
  width: 240px;
`;

const DisabledInput = styled.input`
  background: #fff;
  text-align: center;
  width: 50px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  fontSize: 20px;
  cursor: initial;
`;

const DisabledDate = styled.input`
  background: transparent;
  color: #000;
  text-align: center;
  width: 240px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  font-size: 20px;
  border:none;
  outline: none !important;
  cursor: pointer;
`;

export default PostRegistration;
