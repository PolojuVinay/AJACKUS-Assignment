// src/components/UserManagement.js
import React, {useEffect, useState} from 'react'
import axios from 'axios'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  })
  const [error, setError] = useState(null)

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      )
      setUsers(response.data)
    } catch (err) {
      setError('Failed to load users.')
    }
  }

  const handleInputChange = e => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/users',
        form,
      )
      setUsers([...users, response.data])
      setForm({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      })
    } catch (err) {
      setError('Failed to add user.')
    }
  }

  const handleEditUser = async user => {
    setForm(user)
  }

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${form.id}`,
        form,
      )
      const updatedUsers = users.map(user =>
        user.id === form.id ? form : user,
      )
      setUsers(updatedUsers)
      setForm({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      })
    } catch (err) {
      setError('Failed to update user.')
    }
  }

  const handleDeleteUser = async id => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      setError('Failed to delete user.')
    }
  }

  return (
    <div>
      <h1>User Management Dashboard</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* User Form */}
      <div>
        <h2>{form.id ? 'Edit User' : 'Add User'}</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleInputChange}
        />
        <button onClick={form.id ? handleUpdateUser : handleAddUser}>
          {form.id ? 'Update' : 'Add'}
        </button>
      </div>

      {/* User List */}
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
