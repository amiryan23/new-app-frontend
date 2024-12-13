import s from './Level1.module.scss'
import React,{useContext,useRef,useEffect,useState} from 'react'
import {useParams,Link}  from 'react-router-dom'
import { MyContext } from './../../../context/Context'
import axios from 'axios'
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoKeySharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import WebApp from '@twa-dev/sdk'


const Level = ()=> {

	const animBlock1 = useRef()
	const [code,setCode] = useState(null)
const {  thisUser,setThisUser,levels,setLevels,setNotific,shopItems} = useContext(MyContext);
	const [message,setMessage] = useState(null)
	const [invalid ,setInvalid ] = useState(null)
	const [disabled,setDisabled] = useState(15)

const {id} = useParams()
const btn = useRef()
const btn2 = useRef()

let timer;
	useEffect(()=>{
		timer = setTimeout(()=>{
			animBlock1.current.classList.add(s.animBlock1)
		},250)

		return ()=>{
			clearTimeout(timer)
		}
	},[])

	const selectedLevel = levels ? levels.find((level) => {
    if (id && level && level.level === parseInt(id, 10)) {
        return true;
    }
    return false;
}) : null;

	const telegram_id = thisUser.telegram_id

	const handleVerify = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/levels/verify-code`, { id , userCode: code , telegram_id})
      .then(response => {
        setMessage(response.data.message);
        const newDataLevel = {
 		 ...selectedLevel,
 		 is_completed: [...(selectedLevel.is_completed || []), telegram_id],
		};
       const updatedLevels = levels.map(level =>
		  level.id === selectedLevel.id ? newDataLevel : level
		);
		setLevels(updatedLevels);
		setNotific("The code is correct")

      })
		.catch(err => {
      if (err.response) {
        setMessage(err.response.data.message);

        // Если код неверный, снимаем 1 ключ
        axios.post(`${process.env.REACT_APP_API_URL}/users/decrease-key`, { telegram_id })
          .then(() => {
          	setThisUser({...thisUser,keysForCode:thisUser.keysForCode - 1})
            setCode("");
            if(thisUser?.keysForCode > 0 && btn2.current){
            	setInvalid(true);
            	btn2.current.disabled = true;
            setTimeout(() => {
            	if(btn2.current){
              btn2.current.disabled = false;
          	}
              setInvalid(false);
           				 }, 16000);
            }
            
           
          })
          .catch(decreaseError => {
            console.error('Error decreasing keys:', decreaseError);
          });

      } else {
        console.error('Error verifying code:', err);
        setMessage('An unexpected error occurred.');
      }
    });
};


  const claimFunction = () => {
     btn.current.disabled = true 
     setTimeout(()=>{
     	setThisUser({...thisUser,points:thisUser.points + selectedLevel.reward})
  		window.history.back(-1)
  		setNotific(`You received +${selectedLevel.reward} Points`)
     },3000)

  }


let timerDisabled;

useEffect(()=>{
	if(invalid && disabled > 0){
	timerDisabled = setInterval(()=>{
		setDisabled((prevDisabled)=>prevDisabled - 1)
	},1000)
}  else {
	setDisabled(15)
}
return () => {
	clearInterval(timerDisabled)
}
},[invalid])

const skipLevel = shopItems ? shopItems.find(keys=> keys.type === "skip_level") : ""

async function openInvoice( price ) {
  try {
    // Отправляем параметры keys и price на бэкенд
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-invoice`, {
      keys:null,
      price,
    });

    const { invoiceLink } = response.data;

    // Открываем счёт-фактуру в WebApp
    WebApp.openInvoice(invoiceLink, async (status) => {

		await axios.post(`${process.env.REACT_APP_API_URL}/api/process-payment`, {
     		 invoiceLink,
     			telegram_id: WebApp.initDataUnsafe?.user?.id, // ID текущего пользователя
     		    type:"Skip_Level",
      			keys: 0,
      			levelId:selectedLevel?.level,
      			price: price,
      			status
     
    });

      if (status === "paid") {
      	const newDataLevel = {
 		 ...selectedLevel,
 		 is_completed: [...(selectedLevel.is_completed || []), telegram_id],
		};
       const updatedLevels = levels.map(level =>
		  level.id === selectedLevel.id ? newDataLevel : level
		);
		setLevels(updatedLevels);
      } else if (status === "cancelled") {
      	console.log("Cancelled")
   
      }else if (status === "failed") {
        console.log("Платёж не удался");
    
      } else if (status === "pending") {
        console.log("Платёж ожидает обработки");
   
      }
    });
  } catch (error) {
    console.error("Ошибка при открытии счет-фактуры:", error);
    alert(error)
  }
}


	return (
		!selectedLevel.is_closed 
		? <div className={s.megaContainer} ref={animBlock1}>
			<div className={s.container}>
				<div className={s.miniContainer}>
					{selectedLevel?.is_completed.includes(thisUser.telegram_id)
					? <div className={s.completedContainer}>
							<div className={s.completedContent}>
								<div className={s.item2}>
									<img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
								</div>
								<div className={s.item1}>Yes, this is the correct answer, how did you guess? Share with friends or not? Decide for yourself :3</div>
								<div className={s.item3}>
									<button onClick={claimFunction} ref={btn}>Claim</button>
									<span>+ {selectedLevel?.reward} <img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" /></span>
								</div>
							</div>	
					  </div>
					:<>
					<div className={s.miniContent}><Link to="/" className={s.content}><RiArrowGoBackLine/></Link><Link to='/shop' className={s.item}>{thisUser?.keysForCode}<IoKeySharp/></Link></div>
					<div className={s.content1}>
						<img src={selectedLevel.imgUrl} alt="" />
					</div>
					<div className={s.content2}>
						<input value={code} placeholder="Enter secret code" onChange={(e)=>{setCode(e.target.value)}}type="text" maxLength={16} />
					</div>
					<div className={s.content3}>
						{invalid && thisUser?.keysForCode > 0 ? <sapn className={s.invalid}>The code is incorrect, fren. ({disabled})</sapn> : ""}
						<span className={s.item}>
						{thisUser?.keysForCode > 0 ? <button ref={btn2} onClick={handleVerify} >Check <IoKeySharp/></button> : <button disabled={true} onClick={handleVerify} >Done</button>}
						<button className={s.buyStarsButton} onClick={()=>{openInvoice(skipLevel?.price)}}>{skipLevel?.name}<FaStar/></button>
						</span>
						
					</div>
					</>
					}
					<div className={s.content4}></div>
				</div>
			</div>
		</div>
		: ""
		)
}

export default Level