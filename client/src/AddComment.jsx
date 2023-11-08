import { useState, useEffect } from "react";
import { Editor } from "./editor";

export default function AddComment ({postInfo}){
    const [newComment, setNewComment] = useState("");
    useEffect(() => {
      fetch(`http://localhost:4000/comment/${id}`)
      .then(response => {
          response.json().then(postInfo => {
              setPostInfo(postInfo);
          });
      });
  }, []);
    function handleCommentChange(event) {
        setNewComment(event.target.value);
    }
    
    async function submitComment(event) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    content: newComment,
                    postId: postInfo._id,
                }),
            });
            if (response.ok) {
                // Clear the comment input and fetch updated comments
                setNewComment("");
                fetchComments();
            } else {
                console.error("Error submitting comment:", response);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }
       

    return(
        <form onSubmit={submitComment}>
            <textarea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Write a comment..."
                rows={3}
            ></textarea>
        
            <button type="submit">Add Comment</button>
        </form>
    );
}
