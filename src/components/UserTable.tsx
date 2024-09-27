import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, editUser, addUser, User } from '../store/userSlice';
import { RootState } from '../store';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';

const UserTable: React.FC = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.user.users);
    const status = useSelector((state: RootState) => state.user.status);
  
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
    useEffect(() => {
      if (status === 'idle') {
        //@ts-ignore
        dispatch(fetchUsers());
      }
    }, [dispatch, status]);
  
    const handleClose = () => {
      setShow(false);
      setSelectedUser(null);
    };
  
    const handleShow = () => {
      setShow(true);
    };
  
    const handleDelete = (id: number) => {
      dispatch(deleteUser(id));
    };
  
    const handleEdit = (user: User) => {
      setSelectedUser(user);
      handleShow();
    };
  
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const userData: User = {
        id: selectedUser ? selectedUser.id : Math.random(),
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: {
          city: formData.get('city') as string,
          zipcode: formData.get('zip') as string,
        },
      };
  
      if (selectedUser) {
        dispatch(editUser(userData));
      } else {
        dispatch(addUser(userData));
      }
      handleClose();
    };
  
    return (
      <div>
        <Button variant="primary" onClick={handleShow}>Add User</Button>
        {status === 'loading' ? (
          <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City (Zip)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user?.id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone}</td>
                  <td>{`${user?.address?.city} (${user?.address?.zipcode})`}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(user?.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? 'Edit User' : 'Add User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" defaultValue={selectedUser?.name || ''} required />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" defaultValue={selectedUser?.email || ''} required />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" defaultValue={selectedUser?.phone || ''} required />
              </Form.Group>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" name="city" defaultValue={selectedUser?.address.city || ''} required />
              </Form.Group>
              <Form.Group controlId="formZip">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" name="zip" defaultValue={selectedUser?.address.zipcode || ''} required />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
export default UserTable;
