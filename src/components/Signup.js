import React, {useRef, useState} from 'react';
import { Card, Button, Form, Alert} from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import { Link  } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

function Signup() {

  const emailRef =useRef();
  const passwordRef =useRef();
  const passwordConfirmRef =useRef();
  const { signup, updateGameStat } = useAuth();
  const [error, setError ] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
    }
    try{
        setError("");
        setLoading(true);
        const credentials = await signup(emailRef.current.value, passwordRef.current.value);  
        console.log("user created, going to update game stat")
        await updateGameStat(0, 0, 0, 0, 0, 0, 0, 0,0, false, credentials.user.uid);
        navigate("/");  
    } catch(e) {
        console.log('error', e);
        setError("Failed to create account");
    }
    setLoading(false);
    
  }

  return (
    <>
      <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} required/>
                </Form.Group>
                <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                    Sign Up
                </Button>
            </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}

export default Signup
