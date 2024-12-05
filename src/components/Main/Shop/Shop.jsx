import s from './Shop.module.scss'
import shop from './../../../assets/shop.gif'
import { GiHouseKeys } from "react-icons/gi";
import { FaKey } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { IoKeySharp } from "react-icons/io5";
import { MyContext } from './../../../context/Context'
import React,{useContext,useRef,useEffect} from 'react'
import axios from 'axios'
import WebApp,{Telegram} from '@twa-dev/sdk'
import CountUp from 'react-countup';

const Shop = () => {
	const {  shopItems , thisUser , setThisUser} = useContext(MyContext);

async function openInvoice(keys, price) {
	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  try {
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}api/create-invoice`, {
      keys,
      price,
    });

    const { invoiceLink } = response.data;

    WebApp.openInvoice(invoiceLink, async (status) => {

    	  await axios.post(`${process.env.REACT_APP_API_URL}api/process-payment`, {
     		 invoiceLink,
     			telegram_id: WebApp.initDataUnsafe?.user?.id, 
     		    type:"Keys",
      			keys: keys,
      			levelId:null,
      			price: price,
      			status
     
    	});

      if (status === "paid") {
    	setThisUser({...thisUser,keysForCode:thisUser?.keysForCode + keys})
      
      } else if (status === "cancelled") {

      	console.log("cancelled")
        
      } else if (status === "pending") {
      
        alert("WAIT")
      } else if (status === "failed"){

        alert("FAILED")
      }
    });
  } catch (error) {
    console.error("Ошибка при открытии счет-фактуры:", error);
    alert(error)
  }
}

	const shopKeys = shopItems ?
	shopItems.filter(keys=> keys.type === "keys").map(key=>
						<div className={s.shopContent} key={key.id} onClick={()=>{openInvoice(key?.keysForBuy,key.price)}}>
						<span className={s.item1}>{key.name}</span>
						<span className={s.item2}><GiHouseKeys/></span>
						<span className={s.item3}>{key.price} <FaStar/></span>
						</div>)
	: "Loading"

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


	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
				<div className={s.content1}>
					<span className={s.miniItem1}>SHOP</span>
					<span className={s.miniItem2}>BUY KEYS</span>
					<span className={s.miniItem3}>& TRY TO SOLVE THE RIDDLES</span>
				</div>
				<div className={s.content2}><CountUp end={thisUser?.keysForCode} preserveValue={true}/><IoKeySharp/></div>
				<div className={s.content3}>
					{shopKeys}
				</div>
			</div>	
		</div>
		)
}

export default Shop