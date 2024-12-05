import s from './Notification.module.scss'
import {useEffect,useState,useRef,useContext} from 'react'
import { MyContext } from './../../context/Context'
import { MdDone } from "react-icons/md";
import WebApp,{Telegram} from '@twa-dev/sdk'

const Notification = () => {

	const animNotific = useRef()
	const { notific,setNotific} = useContext(MyContext);


 let timer;
 let timer2;
 let timer3;

	useEffect(()=>{
		
		if(notific){
			timer = setTimeout(()=>{animNotific.current.classList.add(s.animNotific)},50)
			timer2 = setTimeout(()=>{animNotific.current.classList.remove(s.animNotific)},3000)
			timer3 = setTimeout(()=>{setNotific(null)},3500)
			window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
		}

		return () => {
			clearTimeout(timer)
			clearTimeout(timer2)
			clearTimeout(timer3)
		}
	},[notific])

	return (
		<div className={s.megaContainer} ref={animNotific}>
			<div className={s.notificationContainer}>
				<div className={s.container}>
					<span className={s.item1}><MdDone/></span>
					<span className={s.item2}>{notific}</span>
				</div>
			</div>
		</div>
		)
}

export default Notification