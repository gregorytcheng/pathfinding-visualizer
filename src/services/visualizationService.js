import axios from "axios";

const endpoint = "http://127.0.0.1:5000/";

export const createNewViz = (viz) => {
  try {
    axios.post(`${endpoint}new-visualization`, viz);
    console.log("success");
  } catch (e) {
    console.log("error");
  }
};
