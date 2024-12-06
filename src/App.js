import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import Menu from './components/Menu/Menu'
import Loading from './components/Loading/Loading'
import Notification from './components/Notification/Notification'
import { MyContext,MyContextProvider } from './context/Context';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import axios from "axios"
import {useEffect,useContext,useState} from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

function App() {
  
  const { thisUser,levels,users,isLoaded,setIsLoaded} = useContext(MyContext);

  
  
  const [loading, setLoading] = useState(false);


useEffect(() => {
  const fetchImages = async () => {
    const urls = [
      "https://i.ibb.co/mT3xSmR/background2.jpg",
      "https://i.ibb.co/hdnM00R/person.png",
      "https://i.ibb.co/1Zg54G1/coin.png",
      "https://i.ibb.co/zRZtxh7/background1.jpg",
      "https://i.ibb.co/pWVbQ0w/5.png",
      "https://i.ibb.co/ZXxxvjg/bckg1.png"
    ];

    try {
      // Загружаем и декодируем изображения с помощью объекта Image
      await Promise.all(
        urls.map(
          (url) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = url; // Устанавливаем URL
              img.onload = () => resolve(url); // Успешно загружено
              img.onerror = (err) => reject(`Ошибка загрузки изображения: ${url}`);
            })
        )
      );
      setLoading(false); // Скрываем индикатор загрузки после успешной загрузки всех изображений
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 10)
    } catch (error) {
      console.error("Не удалось загрузить изображения:", error);
    }
  };


  fetchImages();
}, []);



let timer;
useEffect(()=>{
  if(isLoaded === 100){
    timer = setTimeout(()=>{setLoading(true)},1000) 
  }

},[isLoaded])

  return (
    
    <TonConnectUIProvider manifestUrl="https://new-app-santa-quest.netlify.app/tonconnect-manifest.json">
    <BrowserRouter>
    <div className="App">
    {loading ? ""  : <Loading />}
      <div className="Container">
      <Header/>
      
      <Main />
      
      <Menu />
      <Notification />
      </div>
    </div>
    </BrowserRouter>
    </TonConnectUIProvider>
    
  );
}

export default App;
