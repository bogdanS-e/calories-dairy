import React, { useState } from "react";

export const GlobalContext = React.createContext({
  user: {
    name: "",
    height: "",
    weight: "",
    birthDate: "",
    caloriesNorm: "",
    carbohydrateNorm: "",
    fatsNorm: "",
    waterNorm: "",
    proteinNorm: "",
    sex: "",
    profile: "",
  },
  baseUrl: "",
  setUser: (user) => { },
  editUser: (newData) => { },
  checkUser: () => { },
});

export const useContext = () => React.useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const baseUrl = "https://ripe-views-turn-91-237-27-48.loca.lt/api";

  const [user, setUser] = useState({
    name: "",
    height: "",
    weight: "",
    birthDate: "",
    caloriesNorm: "",
    carbohydrateNorm: "",
    fatsNorm: "",
    waterNorm: "",
    proteinNorm: "",
    sex: "",
    profile: "",
    todayWaterEvent: [],
    eatingCategory: [],
  });

  const handleUser = (newUser) => {
    setUser(newUser);
  };

  const handleEditUser = (newUserData) => {
    setUser((currentUser) => {
      return Object.assign(currentUser, newUserData);
    });
  };

  const checkUser = async (navigate) => {
    const token = localStorage.getItem("access_token");

    try {
      if (token) {
        const resp = await fetch(`${baseUrl}/user-info/`, {
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await resp.json();

        if (json.code === "token_not_valid") {
          return navigate("/");
        }

        if (json.username) {
          const { is_ready, access_token } = json;

          localStorage.setItem("access_token", access_token);

          if (!is_ready) {
            return navigate("post-registration");
          }

          const getUserResp = await fetch(`${baseUrl}/profile/`, {
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const jsonUser = await getUserResp.json();

          if (jsonUser.code === "token_not_valid") {
            return navigate("/");
          }

          const getUserWater = await fetch(`${baseUrl}/water-event/`, {
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const jsonUserWater = await getUserWater.json();

          const getEatingCategory = await fetch(`${baseUrl}/eating-category/`, {
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const eatingCategoryJson = await getEatingCategory.json();

          setUser({
            name: jsonUser.user.username,
            height: jsonUser.height,
            weight: jsonUser.weight,
            birthDate: jsonUser.birth_date,
            caloriesNorm: jsonUser.calories_norm,
            carbohydrateNorm: jsonUser.carbohydrate_norm,
            fatsNorm: jsonUser.fats_norm,
            proteinNorm: jsonUser.protein_norm,
            waterNorm: jsonUser.water_norm,
            sex: jsonUser.sex,
            profile: jsonUser.id,
            todayWaterEvent: jsonUserWater.results,
            eatingCategory: eatingCategoryJson.results,
          });

          navigate("nutrition");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser: handleUser,
        editUser: handleEditUser,
        baseUrl,
        checkUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
