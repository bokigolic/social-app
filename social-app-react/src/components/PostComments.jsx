import { useEffect } from "react";
import { useState } from "react";
import { ajax } from "../utils/ajax-adapter";
import CommentSingle from "./CommentSingle";
import NewCommentForm from "./NewCommentForm";

const PostComments = (props) => {

  const [comments, setComments] = useState([]);

  const refreshComments = () => {
    ajax.getCommentsByPostId(props.post_id)
      .then((response) => {
        // kad se fetchovanej zavrsi upisujemo response u state
        setComments(response);
      })

  };

  useEffect(() => {
    refreshComments();
  }, []);


  return (
    <div className="comments">
      <div className="number-of-comments">{comments.length} comments </div>
      <NewCommentForm post_id={props.post_id} refreshComments={refreshComments} />
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