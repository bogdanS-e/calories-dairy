import React, { useState } from 'react'
import { useContext } from '../context/globalContext'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import styled from 'styled-components'

const Profile = () => {
  const { user, baseUrl, checkUser, editUser } = useContext()
  const navigate = useNavigate()
  const [weight, setWeight] = useState(String(user.weight) || '')
  const [height, setHeight] = useState(String(user.height) || '')

  const sendData = async () => {
    const token = localStorage.getItem('access_token')

    try {
      const resp = await fetch(`${baseUrl}/profile/`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight: +weight,
          height: +height,
        }),
      })

      if (resp.status === 401) {
        return checkUser(navigate)
      }
      const json = await resp.json()
      console.log(json)
      editUser({
        height: json.height,
        weight: json.weight,
      })
    } catch (error) {
      console.log(error)
      checkUser(navigate)
    }
  }

  async function signOut() {
    navigate('/sign-in')
    localStorage.removeItem('access_token')
  }

  return (
    <Container>
      <InsideContainer>
        <TopView>
          <Text1>Profile</Text1>
          <LogOutButton
            onClick={async () => {
              signOut()
            }}
          >
            Log out
          </LogOutButton>
        </TopView>
        <div style={{ height: 490 }}>
          <Gradient>
            <Text2>Enter Weight</Text2>
            <InputContainer>
              <NumberInput
                keyboardType="numeric"
                placeholder="68"
                onChange={({ target }) => setWeight(target.value)}
                value={weight}
                type="number"
              />
              <DisabledInput placeholder="Kg" value="Kg" readOnly />
            </InputContainer>
          </Gradient>

          <Gradient>
            <Text2>Enter Height</Text2>
            <InputContainer>
              <NumberInput
                keyboardType="numeric"
                placeholder="180"
                onChange={({ target }) => setHeight(target.value)}
                value={height}
                type="number"
              />
              <DisabledInput placeholder="Cm" value="Cm" readOnly />
            </InputContainer>
          </Gradient>
        </div>

        <ControllerContainer>
          <Button onClick={sendData}>
            <TextButton>Proceed</TextButton>
          </Button>
        </ControllerContainer>
      </InsideContainer>
      <NavBar />
    </Container>
  )
}

const Container = styled.div`
  background-color: #f4f4f4;
  flex-direction: column;
  width: 800px;
`

const InsideContainer = styled.div`
  background-color: #f4f4f4;
`

const TopView = styled.div`
  margin-left: 10%;
  padding-top: 30px;
  padding-bottom: 50px;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Text1 = styled.div`
  align-self: flex-start;
  font-weight: bold;
  font-size: 24;
`

const ControllerContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Button = styled.div`
  margin-bottom: 20px;
  width: 80%;
  height: 45px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 4px;
  background-color: #b1d430;
`

const TextButton = styled.div`
  font-size: 16px;
  line-height: 21px;
  font-weight: bold;
  letter-spacing: 0.25;
  color: #3a4320;
`

const LogOutButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Gradient = styled.div`
  background-image: linear-gradient(#81b23b, #709e60);
  width: 500px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  padding: 10px 25px;
  margin: 0 auto 30px;
`

const Text2 = styled.div`
  font-weight: bold;
  color: #393939;
  font-size: 18px;
  margin-bottom: 10px;
`

const InputContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const NumberInput = styled.input`
  background: #fff;
  width: 370px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  font-size: 20px;
`

const DisabledInput = styled.input`
  background: #fff;
  text-align: center;
  width: 50px;
  height: 40px;
  border-radius: 14px;
  padding: 0 10px;
  fontsize: 20px;
  cursor: initial;
`

/*const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    backgroundColor: '#F4F4F4',
  },
  titles: {
    flexDirection: 'row',
    maxHeight: 25,
    alignItems: 'center',
    marginLeft: 30,
    marginVertical: 10,
  },
  topView: {
    marginTop: 40,
    marginLeft: 200,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controllerContainer: {
    marginTop: -10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#3A4320',
  },
  button: {
    marginBottom: 20,
    width: ScreenWidth / 1.5,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#B1D430',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  step: {
    fontWeight: 'bold',
    color: '#393939',
    textAlign: 'center',
    fontSize: 32,
    marginTop: 100,
    marginBottom: 20,
  },
  text1: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 24,
  },
  text2: {
    fontWeight: 'bold',
    color: '#393939',
    fontSize: 18,
    marginBottom: 10,
  },
  text3: {
    color: '#9b9b9b',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    padding: 10,
  },
  linearGradient: {
    width: 300,
    marginBottom: 20,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  numberInput: {
    backgroundColor: '#fff',
    width: 170,
    height: 40,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  numberInputAge: {
    backgroundColor: '#fff',
    width: 240,
    height: 40,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  disableInput: {
    backgroundColor: '#fff',
    textAlign: 'center',
    width: 50,
    height: 40,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  disableDate: {
    backgroundColor: '#fff',
    color: '#000',
    textAlign: 'center',
    width: 250,
    height: 40,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 20,
  },
})*/

export default Profile
