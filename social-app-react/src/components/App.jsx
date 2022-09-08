import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/style.scss";
import Avatar from "./Avatar";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";
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
          <div className="logo">Bokibook</div>
          <div className="flex-1"></div>
          {
            myUserData ? (
              <>
                <Avatar src={myUserData.avatar_src} />
                <div><b>{myUserData.username}</b></div>
                <div>
                  <button onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Log Out</button>
                </div>
              </>
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
