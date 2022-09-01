import { useEffect } from "react";
import axios from 'axios';
import "../scss/style.scss";
import LoginForm from "./LoginForm";


const App = () => {
  console.log('testing backend...');

  useEffect(() => {
    /*
    axios.get('http://localhost:3033/posts')
      .then((response) => {
        console.log('response GET', response)
      })

    const data = {
      title: 'treci'
    };
    axios.post('http://localhost:3033/posts', data)
      .then((response) => {
        console.log('response POST', response)
      })

    const data2 = {
      username: 'boki',
      password: 'boki'
    };
    axios.post('http://localhost:3033/users', data2)
      .then((response) => {
        console.log('response POST 2', response)
      })
      */

  }, []);

  return (
    <div className="App">
      App
      <LoginForm />
    </div>
  );
}

export default App;
