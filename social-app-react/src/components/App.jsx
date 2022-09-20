import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/style.scss";
import Avatar from "./Avatar";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";
import LoginForm from "./LoginForm";
import NewPostForm from "./NewPostForm";
import PostList from "./PostList";
import { Route, Routes, useNavigate } from "react-router-dom";
import PageProfile from "./PageProfile";
import PageMyProfile from "./PageMyProfile";
import { Link } from "react-router-dom";


const App = () => {
  const dispatch = useDispatch();
  const myUserData = useSelector(state => state.myUserData);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: 'LOGOUT'
    });
    // nakon logout redorektujem ona pocetnu stranu
    navigate("/");
  };

  return (
    <div className="wrapper">
      <header>
        <div className="inner">

          <Link to={"/"}><div className="logo">Bokibook</div></Link>
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
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/myprofile" element={<PageMyProfile />} />
          <Route path="/user/:id" element={<PageProfile />} />
          <Route path="*" element={<div>Route not found.</div>} />
        </Routes>
      </div>


    </div>
  );
}

export default App;
