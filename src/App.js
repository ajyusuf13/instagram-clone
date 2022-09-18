import './App.css';
import Post from "./Post"
import React,{ useEffect, useState } from "react";
import { db, auth } from "./firebase";
import Modal from '@mui/material/Modal';
import {Button, Input} from "@mui/material/";
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: "15px",
};


function App() {
 
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch(err => alert(err.message))
    setOpen(false);
    setEmail("");
    setPassword("");
  }

  const logIn = (event) => {
    event.preventDefault(); // prevents page from reloading when you submit a form
    auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message))
    setOpenLogIn(false);
    setEmail("");
    setPassword("");

  }


  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user is currently logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    });

    return () => unsub();
    // whenever username, user is updated, refire this code but detach listener first so no duplicates
  }, [user, username])


  // UseEffect runs a piece of code based on a speicifc condition
  // runs when page renders
  useEffect(() => {
    const unsub = db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // every time a new post is added, this will run (taking a snapshot of the db)
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })

    return () => unsub();

  }, []);
 
  return (
    <div className='app'>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={style}>
          <form className='app__signUp'>
            <center>
              <img 
                className='app__headerImage'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png'
                alt='ig name'> 
              </img>
            </center>
            <Input
              placeholder='username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}>
            </Input>
            <Input
              placeholder='email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}>
            </Input>
            <Input
              placeholder='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openLogin}
        onClose={() => setOpenLogIn(false)}
      >
        <div style={style}>
          <form className='app__signUp'>
            <center>
              <img 
                className='app__headerImage'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png'
                alt='ig name'> 
              </img>
            </center>
            <Input
              placeholder='email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}>
            </Input>
            <Input
              placeholder='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={logIn}>Log In</Button>
          </form>
        </div>
      </Modal>
      
      {/* type=submit sends form data to a form handler*/}
      <div className='app__header'>
          {/*Header */}
          <img 
            className='app__headerImage'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png'
            alt='ig name'>
              
          </img>

          {user ? (
            <Button onClick={() => auth.signOut()}>LOG OUT</Button>
          ) : (
            <div className='app__logInSignUp'>
              <Button onClick={() => setOpenLogIn(true)}>LOG IN</Button>
              <Button onClick={() => setOpen(true)}>SIGN UP</Button>
            </div>
            
          )}
      </div>
      <div className='app__posts'>
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} username={post.username} caption={post.caption} imageURL={post.imageURL} timestamp={post.timestamp}/>
          ))
        }
      </div>
      {user ? (<ImageUpload/>) : (
        <center>
          <h3>Please login if you'd like to post :)</h3>
        </center>
      )}

    </div>


  );
}

export default App;
