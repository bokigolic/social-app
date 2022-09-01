import { useState } from "react";
import { useDispatch } from "react-redux";
import { ajax } from "../utils/ajax-adapter";

const LoginForm = () => {
  const dispatch = useDispatch();

  const preset = {
    username: "",
    password: ""
  };

  const [formState, setFormState] = useState(preset);

  const handleChange = (e) => {
    // console.log(e);
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormState({
      ...formState,
      [name]: value
    })
  };

  const handleLogin = () => {
    console.log("Login", formState);
    const sumbitData = {
      ...formState
    };
    ajax.login(sumbitData)
      .then((response) => {
        dispatch({
          type: 'LOGIN_FETCHED',
          payload: response
        })
      })

  };



  return (
    <div>
      <form>
        <h3>Login</h3>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formState.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleLogin} >Log in</button>
      </form>
    </div>
  );
};
export default LoginForm;