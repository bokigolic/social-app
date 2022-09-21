import axios from "axios";
import { useEffect, useState } from "react";


// ovo je react custom hook za podatke o useru za aplikaicju socijal-app-react

export const useUser = (user_id) => {
  const [user, setUser] = useState({
    "id": null,
    "username": "",
    "password": "",
    "avatar_src": "/static/img/avatar-placeholder.png"
  });

  useEffect(() => {
    const url = 'http://localhost:3033/users/' + user_id; // url za api da dobijem jednog korisnika. na primer http://localhost:3033/users/3
    axios.get(url)
      .then((response) => {
        // ovo ce biti pozvano kada se obavio axios.get()
        // console.log('postSingle dobio response za user', response);
        if (response && response.data && response.data.username) {
          // dobili smo podtake o korisniku
          // sad ih upisujemo u state ove komponente
          setUser(response.data);
        }
      })

  }, [user_id]);

  // returnujemo ono sto treba u komponentama koje ce ovaj hook da koriste
  return {
    user,
    setUser
  };
};