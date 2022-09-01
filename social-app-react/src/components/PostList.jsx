import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";


const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);


  useEffect(() => {
    ajax.getAllPosts()
      .then((response) => {
        dispatch({
          type: 'POSTS_FETCHED',
          payload: response
        });
      })
  }, []);

  return (
    <div>
      <h1>Posts</h1>

      <div>
        {
          posts.map((item) => {
            return (
              <div>
                <b>{item.username}</b><br />
                <span>{item.timestamt}</span>
                <p>{item.text}</p>
              </div>
            )
          })
        }
      </div>

    </div>
  );
};
export default PostList;