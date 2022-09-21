import { Link } from "react-router-dom";
import { useUser } from "../hooks/use-user";
import Avatar from "./Avatar";

const CommentSingle = (props) => {
  const comment = props.comment;
  const user_id = comment.user_id;

  const {
    user,
    setUser
  } = useUser(user_id);

  const routeUserProfilePage = "/user/" + user_id;

  return (
    <div className="comment">
      <Link to={routeUserProfilePage}>
        <Avatar src={user.avatar_src} />
      </Link>
      <b>{user.username}</b>
      <div>{comment.text}</div>
    </div>
  )
};

export default CommentSingle;