import s from "./Friends.module.scss"
import { IoCopy,IoPersonAdd } from "react-icons/io5";
import React,{useContext,useRef,useEffect,useState} from 'react'
import { MyContext } from './../../../context/Context'
import axios from 'axios';
import {Link} from 'react-router-dom'

const Friends = () => {

	const {  thisUser,setNotific } = useContext(MyContext);
	 const [referralUsers, setReferralUsers] = useState(null);

	const animBlock = useRef()

	let timer;
	useEffect(()=>{
		if(animBlock.current){
			timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)	
		}

		return ()=> {clearTimeout(timer)}
	},[])

	 const handleCopy = () => {
    if (thisUser?.referral_code) {
  
      navigator.clipboard.writeText(thisUser.referral_code)
        .then(() => {
          setNotific("Referral code copied")
        })
        .catch((err) => {
          console.error('Error copying text: ', err);
        });
    }
  };




  useEffect(() => {
    if (thisUser?.referral_id) {
      // Отправляем запрос на сервер для получения пользователей по referral_id
      axios.post(`${process.env.REACT_APP_API_URL}/api/getReferralUsers`, {
        telegram_id: thisUser.telegram_id
      })
        .then((response) => {
          setReferralUsers(response.data); // Сохраняем найденных пользователей
        })
        .catch((error) => {
          console.error('Error fetching referral users:', error);
        });
    }
  }, [thisUser]);


  const friends = referralUsers 
  ? referralUsers.map((ref,index)=> 
  	<div className={s.refContent} key={index}>
						<span className={s.item1}><IoPersonAdd/></span>
						<span className={s.item2}>{ref.first_name}</span>
						<span className={s.item3}>+250</span>
	</div>) 
  : "Loading"

	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
				<div className={s.content1}>
					<span className={s.miniItem1}>INVITE FRIENDS</span>
					<span className={s.miniItem2}>SHARE YOUR INVATION LINK</span>
					<span className={s.miniItem3}>& GET POINTS</span>
				</div>
				<div className={s.content2}>
					<div className={s.miniContent}>
					<span className={s.item1}>Your invaiton link</span>
					<span className={s.item2} onClick={handleCopy}>
					<input type="text" value={thisUser?.referral_code} disabled={true} />
					<IoCopy />
					Copy
					</span>
					</div>
				</div>
				<div className={s.content3}>
					<div className={s.totalRef}>Referrals: {referralUsers ? friends?.length : 0}</div>
					{referralUsers 
					? friends 
					: <div className={s.addRefContainer}>
						<Link to={`https://t.me/share/url?url=${thisUser?.referral_code}&text=Hello fren! Join us, let's solve Santa's riddles together! 🎅`}>Invite Friends</Link>
						<span className={s.noRefText}>You do not have any friends</span>
					</div>}
				</div>
			</div>
		</div>
		)
}

export default Friends 