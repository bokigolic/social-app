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
import { useUser } from "../hooks/use-user";
import PostReactionWidget from "./PostReactionWidget";

const PostSingle = (props) => {
  const post = props.post;
  const myUserData = useSelector(state => state.myUserData);

  const user_id = post.user_id;

  const {
    user,
    setUser
  } = useUser(user_id);

  const routeUserProfilePage = "/user/" + post.user_id;


  return (
    <div className="post-single" data-post-id={post.id}>
      <header>

        <div className="avatar-group">
          <Link to={routeUserProfilePage}>
            <Avatar src={user.avatar_src} />
          </Link>
          <div className="next-to-avatar">
            <b> <Link to={routeUserProfilePage}>{user.username}</Link></b><br />
            <div className="date-time">{timestampToDateDIsplay(post.timestamp)}</div>
          </div>
        </div>
        <p>{post.text}</p>
      </header>
      <div className="post-body">
        {
          post.image_src && post.image_src !== "" && (
            <img src={post.image_src} />
          )
        }
      </div>
      <footer>
        <Bar
          start={
            <>
              <PostReactionWidget post_id={post.id} />
              <PostLikesWidget post_id={post.id} />
            </>
          }
        />
        <PostComments post_id={post.id} />
      </footer>
    </div>
  );
};

export default PostSingle;