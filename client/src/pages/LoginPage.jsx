import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)
    async function login(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: { 'Content-Type':'application/json' },
            credentials: 'include',
        } ); 
        if (response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
           
        } else{
            alert('wronge credentials');
        }
    }

    if (redirect){
        return <Navigate to={'/'} />
    }
    return(
       <Form onSubmit={login}>
           <h2 className="fw-bold mb-2 text-center text-uppercase ">
                    Login Form
                    </h2>
       <Form.Group className="mb-3">
         <Form.Label>Username</Form.Label>
         <Form.Control type="text" placeholder="Username" 
         value={username} 
         onChange={ev => setUsername(ev.target.value)}
         />
       </Form.Group>
 
       <Form.Group className="mb-3">
         <Form.Label>Password</Form.Label>
         <Form.Control type="password" placeholder="Password" 
         value={password}
         onChange={ev => setPassword(ev.target.value)}
         />
       </Form.Group>
       <Button variant="primary" type="submit">
         Login
       </Button>
     </Form>
    );
}