import { Button, Input } from '@mui/material'
import React, { useState } from 'react'
import "./ImageUpload.css"
import "./Attachment";
import Attachment from './Attachment';
import { auth, db, storage } from "./firebase";
import {serverTimestamp} from "firebase/firestore"

function ImageUpload() {
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [imageChosen, setImageChosen] = useState("");
    const [image, setImage] = useState(null);


    const uploadPost = () => {
        const upload = storage.ref(`images/${image.name}`).put(image); // upload image selected to the reference location

        upload.on("state_changed",
            (snapshot) => {
                // progress function
                const progressBar = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progressBar);
            },
            (error) => {
                // error function
                console.log(error.message);
                alert(error.message);
            },
            () => {
                // upload is complete
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    // post image inside db
                    db.collection("posts").add({
                        timestamp: serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: auth.currentUser.displayName
                        })
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    setImageChosen("");
                })
                .catch(err => console.log(err))
            }
        )
    }


  return (
    <div className='upload'>
            <progress className="upload__progress" value={progress} max="100"></progress>
            <Input className="upload__caption" type='text' placeholder='anything to say...?' 
                    value={caption} onChange={(e) => setCaption(e.target.value)}></Input>
            <div className='upload__file'>
                <label htmlFor='upload'>
                    <Attachment/>
                </label>
                <Input style={{display: "none"}} id="upload" type="file" onChange={(e)=> {
                    setImageChosen(e.target.files[0].name);
                    setImage(e.target.files[0]);
                }}></Input>
                <p>{imageChosen}</p>
                <Button onClick={uploadPost}>POST</Button>
            </div>
            
    </div>
  )
}

export default ImageUpload