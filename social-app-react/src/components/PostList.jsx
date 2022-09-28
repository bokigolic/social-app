import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajax } from "../utils/ajax-adapter";
import { timestampToDateDIsplay } from "../utils/date-utils";
import NewPostForm from "./NewPostForm";
import PostSingle from "./PostSingle";


const PostList = (props) => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);
  const myUserData = useSelector(state => state.myUserData);

  const refresh = () => {
    if (props.user_id) {
      // user's posts
      {
        // all posts
        ajax.getPostsByUserId(props.user_id)
          .then((response) => {
            dispatch({
              type: 'POSTS_FETCHED',
              payload: response
            });
          })

      }

    } else {
      // all posts
      ajax.getAllPosts()
        .then((response) => {
          dispatch({
            type: 'POSTS_FETCHED',
            payload: response
          });
        })

    }

  };

  useEffect(() => {
    refresh();
  }, []);


  return (
    <div>

      {
        props.user_id ? (<h1>Users's posts</h1>) : (<h1>Posts</h1>)
      }



      {
        myUserData !== null && (
          <NewPostForm refresh={refresh} />
        )
      }


      <div className="post-list">
        {
          posts.map((post) => {
            return (
              <PostSingle key={post.id} post={post} />
            )
          })
        }
      </div>

    </div>
  );
};
export default PostList;