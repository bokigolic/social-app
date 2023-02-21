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


          <Link to={"/"}><div className="logo"><span class="fa-stack fa-lg">
            <span class="fa fa-circle fa-stack-2x"></span>
            <span class="fa fa-facebook fa-stack-1x fa-inverse"></span>
          </span> </div></Link>
          <div className="flex-1"></div>
          {
            myUserData ? (
              <>
                <Link to={"/myprofile"}><Avatar src={myUserData.avatar_src} /></Link>
                <div className="nickname"><Link to={"/myprofile"}><b>{myUserData.username}</b></Link></div>
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
