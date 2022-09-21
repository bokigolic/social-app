import { useEffect } from "react";
import { useState } from "react";
import { ajax } from "../utils/ajax-adapter";

const PostComments = (props) => {

  const [comments, setComments] = useState([]);

  useEffect(() => {
    ajax.getCommentsByPostId(props.post_id)
      .then((response) => {
        // kad se fetchovanej zavrsi upisujemo response u state
        setComments(response);
      })
  }, []);


  return (
    <div className="comments">
      komnetari za {props.post_id}

      {
        comments.map((comment) => {
          return (<div className="comment">
            {comment.user_id}
            {comment.text}
          </div>)
        })
      }

    </div>
  )
};

export default PostComments;