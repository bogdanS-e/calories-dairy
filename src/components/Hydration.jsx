import React, { useState } from 'react'
import { useContext } from '../context/globalContext'
import styled, { css } from 'styled-components'
import { toast } from 'react-toastify'
import NavBar from './NavBar'

const formatAMPM = (dateString) => {
  let date = new Date(dateString)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  return hours + ':' + minutes
}

const getProgress = (full, percent) => {
  const width = percent > 100 ? full : Math.round((full * percent) / 100)
  return {
    backgroundColor: '#4065A9',
    borderRadius: 5,
    height: 10,
    top: 0,
    left: 0,
    width: width || 0,
    position: 'absolute',
  }
}

const Hydration = () => {
  const { user, baseUrl, setUser } = useContext()
  const [fullWidthProgress, setFullWidthProgress] = useState(0)
  const [newValue, setNewValue] = useState(250)
  const [isFetching, setIsFetching] = useState(false)
  const completed = user.todayWaterEvent.reduce(
    (prev, curr) => ({
      quantity: prev.quantity + curr.quantity,
    }),
    { quantity: 0 },
  ).quantity
  const left = user.waterNorm - completed
  const completedPercent = Math.round((completed * 100) / user.waterNorm)

  const addWaterEvent = async (value) => {
    const token = localStorage.getItem('access_token')
    try {
      setIsFetching(true)
      const resp = await fetch(`${baseUrl}/water-event/`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: value,
          profile: user.profile,
          created: new Date(),
        }),
      })
      const json = await resp.json()
      setUser({
        ...user,
        todayWaterEvent: [json, ...user.todayWaterEvent],
      })
      setNewValue(250)
      setIsFetching(false)
    } catch (err) {
      setIsFetching(false)
      console.log(err)
      toast.warn('Something went wrong', {
        position: toast.POSITION.BOTTOM_CENTER,
      })
    }
  }

  return (
    <Container>
      <div>
        <Header>Hydration</Header>
        <MainInfo>
          <div>
            <Horizontal>
              <Text2>Current hydration</Text2>
              <Text1>{left}</Text1>
            </Horizontal>
            <Horizontal>
              <Text3>Did you drink your water today?</Text3>
              <Text3>ml left</Text3>
            </Horizontal>
            <ProgressBar
              ref={(node) => {
                setFullWidthProgress(node?.clientWidth || 0)
              }}
            >
              <div style={getProgress(fullWidthProgress, completedPercent)} />
            </ProgressBar>
            <Horizontal>
              <Text2>Goal: {user.waterNorm} ml</Text2>
              <Text3>{completedPercent}% completed</Text3>
            </Horizontal>
          </div>
        </MainInfo>
      </div>
      <SliderContainer>
        <SliderController>
          <SliderControllerButton onClick={() => setNewValue(newValue - 10)}>
            <SliderControllerButtonText>-</SliderControllerButtonText>
          </SliderControllerButton>
          <NewValueText>{newValue} ml</NewValueText>
          <SliderControllerButton onClick={() => setNewValue(newValue + 10)}>
            <SliderControllerButtonText>+</SliderControllerButtonText>
          </SliderControllerButton>
        </SliderController>
        <SliderControllerAdd
          disabled={isFetching}
          onClick={() => {
            addWaterEvent(newValue)
          }}
        >
          <SliderControllerAddText>Add portion</SliderControllerAddText>
        </SliderControllerAdd>
      </SliderContainer>
      <ScrollWrapper>
        <div>
          {user.todayWaterEvent.map((el, index) => {
            return (
              <DrinkingBlock>
                <Gradient>
                  <DrinkedBlockVolume>{el.quantity} ml</DrinkedBlockVolume>
                  <DrinkedBlockDate>{formatAMPM(el.created)}</DrinkedBlockDate>
                </Gradient>
              </DrinkingBlock>
            )
          })}
        </div>
      </ScrollWrapper>{' '}
      <NavBar />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  position: relative;
  background-color: #f4f4f4;
  flex-direction: column;
  width: 800px;
`

const DrinkingBlock = styled.div`
  margin: 0 40px;
  height: 120px;
`

const DrinkedBlockVolume = styled.div`
  color: #ebe9e9;
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;
`

const DrinkedBlockDate = styled.div`
  color: #ebe9e9;
  font-size: 16px;
  margin-right: 20px;
`

const Header = styled.div`
  margin-top: 40px;
  margin-left: 30px;
  font-weight: bold;
  font-size: 24px;
`

const Gradient = styled.div`
  background-image: linear-gradient(#3c9ee9, #3a63a1);
  flex-direction: row;
  padding: 15px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ScrollWrapper = styled.div`
  flex: 1;
  margin-top: 20px;
  min-height: 398px;
  max-height: 398px;
  overflow-y: auto;
`

const MainInfo = styled.div`
  margin: 15px 30px 0;
  font-weight: bold;
  font-size: 24px;
`

const Horizontal = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const ProgressBar = styled.div`
  background-color: #dcdfe6;
  height: 10px;
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
  position: relative;
`

const Text1 = styled.div`
  font-weight: bold;
  color: #3b3b3b;
  font-size: 20px;
`

const Text2 = styled.div`
  color: #3b3b3b;
  font-size: 12px;
  font-weight: bold;
`

const Text3 = styled.div`
  color: #bcbcbc;
  font-size: 12px;
`

//0000000

const SliderContainer = styled.div`
  margin: 10px 30px;
`

const SliderController = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NewValueText = styled.div`
  font-size: 16px;
  font-weight: bold;
`

const SliderControllerButton = styled.div`
  width: 40px;
  background-color: #4065a9;
  height: 30px;
  border-radius: 100px;
  height: 30px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const SliderControllerButtonText = styled.div`
  color: #f4f4f4;
  font-size: 20px;
`

const SliderControllerAdd = styled.div`
  background-color: #4065a9;
  height: 30px;
  border-radius: 5px;
  height: 30px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: inherit;
    `}
`

const SliderControllerAddText = styled.div`
  color: #f4f4f4;
  font-size: 16px;
`

export default Hydration
