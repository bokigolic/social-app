import { useEffect, useState } from "react";
import { ajax } from "../utils/ajax-adapter";


// ovo je react custom hook za podatke o useru za aplikaicju socijal-app-react

export const useUser = (user_id) => {
  const [user, setUser] = useState({
    "id": null,
    "username": "",
    "password": "",
    "avatar_src": "/static/img/avatar-placeholder.png"
  });

  useEffect(() => {
    ajax.getUserById(user_id)
      .then((user) => {
        // console.log('user single response user', user);
        if (user && user.username) {
          // dobili smo podtake o korisniku
          // sad ih upisujemo u state ove komponente
          setUser(user);
        }
      })

  }, [user_id]);

  // returnujemo ono sto treba u komponentama koje ce ovaj hook da koriste
  return {
    user,
    setUser
  };
};