import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Reply from "./reply";

import axiosClient from "utils/AxiosClient";

const Replies = (props) => {
  const { replies } = props;
  const { userId, postId, commentId, replyId } = useParams();
  const [searchedReply, setSearchedReply] = useState(null);
  useEffect(() => {
    if (replies) {
      // check if the searched reply is renderd, if not then the reply is fetched and rendered
      if (!document.getElementById(replyId) && replyId) {
        axiosClient(
          `reply?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`
        ).then((response) => {
          if (response.status === 200) {
            setSearchedReply(response.data);
          }
        });
      }
    }
  }, [replies]);
  const focusedReply = useRef();
  // focus searched reply
  useEffect(() => {
    if (focusedReply.current) {
      window.scrollTo({ top: focusedReply.current.offsetTop - 200 });
    }
  }, [focusedReply.current]);

  return (
    <>
      {replies.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          {replies.map((reply) => (
            <div
              id={reply._id}
              className={reply._id === replyId ? "focused" : null}
              ref={reply._id === replyId ? focusedReply : null}
            >
              <Reply key={reply._id} reply={reply} />
            </div>
          ))}
          {/* this is the reply that searched by URL params if exist */}
          {searchedReply && (
            <div ref={focusedReply} className={"focused"}>
              <Reply reply={searchedReply} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Replies;
