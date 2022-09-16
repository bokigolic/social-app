import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import BtnCircle from "./BtnCircle";


const PostLikesWidget = (props) => {
  const post_id = props.post_id;
  const myUserData = useSelector(state => state.myUserData);

  const [likeDisabled, setLikeDisabled] = useState(true);
  const [dislikeDisabled, setDislikeDisabled] = useState(true);


  const refresh = ()=>{
      const user_id = myUserData.id;
      ajax.checkUserLikePost(user_id, post_id)
        .then((response) => {
          console.log(response)
          if (response && Array.isArray(response.data)) {
            // reposne u ispravnom formatu
            if (response.data.length > 0) {
              // znaci da smo lajkovali ili dilajkovali
              // znaci sam ojedna like ili dislajk treba iskljuciti
              const likeItem = response.data[0];
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

  const handleLike = () => {
    if (myUserData) {
      // if logged in
      const user_id = myUserData.id;
      console.log("Like", post_id, user_id)
      const submitData = {
        post_id: post_id,
        user_id: user_id,
        like: true
      };
      ajax.likePost(submitData)
        .then((response) => {
          console.log("Like uspesno dodat na backend");
          refresh();
        })

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
        handleClick={handleLike}
      />
      <div><b>99</b></div>
      <BtnCircle
        disabled={dislikeDisabled}
        fa="fa fa-thumbs-down"
        tip="Dislike"
      />
    </div>
  )
};
export default PostLikesWidget;