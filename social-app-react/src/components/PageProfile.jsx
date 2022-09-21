import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Avatar from "./Avatar";
import PostList from "./PostList";
import { useUser } from "../hooks/use-user";


const PageProfile = () => {
  const { id } = useParams(); // uzimamo id korisnika iz rute
  const user_id = id;

  const {
    user,
    setUser
  } = useUser(user_id);

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
      <p>User profile (id: {id})</p>

      <PostList user_id={id} />
    </>

  )
};

export default PageProfile;