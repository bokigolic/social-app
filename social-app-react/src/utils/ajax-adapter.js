import axios from "axios";


const apiUrlPrefix = 'http://localhost:3033';


export const ajax = {};

ajax.login = async (sumbitData) => {
  const url = apiUrlPrefix + '/users';
  const response = await axios.get(url); // ova promeniva ceka dok ne stigne response sa backenda
  console.log('response from /users', response);
  // sad laziramo deo posla sa backenda
  let myUserData = null;
  if (response && response.data && Array.isArray(response.data)) {
    const users = response.data;
    const username = sumbitData.username;
    const password = sumbitData.password;
    users.forEach((item) => {
      if (item.username === username && item.password === password) {
        myUserData = item;
      }
    });
  }
  return myUserData;
};

ajax.getAllPosts = async () => {
  const url = apiUrlPrefix + '/posts';
  const response = await axios.get(url);
  console.log('response from /posts', response);
  let posts = [];
  if (response && response.data && Array.isArray(response.data)) {
    posts = response.data;
  }
  return posts;
};

ajax.createPost = async (sumbitData) => {
  const url = apiUrlPrefix + '/posts';
  const data = {
    ...sumbitData,
    timestamp: Date.now() // vreme inace treba da se doda na backendu ali sad laziramo
  };
  const response = await axios.post(url, data);
  return true; // iako uspe i ako ne uspe
};