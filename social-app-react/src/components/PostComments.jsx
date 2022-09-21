import { useEffect } from "react";
import { useState } from "react";
import { ajax } from "../utils/ajax-adapter";
import CommentSingle from "./CommentSingle";

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
          return (
            <CommentSingle key={comment.id} comment={comment} />
          )
        })
      }

    </div>
  )
};

export default PostComments;