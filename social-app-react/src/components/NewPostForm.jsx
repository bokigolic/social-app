import { useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";

const NewPostForm = (props) => {
  const myUserData = useSelector(state => state.myUserData);
  const refresh = props.refresh;

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
    console.log("publish", formState);
    if (myUserData && myUserData.username) {
      // if logged in
      const sumbitData = {
        ...formState,
        username: myUserData.username
      }
      ajax.createPost(sumbitData)
        .then((response) => {
          setFormState(preset); // nakon slanja poruke cistimo polje
          refresh(); // nakon novog posta refreshujemo listu postova
        })

    } else {
      // not logged in
      window.alert('You must be logged in to publish!');
    }
  }

  return (
    <div>
      <form>
        <h4>Write new post</h4>
        <div>
          <textarea
            name="text"
            value={formState.text}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handlePublish}>Publish</button>
      </form>

    </div>
  );
};
export default NewPostForm;