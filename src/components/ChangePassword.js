import React, {useRef, useState} from 'react';
import { Card, Button, Form, Alert} from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import { Link  } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

function ChangePassword() {

  const emailRef =useRef();
  const passwordRef =useRef();
  const passwordConfirmRef =useRef();
  const { currentUser, updtPassword } = useAuth();
  const [error, setError ] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
    }

    const promises = [];
    setError("");
    setLoading(true);
    // if (emailRef.current.value !== currentUser.email) {
    //     promises.push(updtEmail(emailRef.current.value));
    // }
    if (passwordRef.current.value) {
        promises.push(updtPassword(passwordRef.current.value));
    }
    Promise.all(promises).then(() => {
        navigate("/");
    }).catch(() => {
        setError("Failed to update password");
    }).finally(() => {
        setLoading(false);
    })
  }

  return (
    <>
      <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Change Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} disabled={true} defaultValue={currentUser.email} required/>
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} placeholder='Leave blank to keep the same'/>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} placeholder='Leave blank to keep the same'/>
                </Form.Group>
                <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                    Update
                </Button>
            </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  )
}

export default ChangePassword
