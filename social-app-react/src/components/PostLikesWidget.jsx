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

  const [likes, setLikes] = useState([]);

  let likeCount = 0;
  if (likes.length > 0) {
    // prebrojavanje lajkova
    // TODO
    likes.forEach((likeItem) => {
      if (likeItem.like === true) {
        // Brojimo like
        likeCount++;
      } else {
        // Brojimo dislike
        likeCount--;
      }
    })
  };


  const refresh = () => {
    const user_id = myUserData.id;
    ajax.checkUserLikePost(user_id, post_id)
      .then((response) => {
        // console.log(response);
        if (response.length > 0) {
          // znaci da smo vec lajkovali ili dilajkovali
          // znaci samo jedna like ili dislajk treba iskljuciti
          const likeItem = response[0];
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
      })

  };

  const refreshLikes = () => {
    ajax.getLikesByPostId(post_id)
      .then((response) => {
        setLikes(response);
      })

  };

  useEffect(() => {
    // broj lajkova nam treba bez obzira da li smo ulogovani ili ne
    refreshLikes();
  }, []);

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
            refreshLikes();
          })

      } else {
        // CREATE LIKE
        ajax.createLikePost(submitData)
          .then((response) => {
            console.log("Like uspesno dodat na backend");
            refresh();
            refreshLikes();
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
      <div><b>{likeCount}</b></div>
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