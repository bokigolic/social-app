import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import BtnCircle from "./BtnCircle";


const PostLikesWidget = (props) => {
  const post_id = props.post_id;
  const myUserData = useSelector(state => state.myUserData);

  const [allreadyLiked, setAllreadyLiked] = useState(false);
  const [allreadyLikedId, setAllreadyLikedId] = useState(null);
  const [likeDisabled, setLikeDisabled] = useState(true);
  const [dislikeDisabled, setDislikeDisabled] = useState(true);


  const refresh = () => {
    const user_id = myUserData.id;
    ajax.checkUserLikePost(user_id, post_id)
      .then((response) => {
        console.log(response)
        if (response && Array.isArray(response.data)) {
          // reposne u ispravnom formatu
          if (response.data.length > 0) {
            // znaci da smo vec lajkovali ili dilajkovali
            // znaci samo jedna like ili dislajk treba iskljuciti
            const likeItem = response.data[0];
            setAllreadyLiked(true);
            setAllreadyLikedId(likeItem.id);
            if (likeItem.like === true) {
              // LIKE
              setLikeDisabled(true);
              setDislikeDisabled(false);
            } else {
              // DISLIKE
              setLikeDisabled(false);
              setDislikeDisabled(true);
            }
          } else {
            // nismo jos ni lajkovali ni dislajkovali
            setAllreadyLiked(false);
            setAllreadyLikedId(null);
            // znaci obe treba da budu ukljucene
            setLikeDisabled(false);
            setDislikeDisabled(false);
          }
        }
      })

  };

  useEffect(() => {
    if (myUserData) {
      // if logged in
      refresh();
    }
  }, [myUserData]);

  const handleLike = (isLike) => {
    if (myUserData) {
      // if logged in
      const user_id = myUserData.id;
      console.log("Like", post_id, user_id)
      const submitData = {
        post_id: post_id,
        user_id: user_id,
        // like: true // like true znaci da je lajk a false dislajk
        like: isLike
      };
      if (allreadyLiked === true) {
        // UPDATE LIKE
        ajax.updateLikePost(submitData, allreadyLikedId)
          .then((response) => {
            console.log("Like uspesno dodat na backend");
            refresh();
          })

      } else {
        // CREATE LIKE
        ajax.likePost(submitData)
          .then((response) => {
            console.log("Like uspesno dodat na backend");
            refresh();
          })
      }

    } else {
      // not logged in
      window.alert('You must be loged in to be able to like');
    }
  };


  return (
    <div className="btn-group">
      <BtnCircle
        disabled={likeDisabled}
        fa="fa fa-thumbs-up" tip="Like"
        handleClick={(e) => { handleLike(true) }}
      />
      <div><b>99</b></div>
      <BtnCircle
        disabled={dislikeDisabled}
        fa="fa fa-thumbs-down"
        tip="Dislike"
        handleClick={(e) => { handleLike(false) }}
      />
    </div>
  )
};
export default PostLikesWidget;