import s from './Menu.module.scss'
import { FaGamepad } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaTasks,FaUserFriends  } from "react-icons/fa";
import React,{useState,useContext} from 'react'
import {Link} from 'react-router-dom'
import { MyContext } from './../../context/Context'
import { RiTeamFill } from "react-icons/ri";
import { GiTrophyCup } from "react-icons/gi";
import { FaGift } from "react-icons/fa6";

const Menu = () => {

	 const {  activeLink,setActiveLink } = useContext(MyContext);

	// useEffect(()=>{
	// 	if()
	// },[activeLink])

	return (
		<div className={s.megaContainer}>
		<div className={s.miniContainer}>
			<Link 
			to="/"
			className={activeLink === "game" ? `${s.content1} ${s.activeLink}` : s.content1}
			onClick={()=>{
				setActiveLink((prevActiveLink)=>"game")

			}}>
			Home <FaGamepad /></Link>
			<Link 
			to="/gift"
			className={activeLink === "product" ? `${s.content1} ${s.activeLink}` : s.content1}
			onClick={()=>{
				setActiveLink((prevActiveLink)=>"product")

			}}>
			Gifts <FaGift/></Link>
			<Link 
			to="/leaders"
			className={activeLink === "leaders" ? `${s.content1} ${s.activeLink}` : s.content1}
			onClick={()=>{
				setActiveLink((prevActiveLink)=>"leaders")

			}}>
			Leaders <GiTrophyCup/></Link>
			<Link 
			to="/friends"
			className={activeLink === "friends" ? `${s.content1} ${s.activeLink}` : s.content1}
			onClick={()=>{
				setActiveLink((prevActiveLink)=>"friends")

			}}>
			Friends <FaUserFriends/></Link>
			<Link 
			to="/earn"
			className={activeLink === "earn" ? `${s.content1} ${s.activeLink}` : s.content1}
			onClick={()=>{
				setActiveLink((prevActiveLink)=>"earn")

			}}>
			Earn <FaTasks/></Link>
		</div>
		</div>
		)
}

export default Menu;