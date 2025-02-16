import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../constants/constants";

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();

  function checkRole(role) {
    switch(role) {
      case 1: return "Сиделка";
      case 2: return "Хозяин";
      case 3: return "Админ";
    }
  };

  function checkBlocked(bool) {
    switch(bool) {
      case true: return "Да";
      case false: return "Нет";
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(API_ENDPOINTS.ADMIN_GETUSERS, {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user) => (
            <li style={{margin: "15px 0"}} key={user.id}>Пользователь: {user?.login}, Роль: {checkRole(user?.role)}, Блокировка: {checkBlocked(user?.isBlocked)}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
