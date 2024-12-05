import s from './HomePage.module.scss'
import Person from './../../../assets/person.png'
import { Typewriter } from 'react-simple-typewriter'
import {Link} from 'react-router-dom'
import { MyContext } from './../../../context/Context'
import React,{useContext,useRef,useEffect} from 'react'
import { IoLockClosed } from "react-icons/io5";
import { IoKeySharp } from "react-icons/io5";

const HomePage = () => {
	let helper1 = localStorage.getItem('helper_santa_1')
	 const {  activeLink,isLoaded,setActiveLink,thisUser,levels,setLevels,setNotific} = useContext(MyContext);

	 const animBlock1 = useRef()
	 const animBlock2 = useRef()
	 const animBlock3 = useRef()

	 let timer;

	 useEffect(()=>{
	 	if(animBlock1.current && animBlock2.current && animBlock3.current){
	 		timer = setTimeout(()=>{
	 			animBlock1.current.classList.add(s.animBlock1)
	 			animBlock2.current.classList.add(s.animBlock2)
	 			animBlock3.current.classList.add(s.animBlock3)

	 		},50)
	 	}

	 	return ()=> {
	 		clearTimeout(timer)
	 	}
	 },[])




	 const levelsContainer = levels 
	 ? levels.map(m=>
		m.is_ended && !m.is_completed.includes(thisUser?.telegram_id)
	 	? <span key={m.id} className={`${s.item} ${s.ended}`}>{m.level}</span> 
	 	:	  
	 	m.is_closed 
	 	? <span  key={m.id}className={s.item}><IoLockClosed/></span>
	 	: 
	 	m.is_completed.includes(thisUser?.telegram_id) 
	 	? <span key={m.id} className={`${s.item} ${s.completed}`}>{m.level}</span>
	 	: <Link key={m.id} to={`/level/${m.level}`} className={s.item}>{m.level}</Link>
	 	
	 	)
	 : "" 

	return (
		<div className={s.megaContainer}>
		<div className={s.Container}>
			<div className={s.miniContainer1}>
			<div className={s.content1} ref={animBlock1}>
				<img src="https://i.ibb.co/hdnM00R/person.png" alt="" />
			</div>
			<div className={s.content2} ref={animBlock2}>
			{helper1 === "is_read" 
			? <span className={s.miniCont}>
				<span className={s.santaText}>I give you 3 Keys to solve the riddle. Remember, each wrong answer will take away 1 Key from you, so solve the riddle carefully and without rushing. Best regards, Santa.</span>
				<span className={s.keysItem}>{thisUser?.keysForCode}<IoKeySharp/></span>
				</span>

			:<><Typewriter
            words={["Hi there! 🎅 I’m Santa, and I have a challenge for you! Solve all the riddles across each level, and you’ll earn prizes. Who knows what secrets they hold? Find out if you make it to the end! Good luck! "]}
            
            cursor
            cursorStyle=''
            typeSpeed={30}
            deleteSpeed={0}
            delaySpeed={500}

          /> </>	}
			</div>
			</div>
			<div className={s.miniContainer2} >
				<div className={s.content} ref={animBlock3}>
					{helper1 !== "is_read" 
					? <Link to='/products' onClick={()=>{
						setActiveLink((prevActiveLink)=>"product")
						localStorage.setItem('helper_santa_1',"is_read")
					}}>Okay!
					</Link>
					: ""}
				</div>
			</div>
			<div className={s.miniContainer3}>
			{levelsContainer}
			</div>
			<Link to='/wheel' className={s.linkForKeysContainer}>
				{/* <img src="https://i.ibb.co/4Zx5B2h/IMG-6672-Photoroom.png" className={s.miniItem1}/> */}
				<span className={s.miniItem1}>&#x1f3a1;</span>
				<span className={s.miniItem2}>Wheel</span>
			</Link>
			</div>
		</div>
		)
}

export default HomePage