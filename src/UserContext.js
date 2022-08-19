import {createContext, useState} from 'react';

export const UserContext = createContext()

function UserContextProvider(props){

    const [uid, seUid] = useState(()=>{localStorage.getItem('uid')})
    const [displayName, setDisplayName] = useState(()=>{localStorage.getItem('displayName')})
    const [email, setEmail] = useState(()=>{localStorage.getItem('email')})
    const [photoURL, setPhotoURL] = useState(()=>{localStorage.getItem('photoUrl')})

    function addUid(currentUid){
        localStorage.setItem("uid", uid)
        seUid(currentUid)
    }
    function addDisplayName(currentDisplayName){
        localStorage.setItem("displayName", displayName)
        setDisplayName(currentDisplayName)
    }

    function addEmail(currentEmail){
        localStorage.setItem("email", email)
        setEmail(currentEmail)
    }

    function addPhotoURL(currentPhotoUrl){
        localStorage.setItem("photoUrl", photoURL)
        setPhotoURL(currentPhotoUrl)
        
    }

    const values = {uid, addUid, displayName, addDisplayName, email, addEmail, photoURL, addPhotoURL}

    return (
        <UserContext.Provider value={values}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;

