import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import NewPostForm from "./NewPostForm";


const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);

  const refresh = ()=> {
    ajax.getAllPosts()
      .then((response) => {
        dispatch({
          type: 'POSTS_FETCHED',
          payload: response
        });
      })

  };


  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1>Posts</h1>

      <NewPostForm refresh={refresh} />

      <div className="post-list">
        {
          posts.map((item) => {
            return (
              <div>
                <b>{item.username}</b><br />
                <span>{item.timestamp}</span>
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