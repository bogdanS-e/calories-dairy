import React, { useEffect, useMemo, useState } from "react";
//import NavBar from "./NavBar";
import { useContext } from "../context/globalContext";
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";
import Modal from 'react-modal';

const ChooseFood = () => {
  let { foodId, categoryId } = useParams();
  const navigate = useNavigate();

  const { baseUrl, user: { profile }, checkUser } = useContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [activeFood, setActiveFood] = useState();
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const getFood = async () => {
      const resp = await fetch(`${baseUrl}/food-item?category_id=${categoryId}`);
      const json = await resp.json();

      setCategories(json.results);
    }

    getFood();
  }, []);

  const [searchText, setSearchText] = useState('');

  const filtredCategories = useMemo(() => {
    if (searchText.trim() === '') {
      return categories;
    }

    if (!Array.isArray(categories)) {
      return null;
    }

    return categories.filter((category) => category.name.toLowerCase().includes(searchText.trim().toLowerCase()));
  }, [searchText, categories]);

  const submit = async () => {

    const token = localStorage.getItem("access_token");

    const resp = await fetch(`${baseUrl}/food-event/`, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity: quantity,
        eating_category: foodId,
        food_item: activeFood,
        profile: profile
      }),
    });

    if (resp.status !== 201 && resp.status !== 200) {
      checkUser(navigate);
    }

    const json = await resp.json();

    console.log(json);
    if (json.created) {
      toast.success("Food added", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  if (!filtredCategories) return null;

  return (
    <Container>
      <Button
        style={{ width: '120px', height: '25px' }}
        onClick={() => navigate(`/food/${foodId}`)}
      >
        Go back
      </Button>
      <Header>Choose Food</Header>
      <MainInfo>
        <Input placeholder='Search' onChange={({ target }) => setSearchText(target.value)} />
      </MainInfo>
      <ScrollWrapper>
        {filtredCategories.length ? (
          filtredCategories.map(({ id, name, calorie, carbohydrate, fats, protein }) => (
            <Card
              key={id}
              onClick={() => {
                setModalVisible(true);
                setActiveFood(id);
              }}
            >
              <CardText key={id}>
                <CardName>{name}</CardName>
              </CardText>
              <CardCalories>{calorie} ccal / 100 g</CardCalories>
              <CardCalories>{carbohydrate} carbohydrate / 100 g</CardCalories>
              <CardCalories>{fats} fats / 100 g</CardCalories>
              <CardCalories>{protein} proteins / 100 g</CardCalories>
            </Card>
          ))
        ) : (<>
          <NoResult>There are no food that contain "{searchText}"</NoResult>
          <Image2 src="/assets/avocado2.png" />
        </>)
        }
        <Modal
          style={{
            overlay: {
              zIndex: 2,
            },
            content: {
              maxWidth: '400px',
              overflow: 'hidden',
              margin: '0 auto',
              height: '300px',
            }
          }}
          isOpen={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ModalView>
            <Gradient>
              <Text2>Enter food gramms</Text2>
              <InputContainer>
                <NumberInput
                  placeholder="160"
                  onChange={({ target }) => setQuantity(target.value)}
                  value={quantity}
                />
                <DisabledInput
                  placeholder="g"
                  value="g"
                  readonly
                />
              </InputContainer>
            </Gradient>
            <Control>
              <Button
                onClick={() => setModalVisible(!modalVisible)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(!modalVisible);
                  submit();
                }}
              >
                Add
              </Button>
            </Control>
          </ModalView>
        </Modal>
      </ScrollWrapper>
      {/* <NavBar navigation={navigation} route={route} /> */}
    </Container>
  );
};
const NumberInput = styled.input`
  background: #fff;
  width: 170px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  font-size: 20px;
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
const InputContainer = styled.div`
  color: #3B3B3B;
  font-size: 12px;
  text-align:center;

  font-weight: bold;
`;
const Text2 = styled.div`
  color: #3B3B3B;
  font-size: 12px;
  text-align:center;

  font-weight: bold;
`;
const Control = styled.div`
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NoResult = styled.div`
  text-align: center;
  font-size: 18px;
  margin-top: 40px;
`;

const Gradient = styled.div`
  background-image: linear-gradient(#9acf02, #6e9762);
  flex-direction: row;
  padding: 15px;
  height: 80px;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
`;

const Image2 = styled.img`
  display: block;
  margin: 50px auto 0;
  width: 150px;
  height: 250px;
  object-fit: cover;
`;

const Card = styled.div`
  width: 500px;
  margin-bottom: 15px;
  background-color: #ffffff;
  border-radius: 14px;
  padding: 15px;
  cursor: pointer;
`;

const CardText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardName = styled.div`
font-size: 22px;
    color: rgba(0,0,0,0.6);
    margin: 10px 0;
    padding-left: 8px;
    textTransform: capitalize;
  `;

const CardCalories = styled.div`
  font-size: 18px
  color: rgba(0,0,0,0.4);
  margin: 10px 0;
  padding-right: 8px;
  `;
const ScrollWrapper = styled.div`
  margin-top: 20px;
  overflow-y: scroll;
  height: 600px;
  padding: 10px 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const Header = styled.div`
  margin: 40px 30px;
  font-weight: bold;
  font-size: 24px;
`;
const MainInfo = styled.div`
margin: 40px 30px;

  font-weight: bold;
  font-size: 24px;

`;
const Input = styled.input`
  height: 40px;
  width: 95%;
  padding: 10px 15px;
  font-size: 18px;
`;
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

const TextButton = styled.div`
  font-size: 16px;
  line-height: 21;
  font-weight: bold;
  letter-spacing: 0.25;
  color: #3A4320;
`;

const Button = styled.div`
  margin: 20px;
  display: flex;
  width: 50%;
  height: 25px;
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

const ModalView = styled.div`
display: flex;
flex-direction: column;
margin: 0 auto;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    width: 350px;
    height: 300px;
    align-items: center;
`;

export default ChooseFood;
