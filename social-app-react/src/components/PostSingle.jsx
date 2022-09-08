import { useEffect } from "react";
import { useState } from "react";
import { timestampToDateDIsplay } from "../utils/date-utils";
import Avatar from "./Avatar";
import axios from "axios";

const PostSingle = (props) => {
  const item = props.item;

  const [user, setUser] = useState({
    "username": "",
    "password": "",
    "avatar_src": "/static/img/avatar-placeholder.png"
  });

  useEffect(() => {
    const url = 'http://localhost:3033/users/' + item.user_id; // url za api da dobijem jednog korisnika. na primer http://localhost:3033/users/3
    axios.get(url)
      .then((response) => {
        // ovo ce biti pozvano kada se obavio axios.get()
        console.log('postSingle dobio response za user', response);
        if (response && response.data && response.data.username) {
          // dobili smo podtake o korisniku
          // sad ih upisujemo u state ove komponente
          setUser(response.data);
        }

      })

  }, []);

  return (
    <div className="post-single">
      <div className="avatar-group">
        <Avatar src={user.avatar_src} />
        <div className="next-to-avatar">
          <b>{user.username}</b><br />
          <div className="date-time">{timestampToDateDIsplay(item.timestamp)}</div>
        </div>
      </div>
      <p>{item.text}</p>
      {
        item.image_src && item.image_src !== "" && (
          <div className="image-preview">
            <img src={item.image_src} />
          </div>
        )
      }
      
    </div>
  );
};

export default PostSingle;