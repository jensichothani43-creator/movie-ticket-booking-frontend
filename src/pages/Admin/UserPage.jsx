import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./UserPage.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    status: "active",
  });

  const [editUser, setEditUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const data = res.data?.data || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= OPEN ADD MODAL =================
  const openAddPopup = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
      status: "active",
    });
    setIsOpen(true);
  };

  // ================= ADD USER =================
  const addUser = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users", form);
      const newUser = res.data?.data || res.data;

      setUsers((prev) => [...prev, newUser]);
      setIsOpen(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding user");
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= EDIT USER =================
  const startEdit = (u) => {
    setEditUser({ ...u });
  };

  const updateUser = async () => {
    try {
      await api.put(`/users/${editUser.id}`, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || "Update failed");
    }
  };

  return (
    <div className="userPage">
      <h2>User Management</h2>

      <button onClick={openAddPopup}>+ Add User</button>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>

                <td>
                  <button onClick={() => startEdit(u)}>Edit</button>
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= ADD MODAL ================= */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add User</h3>

            <form onSubmit={addUser}>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User</h3>

            <input
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />

            <input
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />

            <input
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={updateUser}>Update</button>
              <button onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;