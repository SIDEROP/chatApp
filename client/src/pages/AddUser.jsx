import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../app/slices/userSlice";
import AddUserList from "../components/AddUserList";
import Loader from "../components/Loader";


const AddUser = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(
    (state) => state.user.getAllUser
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Loader/>
        </p>}
      {users && users.length > 0 ? (
        users.map((user) => (
          <AddUserList user={user}/>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </>
  );
};

export default AddUser;
