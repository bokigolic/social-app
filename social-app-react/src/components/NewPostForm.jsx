import { useState } from "react";
import { useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import Avatar from "./Avatar";
import Bar from "./Bar";
import BtnCircle from "./BtnCircle";

const NewPostForm = (props) => {
  const myUserData = useSelector(state => state.myUserData);
  const refresh = props.refresh;

  const preset = {
    text: ""
  }
  const [formState, setFormState] = useState(preset);
  const [imageBlob, setImageBlob] = useState(""); // blob je slika bez naziva cisti podaci od slike
  const [showImageForm, setShowImageForm] = useState(false);

  const toggleShowImageForm = () => {
    if (showImageForm) {
      setShowImageForm(false)
    } else {
      setShowImageForm(true)
    }
  }



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

  const onSelectFile = (e) => {
    // ovo je poseabn hanlder samo za onchange na input type="file" polju
    const target = e.target;
    // posto input polje za fajl moze da primi vise fajlova...
    console.log(target.files.length);
    if (target.files && target.files.length > 0) {
      // znaci da je odabran najmanje jedan fajl
      const selectedFile = target.files[0];
      const reader = new FileReader(); // napravi novu instancu klase FileReader
      if (selectedFile) {
        const handleload = (e) => {
          console.log('uspesno se zavrsilo ucitavanje fajla');
          const blob = reader.result; // dobil ismo blob ucitanog fajla slike
          // upisujemo gotov blob u nas state
          setImageBlob(blob);
        };
        reader.addEventListener("load", handleload);
        reader.readAsDataURL(selectedFile); // zapocinje citanje fajla u romatu slike koji moze da se koristi u src od slike
      }
    }
  };

  const handlePublish = () => {
    console.log("publish", formState);
    if (myUserData && myUserData.username) {
      // if logged in
      const sumbitData = {
        ...formState,
        user_id: myUserData.id,
        image_src: imageBlob
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
    <div className="new-post-form">
      <form>
        
        <div className="avatar-textarea-group">
          <Avatar src={myUserData.avatar_src} />
          <textarea
            name="text"
            value={formState.text}
            onChange={handleChange}
            placeholder={"What's on your mind, " + myUserData.username + "?"}
          />
        </div>
        <Bar
          end={
            <div className="btn-group">
              <BtnCircle
                tip="Add Picture" fa="fa fa-camera"
                handleClick={toggleShowImageForm}
              />
              <BtnCircle
                tip="Publish"
                fa="fa fa-paper-plane"
                handleClick={handlePublish}
              />
            </div>
          }
        />
      </form>


      {
        showImageForm && (
          <div className="image-upload-form">
            <form>
              <h5>Choose image from your device</h5>
              <div className="image-preview-gallery">
                <div className="image-preview">
                  {
                    imageBlob && (
                      <img src={imageBlob} />
                    )
                  }
                </div>
                <label className="file-input-custom-design">
                  <span className="icon"><i className="fa fa-plus" aria-hidden="true"></i></span>
                  <span>Add image</span>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    name="file"
                    onChange={onSelectFile}
                  />
                </label>
              </div>
            </form>
          </div>
        )
      }




    </div>
  );
};
export default NewPostForm;