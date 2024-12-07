import s from './ClaimPoints.module.scss'
import { useState, useEffect , useContext } from 'react';
import axios from 'axios';
import { MyContext } from './../../../context/Context'



const ClaimPoints = () => {
const [pointsFromChest, setPointsFromChest] = useState(null);
  const [message, setMessage] = useState('');
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [isClaimable, setIsClaimable] = useState(true);
  const { thisUser } = useContext(MyContext);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (nextClaimTime) {
        const currentTime = new Date();
        const remainingTime = new Date(nextClaimTime) - currentTime;

        if (remainingTime <= 0) {
          setIsClaimable(true);
          setMessage('');
        } else {
          const hours = Math.floor(remainingTime / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          setMessage(`Wait ${hours} hours and ${minutes} minutes for the next claim.`);
        }
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000); 

    return () => clearInterval(interval);
  }, [nextClaimTime]);

  const handleClaim = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/claim-chest`, { telegram_id: thisUser?.telegram_id });
      const { message, points_from_chest, next_claim_time } = response.data;

      setPointsFromChest(points_from_chest);
      setMessage(message);
      setNextClaimTime(next_claim_time);
      setIsClaimable(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong.';
      setMessage(errorMessage);

      if (error.response?.data?.remainingTime) {
        setNextClaimTime(new Date(Date.now() + error.response.data.remainingTime).toISOString());
        setIsClaimable(false);
      }
    }
  };

  return (
    <div className={s.megaContainer}>
      <div className={s.miniContainer}>
        <h1>Claim Your Points</h1>
        <div className={s.message}>{message}</div>
        {pointsFromChest !== null && <div className={s.points}>You received: {pointsFromChest} points!</div>}
        <button
          onClick={handleClaim}
          disabled={!isClaimable}
          className={`${s.button} ${!isClaimable ? s.disabled : ''}`}
        >
          {isClaimable ? 'Claim Points' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default ClaimPoints;