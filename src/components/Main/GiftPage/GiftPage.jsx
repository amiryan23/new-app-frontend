import s from './GiftPage.module.scss'
import React,{useContext,useRef,useEffect,useState} from 'react'
import { MyContext } from './../../../context/Context'
import axios from 'axios'
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoKeySharp } from "react-icons/io5";
import {Link} from 'react-router-dom'
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import CountUp from 'react-countup';
import { useReward } from 'react-rewards';
import WebApp from '@twa-dev/sdk'
import { FaSnowman } from "react-icons/fa";
import MiniLoader from './../../MiniLoader/MiniLoader'
import CreateGift from './CreateGift/CreateGift'


const GiftPage = () => {

	const {  thisUser,setThisUser,setNotific} = useContext(MyContext);

	const [giftModal,setGiftModal] = useState(false)
	const [openCreateModal,setOpenCreateModal] = useState(false)
	const [loading,setLoading] = useState(false)
	const [giftOpening,setGiftOpening] = useState(false)
	const [gifts, setGifts] = useState(null);
	const [thisGiftOptions,setThisGiftOptions] = useState(null)
	const [giftTaskId,setGiftTaskId] = useState(null)

	  const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiId', 'confetti');

	  const gift = useRef()
	  const modalAnim = useRef()
	  const animBlock = useRef()

	  	  useEffect(()=>{
	 if(animBlock.current && gifts){
		timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)
	}

     return () => {
		clearTimeout(timer)
	}
	  },[gifts])

 let timer;

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_URL}/gifts`)
            .then(response => {
                setGifts(response.data);
                
            })
            .catch(err => {
                console.error('Ошибка при получении данных:', err);
                            
            });


    }, []);

	const handleOpening = () => {
		if(thisGiftOptions?.link ){
		setLoading(true)
		} else {
		setLoading(true)
		setTimeout(()=>{
			setGiftTaskId(thisGiftOptions?.id)
		setLoading(false)

		},1500)
		}
		setGiftOpening(true)
		confettiReward()
	}

	let timerGift;
	let timerModal;

	useEffect(()=>{
		if(giftOpening && gift.current){
			timerGift = setTimeout(()=>{gift.current.classList.add(s.giftRewards)},1500)
		}

		if(giftModal){
			timerModal = setTimeout(()=>{modalAnim.current.classList.add(s.animModal)})
		}

		return () => {
			clearTimeout(timerGift)
			clearTimeout(timerModal)
		}
	},[giftOpening,giftModal])




	const giftTabel = gifts 
	? gifts.filter(gift=>gift.verified).map(gift=> 		
				gift.verified	 &&	 <span className={s.giftListItem2} key={gift.id}>
					<span className={s.giftBlock1}><img src="https://i.ibb.co/2gD71Jp/Gift.png" alt="" /></span>
					<span className={s.giftBlock2}>
					{gift.private 
					? <><span className={s.private}><FaSnowman/></span>Unknown</>
					:<><img src={gift.owner_photo_url} alt=""/>{gift.owner_first_name.length >= 20 ? <> {gift.owner_first_name.slice(0,20)} . </> : gift.owner_first_name }</>
						}
					</span>
					<span className={s.giftBlock3}>{gift.is_claimed_users.length || 0}/{gift.limite}</span>
					<span className={s.giftBlock4}>
					{gift.status === "active" 
					? 
					!gift.is_claimed_users.includes(thisUser?.telegram_id)
					? <button onClick={()=>{
						setGiftModal(true)
						setThisGiftOptions({
							id:gift.id,
							ownerPhoto:gift.owner_photo_url,
							ownerName:gift.owner_first_name,
							reward:gift.reward,
							text:gift.description,
							private:gift.private,
							link:gift.link
						})

					}}>Open</button> 
					: <span className={s.claimed}>Taken</span>
					: 
					gift.is_claimed_users.includes(thisUser?.telegram_id)
					? <span className={s.claimed}>Taken</span>
					: <span className={s.ended}>Ended</span>}
					</span>
						</span>) 
	: ""


	   const handleClaimGift = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/gifts/claim-gift`, {
                giftId:thisGiftOptions?.id,
                TelegramId:thisUser?.telegram_id
            });

            setLoading(false);
            setNotific("Claimed")
            confettiReward()
            setThisUser({...thisUser,points:thisUser?.points + thisGiftOptions?.reward})
		setGifts((prevGifts) => 
    		prevGifts.map(gift => 
        	gift.id === thisGiftOptions.id ? 
       	    { 
            ...gift,
            is_claimed_users: [...gift.is_claimed_users, thisUser?.telegram_id],  // Используем spread для добавления нового ID
            status: [...gift.is_claimed_users, thisUser?.telegram_id].length >= gift.limite ? "Ended" : "active" // Проверяем количество пользователей
       		 } : gift
   			 )
		);         
            setGiftTaskId(null)
            setGiftModal(false)
            setGiftOpening(false)
        } catch (error) {
            if (error.response) {
                console.log('An error occurred');
            } else {
                console.log('Error connecting to server');
            }
        } finally {
            setLoading(false);
        }
    };

	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
			<div className={s.content1}>
			<Link to="/" className={s.content}><RiArrowGoBackLine/></Link>
			<Link to='/shop' className={s.item}>{thisUser?.keysForCode}<IoKeySharp/></Link>
			</div>
			<div className={s.content2}>
				<span className={s.giftListItem1}>List of gifts</span>
				<span className={s.giftListContainer}>
					{gifts && giftTabel?.reverse()}
				</span>
			</div>
			<div className={s.content3}>
				<button id="confettiId" onClick={()=>{setOpenCreateModal(true)}}><IoIosAddCircleOutline/> Send a gift</button>
			</div>
			{giftModal
			?
			<div className={s.modalGifOpen}>
				<div className={s.giftOpenContainer} ref={modalAnim}>
					<div className={s.item1}>
					<span onClick={()=>{
						setGiftModal(false)
						setLoading(false)
						setGiftOpening(false)
						setGiftTaskId(null)
					}}><IoCloseCircle/></span>
					</div>
					<div className={s.item2}>
					<img className={giftOpening ? `${s.animGift} ${s.imgGift}` : s.imgGift}  src="https://i.ibb.co/2gD71Jp/Gift.png" alt="" />
					<div className={s.rewardContent} ref={gift}>
						<span className={s.rewardItem1}>
							<CountUp end={thisGiftOptions?.reward} preserveValue={true} />
                			<img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
						</span>
						<span className={s.rewardItem2}>{thisGiftOptions?.text}</span>
						{thisGiftOptions?.link ? <span className={s.rewardItem3} 
						onClick={()=>{
							WebApp.openTelegramLink(thisGiftOptions?.link)
							setGiftTaskId(thisGiftOptions?.id)
							setLoading(false)
						}}><span className={s.item1}>Check this channel or invitation link for a reward.</span>
						<span className={s.item2}>{thisGiftOptions?.link}</span></span> : ""}
					</div>
					</div>
					<div className={s.item3}>
					<span className={s.miniItem1}>From</span>
					<span className={s.miniItem2}>
					{thisGiftOptions?.private 
					? <><span className={s.private}><FaSnowman/></span>Unknown</>
					: <><img src={thisGiftOptions?.ownerPhoto} alt="" />{thisGiftOptions?.ownerName}</> }
					</span>
					</div>
					<div className={s.item4}>
					{giftTaskId === thisGiftOptions?.id
					? <button  disabled={loading} onClick={handleClaimGift}>{loading ? "Claiming" : "Claim"} </button>
					: <button  disabled={loading} onClick={handleOpening}>{loading ? "Claim" : "Open Gift"}</button>}
					</div>
				</div>
			</div>
			: ""}
			</div>
			{!gifts && <MiniLoader/>}
			<><CreateGift openCreateModal={openCreateModal} setOpenCreateModal={setOpenCreateModal}/></>
		</div>
		)
}

export default GiftPage