import { useEffect, useState } from "react";
import { ajax } from "../utils/ajax-adapter";
import BtnCircle from "./BtnCircle";

const PostReactionWidget = (props) => {
  const post_id = props.post_id;
  const [reactions, setReactions] = useState([]);

  const reactionCount = reactions.length;

  const refresh = () => {
    ajax.getReactionsByPostId(post_id)
      .then((response) => {
        setReactions(response);
      })

  };

  useEffect(() => {
    refresh();
  }, []);


  const handleReaction = (reaction) => {
    console.log("Reaction", reaction, post_id);
    // TODO
    
  };

  return (
    <div className="btn-group">
      <BtnCircle
        disabled={false}
        fa="fa fa-smile-o" tip="Reaction"
        handleClick={(e) => { handleReaction(':)') }}
      />
      <div>
        {reactionCount}
      </div>
    </div>
  )
};

export default PostReactionWidget;