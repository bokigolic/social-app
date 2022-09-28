import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import BtnCircle from "./BtnCircle";

const PostReactionWidget = (props) => {
  const post_id = props.post_id;
  const myUserData = useSelector(state => state.myUserData);

  let reactionDisabled = true;
  if (myUserData) {
    reactionDisabled = false;
  }

  const [alreadyReacted, setAlreadyReacted] = useState(false);
  const [alreadyReactedId, setAlreadyReactedId] = useState(null);

  const [reactions, setReactions] = useState([]);

  const reactionCount = reactions.length;

  const refresh = () => {
    ajax.getReactionsByPostId(post_id)
      .then((response) => {
        setReactions(response);
      })

  };

  const refresh2 = () => {
    const user_id = myUserData.id;
    ajax.checkUserReactionToPost(user_id, post_id)
      .then((response) => {
        console.log('++++++ response.length', response.length);
        if (response.length > 0) {
          // ALREADY REACTED
          const reactionItem = response[0];
          console.log(reactionItem, reactionItem.id);
          setAlreadyReacted(true);
          setAlreadyReactedId(reactionItem.id);
        } else {
          // NOT REACTED
          setAlreadyReacted(false);
          setAlreadyReactedId(null);
        }
      })
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (myUserData) {
      // if logged in
      refresh2();
    }
  }, [myUserData]);


  const handleReaction = (reaction) => {
    // TODO
    if (myUserData) {
      const user_id = myUserData.id;
      console.log("Reaction", reaction, post_id, user_id);
      const submitData = {
        post_id: post_id,
        user_id: user_id,
        reaction: reaction,
      };
      if (alreadyReacted) {
        // UPDATE REACTION
        ajax.updateReactionToPost(submitData, alreadyReactedId)
          .then((response) => {
            console.log('Reaction successfully updated');
            refresh();
            refresh2();
          })
      } else {
        // CREATE REACTION
        ajax.createReactionToPost(submitData)
          .then((response) => {
            console.log('Reaction uspesno kreiran');
            refresh();
            refresh2();
          })
      }
    } else {
      window.alert('You must be loged in to be able to react');
    }
  };

  /*
  Facebook reactions: Like, Love, Care, Haha, Wow, Sad, Angry
  */

  return (
    <div className="btn-group">
      <BtnCircle
        disabled={reactionDisabled}
        fa="fa fa-smile-o" tip="Reaction"
        handleClick={(e) => { handleReaction('HAHA') }}
      />
      <BtnCircle
        disabled={reactionDisabled}
        fa="fa fa-heart-o" tip="Reaction"
        handleClick={(e) => { handleReaction('LOVE') }}
      />
      <div>
        {reactionCount}
      </div>
    </div>
  )
};

export default PostReactionWidget;