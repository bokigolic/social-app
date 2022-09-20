import { useParams } from "react-router-dom";

const PageProfile = () => {
  const { id } = useParams(); // uzimamo id korisnika iz rute

  return (
    <>
      <h1>User profile (id: {id})</h1>
    </>

  )
};

export default PageProfile;