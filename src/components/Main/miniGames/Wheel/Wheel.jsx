import s from './Wheel.module.scss'
import { Wheel } from 'react-custom-roulette'
import React,{useContext,useRef,useEffect,useState} from 'react'
import { MyContext } from './../../../../context/Context'
import {Link} from 'react-router-dom'
import CountUp from 'react-countup';
import { IoKeySharp } from "react-icons/io5";
import axios from "axios"
import WebApp,{Telegram} from '@twa-dev/sdk'

const WheelGame = () => {

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [onSpinComplete, setOnSpinComplete] = useState(null);
  const [data, setData] = useState(null);

  const {  thisUser,setThisUser,setNotific } = useContext(MyContext);


    const loadingData = [
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}},
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}},
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}},
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}},
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}},
      {option:"Loading",style:{"backgroundColor": "#282c34", "textColor": "whitesmoke"}}]

  const animBlock = useRef()

let timer;


  useEffect(() => {
   
    axios.get(`${process.env.REACT_APP_API_URL}wheel_prizes`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
      });

      if(animBlock.current){
		timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)
	}

     return () => {
		clearTimeout(timer)
	}
  }, []);

const handleSpinClick = async () => {
  if (!mustSpin && thisUser.keysForCode > 0) {
  	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/spin`, {
        telegramId: thisUser.telegram_id,
      });

      if (response.status === 200) {
        const { prizeNumber, updatedKeys, updatedPoints ,rewardPoints , typePrize} = response.data;
        setThisUser((prev) => ({
              ...prev,
              keysForCode: thisUser?.keysForCode - 1,
             }));
        setPrizeNumber(prizeNumber);
        setMustSpin(true);

        // Сохраняем функцию для обновления данных пользователя в состояние
        setOnSpinComplete(() => {
          return () => {
            setThisUser((prev) => ({
              ...prev,
              keysForCode: updatedKeys,
              points: updatedPoints,
            }));
            setNotific(`You received ${rewardPoints} ${typePrize === "points" ? "Points" : "Key"} `)
           setTimeout(()=>{setMustSpin(false)},5000) ;
          };
        });
      } else {
        console.error('Ошибка при выполнении спина:', response.data.error);
      }
    } catch (error) {
      console.error('Ошибка сети или сервера:', error);
    }
  } else {
    alert('Недостаточно ключей для спина!');
  }
};



	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
				<div className={s.content1}>
					<span className={s.miniItem1}>WHEEL OF FORTUNE<Link to="/shop" className={s.keysItem}><CountUp end={thisUser?.keysForCode} preserveValue={true}/><IoKeySharp/></Link></span>
					<span className={s.miniItem2}>TEST YOUR LUCK</span>
					<span className={s.miniItem3}>& CLAIM YOUR PRIZES!</span>
					
				</div>
				<div className={s.content2}>
    <Wheel
      mustStartSpinning={mustSpin}
      prizeNumber={prizeNumber}
      data={data ? data : loadingData}
      outerBorderColor="#b88dc4"
      radiusLineColor="#999"
      fontFamily="monospace"
      spinDuration={1.1}
      innerBorderWidth={20}
      innerBorderColor="#999"
      perpendicularText={true}
      radiusLineWidth="2"
      onStopSpinning={() => {
    if (onSpinComplete) {
      onSpinComplete(); 
      setOnSpinComplete(null);   
    }
        }}
    />
    <button onClick={handleSpinClick} disabled={mustSpin || !thisUser?.keysForCode > 0 ? true : false}>{!mustSpin ? <>1 <IoKeySharp/></> : "Wait"}</button>
   		 </div>
   		 
			</div>
		</div>
		)
}

export default WheelGame