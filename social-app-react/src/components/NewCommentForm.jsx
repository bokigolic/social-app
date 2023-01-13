import { useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import Avatar from "./Avatar";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";

const NewCommentForm = (props) => {
  const myUserData = useSelector(state => state.myUserData);
  const refreshComments = props.refreshComments;
  const post_id = props.post_id;


  let myAvatarSrc = "/static/img/avatar-placeholder.png";
  if (myUserData && myUserData.username) {
    // if logged in
    myAvatarSrc = myUserData.avatar_src;
  }

  const preset = {
    text: ""
  }
  const [formState, setFormState] = useState(preset);

  const handleChange = (e) => {
    // console.log(e);
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormState({
      ...formState,
      [name]: value
    })
  };

  const handlePublish = () => {
    console.log("publish comment", formState);
    if (myUserData && myUserData.username) {
      // if logged in
      const sumbitData = {
        ...formState,
        user_id: myUserData.id,
        post_id: post_id
      }
      ajax.createComment(sumbitData)
        .then((response) => {
          setFormState(preset); // nakon slanja poruke cistimo polje
          refreshComments(); // nakon novog posta refreshujemo listu komentara
        })

    } else {
      // not logged in
      window.alert('You must be logged in to comment!');
    }
  }

  return (
    <div className="new-comment-form">
      <form>
        <div className="avatar-textarea-group">
          <Avatar src={myAvatarSrc} />
          <textarea
            name="text"
            value={formState.text}
            onChange={handleChange}
            placeholder={"Write a comment "}
          />
          <div className="btn-group">
            <BtnCircle
              tip="Publish comment"
              fa="fa fa-paper-plane"
              handleClick={handlePublish}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default NewCommentForm;