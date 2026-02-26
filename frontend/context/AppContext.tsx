"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

export const user_service = "http://localhost:5001";
export const chat_service = "http://localhost:5003";

// ---------------- User Interface ----------------
export interface User {
  _id: string;
  name: string;
  email: string;
}

// ---------------- Chat Interfaces ----------------
export interface Chat {
  _id: string;
  users: string[]; // array of user IDs
  latestMessage: {
    text: string;
    sender: string;
  };
  createdAt: string;
  updatedAt: string;
  unseenCount?: number;
}

export interface Chats {
  _id: string;
  user: User; // the other participant
  chat: Chat;
}

// ---------------- App Context Interface ----------------
interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setisAuth: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chats[] | null;
  setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
  logoutUser: () => void;
  fetchUsers: () => void;
  fetchChats: () => void;
  users:User[] | null;
 
}

// ---------------- Context ----------------
const AppContext = createContext<AppContextType | undefined>(undefined);

// ---------------- Provider ----------------
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setisAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chats[] | null>(null);

  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");
     

      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.user);
      setisAuth(true);
      setLoading(false)
    } catch {
      setUser(null);
      setisAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove("token");
    setUser(null);
    setisAuth(false);
    setChats(null);
    toast.success("User Logged Out");
  };

  async function fetchChats() {
    const token = Cookies.get("token")
    try {
      const {data}= await axios.get(`${chat_service}/api/v1/chat/all`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  setChats(data.chat)
    } catch (error) {
      
    }
    
  }
const [users ,setUsers] = useState<User[] | null>(null)
async function fetchUsers() {
  try {
     const token = Cookies.get("token");
     

      const { data } = await axios.get(`${user_service}/api/v1/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
setUser(data)
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    fetchUser();
    fetchChats();
    fetchUsers() 
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, isAuth, setisAuth, loading, chats, setChats,fetchUsers,fetchChats , logoutUser ,users  }}>
      {children}
    </AppContext.Provider>
  );
};

// ---------------- Custom Hook ----------------
export const useAppData = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppProvider");
  }

  return context;
};