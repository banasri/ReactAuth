import React, { useState, useEffect} from 'react';
import { Card, Button, Form, Alert} from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import { Link  } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

function UpdateProfile() {
  
  const { currentUser, updateProfile } = useAuth();
  const [error, setError ] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Initialize form fields
    name: '',
    phone: '',
    school: '' 
  });
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const docRef = doc(db, "userProfile", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Update state with Firestore data
          setFormData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchFormData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  function handleSubmit(e) {
    e.preventDefault();
    //fetchUser();
    setError("");
    setLoading(true);

    updateProfile(formData.name, formData.phone, formData.school)
    .then(() => {
      navigate("/");
    }).catch(() => {
      setError("Failed to update account");
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <>
      <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email"  disabled={true} defaultValue={currentUser.email} required/>
                </Form.Group>
                <Form.Group id="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group id="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange}/>
                </Form.Group>
                <Form.Group id="school">
                    <Form.Label>School</Form.Label>
                    <Form.Control type="text" name="school"value={formData.school} onChange={handleChange} />
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

export default UpdateProfile
