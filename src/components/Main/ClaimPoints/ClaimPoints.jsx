import s from './ClaimPoints.module.scss';
import { useState, useEffect, useContext , useRef} from 'react';
import axios from 'axios';
import { MyContext } from './../../../context/Context';
import CountUp from 'react-countup';
import { useReward } from 'react-rewards';

const ClaimPoints = () => {
  const [pointsFromChest, setPointsFromChest] = useState(null);
  const [message, setMessage] = useState('');
  const [isClaimable, setIsClaimable] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  
  const { thisUser, setThisUser, setNotific , claimTime, setClaimTime} = useContext(MyContext);

  const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti');


const animBlock = useRef()

let timer;

useEffect(()=>{
  if(animBlock.current){
    timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)
  }

  return () => {
    clearTimeout(timer)
  }
},[])

  const lastClaim = thisUser?.last_claim_time

useEffect(() => {
  const calculateNextClaimTime = () => {
    if (thisUser?.last_claim_time) {
      const lastClaimTime = new Date(thisUser?.last_claim_time);
      const nextClaimTime = new Date(lastClaimTime.getTime() + 1 * 60 * 60 * 1000); 
      const currentTime = new Date();

      const remaining = nextClaimTime - currentTime;

      if (!claimTime && remaining <= 0) {
        setIsClaimable(true);
        setRemainingTime('');
      } else {
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setRemainingTime(`${hours}h ${minutes}m`);
        setIsClaimable(false);
      }
    }
  };

  calculateNextClaimTime();
  const interval = setInterval(calculateNextClaimTime, 1000);

  return () => clearInterval(interval);
}, [lastClaim]);

const handleClaim = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/claim-chest`, { telegram_id: thisUser?.telegram_id });
    const { message, points_from_chest, next_claim_time } = response.data;

    setPointsFromChest(points_from_chest);
    setMessage(message);
    setIsClaimable(false);
    setClaimTime(`1h 00m`)

   
    setThisUser((prev) => ({
      ...prev,
      points: prev.points + points_from_chest,
      points_from_chest: points_from_chest,
      
    }));

    setNotific(`You received +${points_from_chest} points`);
    confettiReward();

    // Рассчитываем оставшееся время на основе next_claim_time с сервера
//     const nextClaimDate = new Date(next_claim_time);
//     const currentTime = new Date();
//     const remainingMs = nextClaimDate - currentTime;
// 
//     if (remainingMs <= 0) {
//       setRemainingTime('');
//       setIsClaimable(true);
//     } else {
//       const hours = Math.floor(remainingMs / (1000 * 60 * 60)); // Часы
//       const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)); // Минуты
//       setRemainingTime(`${hours}h ${minutes}m`);
//     }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Something went wrong.';
    setMessage(errorMessage);

    if (error.response?.data?.remainingTime) {
      const remainingMs = error.response.data.remainingTime;
      const nextClaimTime = new Date(Date.now() + remainingMs).toISOString();
      setIsClaimable(false);
      setRemainingTime(nextClaimTime);
    }
  }
};

  return (
        <div className={s.pointsContent2}>
          <div className={s.PointsContent}>
            {thisUser?.points_from_chest !== null ? (
              <div className={s.points} id="confettiReward">
                Last received: <CountUp end={thisUser?.points_from_chest} preserveValue={true} />
                <img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
              </div>
            ) : (
              0
            )}
          </div>
          <button
            onClick={handleClaim}
            disabled={claimTime  || !isClaimable  ? true : false}
            
          >
            {isClaimable && !claimTime ? 'Claim' :  claimTime || remainingTime }
          </button>
        </div>
  );
};

export default ClaimPoints;