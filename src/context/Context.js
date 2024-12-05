import React, { createContext, useEffect, useContext, useState, useRef ,useMemo} from 'react';
import axios from 'axios'
import WebApp from '@twa-dev/sdk'
import eruda from 'eruda'
const MyContext = createContext();


const MyContextProvider = ({ children }) => {

const [activeLink,setActiveLink] = useState('game')
const [thisUser,setThisUser] = useState(null)
const [levels,setLevels] = useState(null)
const [users,setUsers] = useState(null)
const [notific,setNotific] = useState(null)
const [tasks,setTasks] = useState(null)
const [taskCompleted,setTaskCompleted] = useState(null)
const [shopItems, setShopItems] = useState(null);
const [isLoaded,setIsLoaded] = useState(0)



  useEffect(() => {

    WebApp.setHeaderColor("#282c34")

const queryParams = new URLSearchParams(window.location.search);
const referrerId = queryParams.get('startapp');
const tg = window.Telegram.WebApp


    const userData =  {
      telegram_id: tg?.initDataUnsafe?.user?.id ,
      username: tg?.initDataUnsafe?.user?.username ,
      first_name: tg?.initDataUnsafe?.user?.first_name,
      last_name: tg?.initDataUnsafe?.user?.last_name ,
      photo_url:tg?.initDataUnsafe?.user?.photo_url,
      referrer_id: referrerId || null,
      initData: tg?.initData

    };

   axios.post(`${process.env.REACT_APP_API_URL}/auth/miniapp`, userData)
      .then(response => {
        setThisUser(response.data);
        setIsLoaded((prevIsLoaded)=>prevIsLoaded + 20)
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}/levels`)
    .then((response) => {
      setLevels(response.data);
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 20)
    } )
    .catch((err)=> console.log('Error fetching levels:',err))


    axios.get(`${process.env.REACT_APP_API_URL}/users`)
    .then((response) => {
      setUsers(response.data);
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 20)
    } )
    .catch((err)=> console.log('Error fetching levels:',err))

    axios.get(`${process.env.REACT_APP_API_URL}/tasks`)
    .then((response) => {
      setTasks(response.data);
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 20)
    } )
    .catch((err)=> console.log('Error fetching tasks:',err))

    axios.get(`${process.env.REACT_APP_API_URL}/shop/items`)
    .then(response =>{ 
      setShopItems(response.data)
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 10)
    })
    .catch(error => console.error('Error fetching shop items:', error));

  }, []);

 const contextValue = useMemo(() => ({
        activeLink,
        setActiveLink,
        thisUser,
        setThisUser,
        levels,
        setLevels,
        users,
        notific,
        setNotific,
        tasks,
        setTasks,
        taskCompleted,
        setTaskCompleted,
        shopItems,
        isLoaded,
        setIsLoaded
        }), [thisUser,levels,users,activeLink,setActiveLink,notific,setNotific,tasks,setTasks,taskCompleted,setTaskCompleted,shopItems,isLoaded,setIsLoaded]);

  return (
    <MyContext.Provider 
    value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
