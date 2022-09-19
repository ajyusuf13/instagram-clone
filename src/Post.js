import React, { useEffect, useState } from 'react'
import './Post.css';
import Avatar from '@mui/material/Avatar';
import { auth, db } from './firebase';
import { Input, Button } from '@mui/material';
import {deleteDoc, serverTimestamp} from "firebase/firestore"
import Moment from 'react-moment';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Post({postId, username, caption, imageURL, timestamp}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [color, setColor] = useState("lightgray");
    const [numLikes, setNumLikes] = useState(0);

    const like = () => {
        if (color === "lightgray")  {
            // liking photo
            setColor("red");
            db.collection("posts").doc(postId).collection("likes").add({username : auth.currentUser.displayName});
        }
        else {
            // unliking photo
            setColor("lightgray");
            // db.collection("posts").doc(postId).collection("likes").re
            deleteDoc(db.collection("posts").doc(postId).collection("likes").where("username", "==", auth.currentUser.displayName).get()
                .then((querySnapshot) => {
                    querySnapshot.docs[0].ref.delete();
                })
                .catch(err => console.log(err))
            );
        }
    }

    

    useEffect(() => {
        const unsub = db.collection("posts").doc(postId).collection("likes")
            .onSnapshot((snapshot) => {
                setNumLikes(snapshot.docs.length);
            })

        const ifUserLiked = () => {
            if (auth.currentUser) {
                db.collection("posts").doc(postId).collection("likes").where("username", "==", auth.currentUser.displayName).get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        // user has not liked the post
                        setColor("lightgray");
                    }
                    else {
                        setColor("red");
                    }
                })
                .catch(err => console.log(err))
            }
        }
        ifUserLiked();

        return () => unsub();
    }, [postId]);


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
            <div className='post__headerAvatarAndName'>
                <Avatar
                    className='post__headerAvatar'
                    src='/images/avatar/1.jpg'
                    alt={username}>
                </Avatar>
                <h4>{username}</h4>
            </div>
            <Moment fromNow className='post__timePosted'>{timestamp?.toDate()}</Moment>
        </div>
        <img className='post__image'    
            src={imageURL}
            alt=''>
        </img>
        <div className='post__details'>
            <div className='post__likes'>
                {auth.currentUser ? <FavoriteIcon style={{color: color, cursor: "pointer"}} onClick={like}/> : <FavoriteIcon style={{color: "lightgray"}}/>}
                {numLikes !== 0 ? (<h5>{numLikes} likes</h5>) : null}
            </div>
            <h4 className='post__details_h4'>
                <strong>{username}</strong> {caption}
            </h4>
        </div>
        
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
            <Input className="comment-input"  type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="something to say perhaps...?"></Input>
            <Button className='comment-button' onClick={addComment} disabled={!comment || !auth.currentUser}>add comment</Button>
        </div>
        


    </div>
  )
}

export default Post