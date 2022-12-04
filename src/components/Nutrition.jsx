import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

//import NavBar from "./NavBar";

import { useContext } from "../context/globalContext";

const getProgress = (width, total, taken) => {
  console.log(width, total, taken);
  const percent = (taken * 100) / total;
  return {
    backgroundColor: "#B1D430",
    borderRadius: 5,
    height: 10,
    top: 0,
    left: 0,
    width: (percent * width) / 100,
    position: "absolute",
  };
};

const Nutrition = () => {
  const { user, baseUrl } = useContext();
  const [progressWidth, setProgressWidth] = useState({
    carbs: 0,
    cals: 0,
    fats: 0,
    proteins: 0,
  });

  const [taken, setTaken] = useState([]);
  const [totalTaken, setTotalTaken] = useState({
    cals: 0,
    fats: 0,
    carbs: 0,
    proteins: 0,
  });

  const normal = {
    carbs: user.carbohydrateNorm,
    cals: user.caloriesNorm,
    fats: user.fatsNorm,
    proteins: user.proteinNorm,
  };


  const getInfo = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const getEating = await fetch(`${baseUrl}/statistics/?period=today`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const eatingJson = await getEating.json();

      if (Array.isArray(eatingJson)) {
        const newObject = {
          cals: 0,
          carbs: 0,
          fats: 0,
          proteins: 0,
        };

        eatingJson.forEach((el) => {
          newObject.cals += el.food_item__calorie__sum;
          newObject.carbs += el.food_item__carbohydrate__sum;
          newObject.fats += el.food_item__fats__sum;
          newObject.proteins += el.food_item__protein__sum;
        });

        setTotalTaken(newObject);
      }

      setTaken(eatingJson);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  return (
    <Container>
      <div>
        <Header>Nutrition</Header>
        <MainInfo>
          <div>
            <Horizontal>
              <Text2>Hey, {user.name}!</Text2>
              <Text1>{(normal.cals - totalTaken.cals).toFixed(0)}</Text1>
            </Horizontal>
            <Horizontal>
              <Text3>Let's check your calories today!</Text3>
              <Text3>Cal left</Text3>
            </Horizontal>
            <ProgressBar
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setProgressWidth((prev) => ({
                  ...prev,
                  cals: width,
                }));
              }}
            >
              <div
                style={getProgress(
                  progressWidth.cals,
                  normal.cals,
                  totalTaken.cals
                )}
              />
            </ProgressBar>
            <Horizontal>
              <ParticularValues>
                <Text3>Carbs</Text3>
                <ProgressBarSmall
                  onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setProgressWidth((prev) => ({
                      ...prev,
                      carbs: width,
                    }));
                  }}
                >
                  <div
                    style={getProgress(
                      progressWidth.carbs,
                      normal.carbs,
                      totalTaken.carbs
                    )}
                  />
                </ProgressBarSmall>
                <Text3>{(normal.carbs - totalTaken.carbs).toFixed(0)}g left</Text3>
              </ParticularValues>
              <ParticularValuesCenter>
                <Text3>Proteins</Text3>
                <ProgressBarSmall
                  onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setProgressWidth((prev) => ({
                      ...prev,
                      proteins: width,
                    }));
                  }}
                >
                  <div
                    style={getProgress(
                      progressWidth.proteins,
                      normal.proteins,
                      totalTaken.proteins
                    )}
                  />
                </ProgressBarSmall>
                <Text3>{(normal.proteins - totalTaken.proteins).toFixed(0)}g left</Text3>
              </ParticularValuesCenter>
              <ParticularValues>
                <Text3>Fats</Text3>
                <ProgressBarSmall
                  onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setProgressWidth((prev) => ({
                      ...prev,
                      carbs: width,
                    }));
                  }}
                >
                  <div
                    style={getProgress(
                      progressWidth.fats,
                      normal.fats,
                      totalTaken.fats
                    )}
                  />
                </ProgressBarSmall>
                <Text3>{(normal.fats - totalTaken.fats).toFixed(0)}g left</Text3>
              </ParticularValues>
            </Horizontal>
          </div>
        </MainInfo>
      </div>
      <ScrollWrapper>
        <div>
          {user.eatingCategory.map((el) => {
            return (
              <FoodBlock
                key={el.id}
                to='food'
              //onPress={() => navigation.navigate("food", { page: el.id })}
              >
                <Gradient>
                  <FoodIcon>
                    <FoodIconText>+</FoodIconText>
                  </FoodIcon>
                  <div>
                    <FoodBlockTitle>{el.name}</FoodBlockTitle>
                  </div>
                  <FoodBlockNow>
                    <FoodBlockNowText>
                      {taken.find((take) => take.eating_category_id === el.id)
                        ?.food_item__calorie__sum || "0"}{" "}
                      cal
                    </FoodBlockNowText>
                  </FoodBlockNow>
                </Gradient>
              </FoodBlock>
            );
          })}
        </div>
      </ScrollWrapper>
      {/* <NavBar navigation={navigation} route={route} /> */}
    </Container>
  );
};

const Gradient = styled.div`
  flex-direction: row;
  padding: 15px;
  height: 80px;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
`;


const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  position: relative;
  background-color: #F4F4F4;
`;

const Header = styled.div`
  margin-top: 40px;
  margin-left: 30px;
  font-weight: bold;
  font-size: 24;
`;

const MainInfo = styled.div`
  margin-top: 40px;
  margin-left: 30px;
  font-weight: bold;
  font-size: 24;
`;

const Horizontal = styled.div`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const ParticularValues = styled.div`
  flex: 1;
`;


const ParticularValuesCenter = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const ProgressBar = styled.div`
  background-color: #DCDFE6;
  height: 10px;
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
  position: relative;
`;

const ProgressBarSmall = styled.div`
  background-color: #DCDFE6;
  height: 10px;
  border-radius: 5px,
  margin: 5px 0;
  position: relative;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  margin-top: 20px;
`;

const FoodBlock = styled(Link)`
  margin: 5px 30px;
`;

const Text1 = styled.div`
  font-weight: bold;
  color: #3B3B3B;
  font-size: 20px;
`;

const Text2 = styled.div`
  color: #3B3B3B;
  font-size: 12px;
  font-weight: bold;
`;

const Text3 = styled.div`
  color: #BCBCBC;
  font-size: 12px;
`;

const FoodIcon = styled.div`
  min-height: 30px
  min-width: 30px
  background-color: #FDFEF8;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

const FoodIconText = styled.div`
  font-size: 20px;
  color: #ABD638;
`;

const FoodBlockTitle = styled.div`
  font-size: 20px;
  color: #EBE9E9;
  font-weight: bold;
`;

const FoodBlockRec = styled.div`
  font-size: 12px;
  color: #EBE9E9;
`;

const FoodBlockNow = styled.div`
  background-color: #7DAA59;
  min-width: 70px;
  min-height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

const FoodBlockNowText = styled.div`
  color: #EBE9E9;
`;

export default Nutrition;