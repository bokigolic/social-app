import { useUser } from "../hooks/use-user";
import Avatar from "./Avatar";

const CommentSingle = (props) => {
  const comment = props.comment;
  const user_id = comment.user_id;

  const {
    user,
    setUser
  } = useUser(user_id);

  return (
    <div className="comment">
      <Avatar src={user.avatar_src} />
      <b>{user.username}</b>
      <div>{comment.text}</div>
    </div>
  )
};

export default CommentSingle;