import { useState } from "react";

const DotsMenu = (props) => {

  const [opened, setOpened] = useState(false);

  const toggleOpened = () => {
    if (opened) {
      setOpened(false)
    } else {
      setOpened(true)
    }
  }

  return (
    <div className="dots-menu">
      <div className="circle" onClick={toggleOpened} >
        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
        {
          opened && (
            <div className="popup-menu">
              {props.children}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default DotsMenu;