import { useEffect } from "react";
import { useState } from "react";
import { timestampToDateDIsplay } from "../utils/date-utils";
import Avatar from "./Avatar";
import axios from "axios";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";
import { ajax } from "../utils/ajax-adapter";
import { useSelector } from "react-redux";

const PostSingle = (props) => {
  const item = props.item;
  const myUserData = useSelector(state => state.myUserData);


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

  const handleLike = () => {

    if (myUserData) {
      // if logged in
      console.log("Like", item.id, myUserData.id)
      const submitData = {
        post_id: item.id,
        user_id: myUserData.id,
        like: true
      };
      ajax.likePost(submitData)
        .then((response) => {
          console.log("Like uspesno dodat na backend")
        })

    } else {
      // not logged in
      window.alert('You must be loged in to be able to like');
    }
  };

  return (
    <div className="post-single">
      <header>

        <div className="avatar-group">
          <Avatar src={user.avatar_src} />
          <div className="next-to-avatar">
            <b>{user.username}</b><br />
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
            <div className="btn-group">
              <BtnCircle
                disabled
                fa="fa fa-thumbs-up" tip="Like"
                handleClick={handleLike}
              />
              <div><b>99</b></div>
              <BtnCircle fa="fa fa-thumbs-down" tip="Dislike" />
            </div>
          }
        />



      </footer>

    </div>
  );
};

export default PostSingle;