import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/style.scss";
import LoginForm from "./LoginForm";


const App = () => {
  const dispatch = useDispatch();
  const myUserData = useSelector(state => state.myUserData);

  const handleLogout = () => {
    dispatch({
      type: 'LOGOUT'
    })
  }

  return (
    <div className="wrapper">
      <header>
        {
          myUserData ? (
            <div>
              {myUserData.username} <button onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <LoginForm />
          )
        }


      </header>
      App
    </div>
  );
}

export default App;
