import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/style.scss";
import LoginForm from "./LoginForm";
import NewPostForm from "./NewPostForm";
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
        <div className="inner">
          <div className="logo">Logo</div>
          {
            myUserData ? (
              <div>
                {myUserData.username} <button onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Log Out</button>
              </div>
            ) : (
              <LoginForm />
            )
          }
        </div>
      </header>

      <div className="inner">
        <PostList />
      </div>


    </div>
  );
}

export default App;
