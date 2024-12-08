import s from './Leaders.module.scss'
import {useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../context/Context';
import { FaSnowman } from "react-icons/fa";

const Leaders = () => {

	const { thisUser,levels,users } = useContext(MyContext);

	const animBlock = useRef()

	let timer;
	useEffect(()=>{
		if(animBlock.current){
			timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)	
		}

		return ()=> {clearTimeout(timer)}
	},[])

	const table = users 
	? users.sort((a, b) => b.points - a.points).map((user,index)=> 
		<div className={s.content} key={index}>
		<div className={s.miniItem1}>
		<span className={s.block1}>#{index + 1}
		{user?.photo_url !== ""
		? <img src={user.photo_url} alt="" /> 
		:  <span className={s.noPhoto}><FaSnowman/></span> }
		{user.team}</span>
		<span className={s.block2}>{user.first_name.length > 15 ? `${user.first_name.slice(0,15)}...` : user.first_name}</span>
		</div>
		<div className={s.miniItem2}>{user.points}</div>
	</div>)
	: ""

	return (
		<div className={s.megaContainer} >
		<div className={s.miniContainer} ref={animBlock}>
		<div className={s.description}>
		<span className={s.miniItem1}>&#127942;</span>
		<div className={s.miniItem2} >Leaderboard</div>
		</div>
		<div className={s.container} >
			<div className={s.item2}>
			<div className={s.Block1}>
			<div className={s.miniBlock1}>
			<span className={s.golden}>{table[0]}</span>
			</div>
			<div className={s.miniBlock2}>
			<span className={s.silver}>{table[1]}</span>
			<span className={s.bronze}>{table[2]}</span>
			</div>
			</div>
			<div className={s.Block2}>
			{table?.slice(3,100) }
			</div>
			</div>
		</div>
		</div>
		</div>
		)
}

export default Leaders