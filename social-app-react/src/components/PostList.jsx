import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import { timestampToDateDIsplay } from "../utils/date-utils";
import NewPostForm from "./NewPostForm";
import PostSingle from "./PostSingle";


const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);
  const myUserData = useSelector(state => state.myUserData);

  const refresh = () => {
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

      {
        myUserData !== null && (
          <NewPostForm refresh={refresh} />
        )
      }


      <div className="post-list">
        {
          posts.map((item) => {
            return (
              <PostSingle key={item.id} item={item} />
            )
          })
        }
      </div>

    </div>
  );
};
export default PostList;