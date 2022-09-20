import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Avatar from "./Avatar";
import { timestampToDateDIsplay } from "../utils/date-utils";


const PageProfile = () => {
  const { id } = useParams(); // uzimamo id korisnika iz rute

  const [user, setUser] = useState({
    "id": null,
    "username": "",
    "password": "",
    "avatar_src": "/static/img/avatar-placeholder.png"
  });

  useEffect(() => {
    const url = 'http://localhost:3033/users/' + id; // url za api da dobijem jednog korisnika. na primer http://localhost:3033/users/3
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
    <>
      <div className="page-content">
        <div className="cover">
        </div>

        <div className="avatar-big-group">
          <Avatar src={user.avatar_src} />
          <div className="next-to-avatar">
            <b>{user.username}</b><br />
          </div>
        </div>



      </div>
      <h1>User profile (id: {id})</h1>
    </>

  )
};

export default PageProfile;