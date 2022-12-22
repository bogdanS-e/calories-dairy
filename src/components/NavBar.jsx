import React from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

const pages = ['statistic', 'nutrition', 'hydration', 'profile']

const NavBar = () => {
  const location = useLocation()
  const page = location.pathname.slice(1)
  const navigate = useNavigate()

  const pageIndex = pages.indexOf(page)
  const historyPush = (url) => {
    navigate(url)
  }

  return (
    <Container>
      <Sign style={{ marginLeft: `${25 * pageIndex}%` }} />
      <BottomNavigation>
        <NavButton
          style={{
            fontWeight: pageIndex === 0 ? 600 : 400,
            fontSize: pageIndex === 0 ? 20 : 16,
            textDecoration: pageIndex === 0 ? 'underline' : 'none',
          }}
          onClick={() => {
            historyPush('/statistic')
          }}
        >
          Statistic
        </NavButton>
        <NavButton
          style={{
            fontWeight: pageIndex === 1 ? 600 : 400,
            fontSize: pageIndex === 1 ? 20 : 16,
            textDecoration: pageIndex === 1 ? 'underline' : 'none',
          }}
          onClick={() => {
            historyPush('/nutrition')
          }}
        >
          Nutrition
        </NavButton>
        <NavButton
          style={{
            fontWeight: pageIndex === 2 ? 600 : 400,
            fontSize: pageIndex === 2 ? 20 : 16,
            textDecoration: pageIndex === 2 ? 'underline' : 'none',
          }}
          onClick={() => {
            historyPush('/hydration')
          }}
        >
          Hydration
        </NavButton>
        <NavButton
          style={{
            fontWeight: pageIndex === 3 ? 600 : 400,
            fontSize: pageIndex === 3 ? 20 : 16,
            textDecoration: pageIndex === 3 ? 'underline' : 'none',
          }}
          onClick={() => {
            historyPush('/profile')
          }}
        >
          Profile
        </NavButton>
      </BottomNavigation>
    </Container>
  )
}

const Sign = styled.div`
  border-radius: 10px 10px 0 0;
  flex: 1;
  width: 25%;
  height: 9px;
  background-color: #b1d430;
`

const Container = styled.div`
  height: 70px;
  width: 100%;
`

const BottomNavigation = styled.div`
  display: flex;
  flex: 1;
  height: 60px;
  justify-content: space-between;
  background-color: #b1d430;
`

const NavButton = styled.div`
  display: block;
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #edf0ee;
`

export default NavBar
