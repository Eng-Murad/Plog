import { useState } from "react";
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import React from 'react';
import Post from "../post";
import 'bootstrap/dist/css/bootstrap.css';

export default function RegisterPage(){
    const [username, useUsername] = useState('');
    const [email, useEmail] = useState('');
    const [password, usePassword] = useState('');
    async function register(ev){
        ev.preventDefault();   
       const response =  await fetch('http://localhost:4000/register', { 
            method: 'POST',
            body: JSON.stringify({username, email, password }),
            headers: { 'Content-Type':'application/json' },
            
        });
        if (response.status === 200){
            alert('Registration succeflly');
        }else{
            alert('Registration failed');
        }
    }
    return(
        <div>
          <div className="mb-3 mt-md-4">
                    <h2 className="fw-bold mb-2 text-center text-uppercase ">
                    Register
                    </h2>
                    <div className="mb-3">
                      <Form onSubmit={register}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-center">Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter Name" 
                           value={username}
                           onChange={ev => useUsername(ev.target.value)}
                          />
                        </Form.Group>
  
                        <Form.Group className="mb-3">
                          <Form.Label className="text-center">
                            Email address
                          </Form.Label>
                          <Form.Control type="email" placeholder="Enter email"
                          value={email}
                          onChange={ev => useEmail(ev.target.value)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Password"
                          value={password}
                          onChange={ev => usePassword(ev.target.value)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                        ></Form.Group>
                        <div className="d-grid">
                          <Button variant="primary" type="submit">
                            Create Account
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
      </div>
    );
    
}