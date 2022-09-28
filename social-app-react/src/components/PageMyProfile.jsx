import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Avatar from "./Avatar";
import PostList from "./PostList";


const PageMyProfile = () => {
  const myUserData = useSelector(state => state.myUserData);
  const user = myUserData;
  let user_id = null;
  if (myUserData) {
    user_id = myUserData.id;
  }

  return (
    <>
      {
        myUserData ? (
          <>
            <div className="page-content">
              <div className="cover">
                <button className="change-cover-btn">Change cover</button>
              </div>

              <div className="avatar-big-group">
                <Avatar src={user.avatar_src} />
                <div className="next-to-avatar">
                  <b>{user.username}</b><br />
                </div>
              </div>

            </div>
            <h1>My profile</h1>

            <PostList user_id={user_id} />
          </>
        ) : (
          <>
            <div>You are not logged in!</div>
            <Navigate to="/" replace />
          </>
        )
      }

    </>
  )
};

export default PageMyProfile;