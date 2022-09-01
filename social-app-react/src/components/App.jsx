import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/style.scss";
import LoginForm from "./LoginForm";
import PostList from "./PostList";


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
      
      <PostList />

    </div>
  );
}

export default App;
