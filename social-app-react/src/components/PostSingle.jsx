import { useEffect } from "react";
import { useState } from "react";
import { timestampToDateDIsplay } from "../utils/date-utils";
import Avatar from "./Avatar";
import axios from "axios";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";
import { ajax } from "../utils/ajax-adapter";
import { useSelector } from "react-redux";
import PostLikesWidget from "./PostLikesWidget";
import { Link } from "react-router-dom";
import PostComments from "./PostComments";

const PostSingle = (props) => {
  const item = props.item;
  const myUserData = useSelector(state => state.myUserData);

  const routeUserProfilePage = "/user/" + item.user_id;


  const [user, setUser] = useState({
    "id": null,
    "username": "",
    "password": "",
    "avatar_src": "/static/img/avatar-placeholder.png"
  });

  useEffect(() => {
    const url = 'http://localhost:3033/users/' + item.user_id; // url za api da dobijem jednog korisnika. na primer http://localhost:3033/users/3
    axios.get(url)
      .then((response) => {
        // ovo ce biti pozvano kada se obavio axios.get()
        // console.log('postSingle dobio response za user', response);
        if (response && response.data && response.data.username) {
          // dobili smo podtake o korisniku
          // sad ih upisujemo u state ove komponente
          setUser(response.data);
        }
      })

  }, []);


  return (
    <div className="post-single">
      <header>

        <div className="avatar-group">
          <Link to={routeUserProfilePage}>
            <Avatar src={user.avatar_src} />
          </Link>
          <div className="next-to-avatar">
            <b> <Link to={routeUserProfilePage}>{user.username}</Link></b><br />
            <div className="date-time">{timestampToDateDIsplay(item.timestamp)}</div>
          </div>
        </div>
        <p>{item.text}</p>
      </header>
      <div className="post-body">
        {
          item.image_src && item.image_src !== "" && (
            <img src={item.image_src} />
          )
        }
      </div>
      <footer>


        <Bar
          start={
            <PostLikesWidget post_id={item.id} />
          }
        />

        <PostComments post_id={item.id} />



      </footer>

    </div>
  );
};

export default PostSingle;