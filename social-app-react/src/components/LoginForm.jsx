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
    <form>
      <div className="login-form">

        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="Username"
        />

        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <button type="button" onClick={handleLogin} ><i className="fa fa-sign-in" aria-hidden="true"></i> Log in</button>
      </div>
    </form>
  );
};
export default LoginForm;