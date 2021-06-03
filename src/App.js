import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    // console.log('Sign in clicked.');
    firebase.auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user
        const signInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signInUser)
        // console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.meg);
      })
  }

  const handleSignOut = () => {
    // console.log('Signout clicked');
    firebase.auth()
      .signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        setUser(signOutUser)
      })
      .catch(err => {

      })
  }

  const handleBlur = (e) => {
    // console.log(e.target.name, e.target.value);
    // debugger;
    let isFormValid = true;
    if (e.target.name === 'email') {
      const isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(userCredential => {
          // Signed in 
          // var user = userCredential.user;
          const newUserInfo = { ...user }
          newUserInfo.error = ''
          newUserInfo.success = true
          setUser(newUserInfo)
          // console.log(userCredential);
        })
        .catch(error => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // console.log(errorCode, errorMessage);
        });
    }
    if (!newUser && user.name && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(userCredential => {
          // Signed in
          // var user = userCredential.user;
          const newUserInfo = { ...user }
          newUserInfo.error = ''
          newUserInfo.success = true
          setUser(newUserInfo)
        })
        .catch(error => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
    }

    e.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ?
          <button onClick={handleSignOut}>Sign out</button>
          :
          <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn &&
        <div>
          <h4>Welcome, {user.name}</h4>
          <p>{user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }


      <h1>Our Authentication form</h1>
      <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
      <label htmlFor="newUser">New user Sign up</label>

      {/* <p>Name: {user.name}</p>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p> */}

      <form action={handleSubmit}>

        {newUser &&
          <input
            type="text"
            name="name"
            placeholder="Write your name ... "
            onBlur={handleBlur}
            required />}<br />

        <input
          type="text"
          name="email"
          placeholder="Write your email ... "
          onBlur={handleBlur}
          required /><br />

        <input
          type="password"
          name="password"
          placeholder="Write your password ... "
          onBlur={handleBlur}
          required /><br />

        <input type="submit" value="submit" onClick={handleSubmit} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success &&
        <p style={{ color: 'green' }}>
          User {newUser ? 'Created' : 'Logged in'} successfully.
        </p>}
    </div>
  );
}

export default App;
