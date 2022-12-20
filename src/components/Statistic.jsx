import React, { useState } from 'react'
import styled from 'styled-components'
import NavBar from './NavBar'

import { useContext } from '../context/globalContext'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}
function setDays() {
  let today = new Date().getDay()
  const days = []
  for (let i = 0; i < 7; i++) {
    today = today === 6 ? 0 : today + 1
    days.push(today)
  }
  return days
}

const Nutrition = ({ navigation, route }) => {
  const { baseUrl } = useContext()

  const [water, setWater] = useState(
    setDays().map((el) => {
      return {
        day: el,
        water: 0,
      }
    }),
  )
  const [food, setFood] = useState(
    setDays().map((el) => {
      return {
        day: el,
        cals: 0,
        fats: 0,
        carbs: 0,
        proteins: 0,
      }
    }),
  )

  const getInfo = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const getEating = await fetch(`${baseUrl}/statistics/?period=week`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
      })

      const eatingJson = await getEating.json()
      const waterFull = []
      const eatingFull = []
      eatingJson.forEach((el) => {
        if (el.quantity__sum) {
          waterFull.push({
            day: new Date(el.created__date).getDay(),
            water: el.quantity__sum,
          })
        } else {
          eatingFull.push({
            day: new Date(el.created__date).getDay(),
            cals: el.food_item__calorie__sum,
            fats: el.food_item__fats__sum,
            carbs: el.food_item__carbohydrate__sum,
            proteins: el.food_item__protein__sum,
          })
        }
      })
      setFood((prev) => {
        return prev.map((el) => {
          const find = eatingFull.find((full) => full.day === el.day)
          return find || el
        })
      })
      setWater((prev) => {
        return prev.map((el) => {
          const find = waterFull.find((full) => full.day === el.day)
          return find || el
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    getInfo()
  }, [])

  const dataWater = {
    labels: setDays().map((el) => days[el]),
    datasets: [
      {
        data: water.map((el) => el.water),
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: food.map((el) => el.cals),
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Water', 'Calories'], // optional
  }

  const dataFood = {
    labels: setDays().map((el) => days[el]),
    datasets: [
      {
        data: food.map((el) => el.proteins),
        color: (opacity = 1) => `rgba(100, 100, 255, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: food.map((el) => el.carbs),
        color: (opacity = 1) => `rgba(100, 255, 100, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: food.map((el) => el.fats),
        color: (opacity = 1) => `rgba(255, 100, 100, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Proteins', 'Carbohydrates', 'Fats'], // optional
  }

  return (
    <Container>
      <div>
        <Header>Week statistics</Header>
      </div>
      <ScrollWrapper>
        <Line options={options} data={dataWater} />
        <Line options={options} data={dataFood} />
      </ScrollWrapper>
      <NavBar />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: #f4f4f4;
  width: 800px;
`

const Header = styled.div`
  margin-top: 40px;
  font-seight: bold;
  font-size: 24px;
`

const ScrollWrapper = styled.div`
  flex: 1;
  margin-top: 20px;
  min-height: 600px;
  width: 500px;
`

export default Nutrition
