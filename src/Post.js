import React, { useEffect, useState } from 'react'
import './Post.css';
import Avatar from '@mui/material/Avatar';
import { auth, db } from './firebase';
import { Input, Button } from '@mui/material';
import {serverTimestamp} from "firebase/firestore"

function Post({postId, username, caption, imageURL}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");


    useEffect(() => {
        const unsub = db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
            // every time a new comment is added, this will run (taking a snapshot of the db)
            setComments(snapshot.docs.map(doc => doc.data()));
        })

        return () => unsub();
    }, [postId])

    const addComment = () => {
        if (comment && auth.currentUser) {
            db.collection("posts").doc(postId).collection("comments").add({
                text: comment,
                username: auth.currentUser.displayName,
                timestamp: serverTimestamp()
            })
            setComment("");
        }
    }


  return (
    <div className='post'>
        <div className='post__header'>
            <Avatar
                className='post__headerAvatar'
                src='/images/avatar/1.jpg'
                alt={username}>
            </Avatar>
            <h4>{username}</h4>
        </div>
        <img className='post__image'
            src={imageURL}
            alt=''>
        </img>
        <h4 className='post__details'>
            <strong>{username}</strong> {caption}
        </h4>
        {comments.length ? (
            <div className="post__comment">
                <h5>Comments</h5>
                {comments.map((comment, index) => (
                    <h5 key={index} className='comment'>
                    <strong>{comment.username}</strong> {comment.text}
                    </h5>
                ))}
            </div>
        ) : null }
        <div className='post__addComment'>
            <Input style={{width: "70%"}} type="text" onChange={(e) => setComment(e.target.value)} placeholder="something to say perhaps...?"></Input>
            <Button style={{width: "30%"}} onClick={addComment} disabled={!comment}>add comment</Button>
        </div>
        


    </div>
  )
}

export default Post