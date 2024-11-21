// UserTable.jsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, Stack } from '@mui/material';
import { is } from 'date-fns/locale';

const UserTable = ({ users, isPending, isRejected, isStaff, isClient, handleApprove, handleDeleteUser, handleRoleChange, handleReject }) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState({});

  const handleEditClick = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole({ ...selectedRole, [userId]: currentRole });
  };

  const handleSaveClick = (userId) => {
    console.log(selectedRole[userId]);
    handleRoleChange(userId, selectedRole[userId]);
    setEditingUserId(null);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '25%' }}>Email</TableCell>
            <TableCell sx={{ width: '25%' }}>Username</TableCell>
            <TableCell sx={{ width: '25%' }}>Role</TableCell>
            <TableCell sx={{ width: '25%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {editingUserId === user._id ? (
                    <Select
                      value={selectedRole[user._id]}
                      onChange={(e) => setSelectedRole({ ...selectedRole, [user._id]: e.target.value })}
                    >
                      <MenuItem value="solicitor">Solicitor</MenuItem>
                      <MenuItem value="clerk">Clerk</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      {/* <MenuItem value="client">Client</MenuItem> */}
                    </Select>
                  ) : (
                    user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  )}
                </TableCell>
                <TableCell>
                  {isPending ? (
                    <Stack spacing={2} direction="row">
                      <Button variant="contained" color="primary" onClick={() => handleApprove(user._id)}>Accept</Button>
                      <Button variant="contained" color="error" onClick={() => handleReject(user._id)}>Reject</Button>
                    </Stack>
                  ) : isRejected ? (
                    <Stack spacing={2} direction="row">
                      <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                    </Stack>
                  ) : (
                    <Stack spacing={2} direction="row">
                      {editingUserId === user._id ? (
                        <Button variant="contained" color="primary" onClick={() => handleSaveClick(user._id)}>Save</Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={() => handleEditClick(user._id, user.role)}>Edit</Button>
                      )}
                      <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {isPending ? (
                <TableCell colSpan={4} align="center">No pending users found</TableCell>
              ) : isRejected ? (
                <TableCell colSpan={4} align="center">No rejected users found</TableCell>
              ) : isClient ? (
                <TableCell colSpan={4} align="center">No clients found</TableCell>
              ) : (
                <TableCell colSpan={4} align="center">No staffs found</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer >
  );
};

export default UserTable;
