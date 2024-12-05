import s from './Header.module.scss'
import { MyContext } from './../../context/Context'
import React,{useContext,useRef,useEffect,useState} from 'react'
import { FaSnowman,FaWallet } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import {Link} from 'react-router-dom'
import CountUp from 'react-countup';

const Header = () => {

		 const { thisUser,activeLink,setActiveLink} = useContext(MyContext);

	

	return (
		<header className={s.megaContainer}>
			<div className={s.content1}>
			{thisUser?.photo_url !== ""
			? <img src={thisUser?.photo_url} alt="" />
			: <span className={s.noPhoto}><FaSnowman/></span> }
			{thisUser ? thisUser?.first_name : "Loading"} {thisUser ? thisUser?.last_name : "Loading"}
			</div>
			<div className={s.content2}></div>
			<div className={s.content3}>
			<span className={s.item1}>
			{thisUser 
			?  <CountUp end={thisUser?.points} preserveValue={true}/>
			: "Loading"}
			<img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
			</span>
			<span className={s.item2}>
			<Link to="/wallet" className={activeLink === "wallet" ? `${s.miniItem} ${s.activeLink}` : s.miniItem} onClick={()=>{setActiveLink("wallet")}}><FaWallet/></Link>
			<Link to="/shop" className={activeLink === "shop" ? `${s.miniItem} ${s.activeLink}` : s.miniItem} onClick={()=>{setActiveLink("shop")}}><FaShop/></Link>
			</span>
			</div>
		</header>
		)
}

export default Header