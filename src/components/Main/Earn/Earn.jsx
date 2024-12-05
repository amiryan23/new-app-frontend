import s from './Earn.module.scss'
import {Link} from 'react-router-dom'
import React,{useContext,useRef,useEffect,useState} from 'react'
import { MyContext } from './../../../context/Context'
import axios from 'axios'
import { MdDone } from "react-icons/md";
import { useTonAddress  } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk'


const Earn = () => {

	const {  thisUser,setThisUser,levels,setLevels,setNotific,tasks,setTasks,taskCompleted,setTaskCompleted} = useContext(MyContext);

	const userFriendlyAddress = useTonAddress();

	const animBlock = useRef()

	const handleClaimTask = async (taskId, telegramId , reward) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/claim`, {
      taskId,
      telegram_id: telegramId,
    });
    console.log(response.data.message);
    setThisUser({...thisUser,points:thisUser.points + reward})
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: [...task.is_completed, telegramId] }
          : task
      )
    );
     setNotific("Claimed")
  } catch (error) {
    console.error('Error claiming task:', error.response?.data || error.message);
  }
};


const handleClaimTaskWithPoints = async (taskId, telegramId , reward) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/claim-with-points`, {
      taskId,
      telegram_id: telegramId,
    });
    console.log(response.data.message);
    setThisUser({...thisUser,points:thisUser.points + reward})
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: [...task.is_completed, telegramId] }
          : task
      )
    );
    setNotific("Claimed")
  } catch (error) {
    console.error('Error claiming task:', error.response?.data || error.message);
  }
};

let timer;

useEffect(()=>{
	if(animBlock.current){
		timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)
	}

	return () => {
		clearTimeout(timer)
	}
},[])

	const taskTableLinks = tasks ?
	tasks.filter(task=> task.type === 'link').map(task=>  <div className={s.taskContainer} key={task.id}>
						<span className={s.item1}>
							<img src={task.imgUrl} alt="" />
						</span>
						<span className={s.item2}>
							{task.description}
						</span>
						{task.is_completed.includes(thisUser.telegram_id)
						? <span className={s.item3}>
							<span className={s.claimed}><MdDone/></span>
							<span>+{task.reward}</span>
						</span> 
						:<span className={s.item3}>
							{taskCompleted === task.id 
							?	<button onClick={()=>{handleClaimTask(task.id,thisUser?.telegram_id,task.reward)}}>Claim</button>
							: <span className={s.linkItem} 
								onClick={()=>{
									setTaskCompleted(task.id)
									WebApp.openTelegramLink(task.link)
								}} >Start</span>
							}
							<span>+{task.reward}</span>
						</span>
						}
					</div> )
	: ""

	const taskTableEarn = tasks ?
	tasks.filter(task => task.type === 'earn').map(task =>
		<div className={s.taskContainer} key={task.id}>
						<span className={s.item1}>
							{task.imgUrl
							? <img src={task.imgUrl} alt="" />
							: <span className={s.emoji}><img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" /></span> }
						</span>
						<span className={s.item2}>
							{task.description}
						</span>
						{task.is_completed.includes(thisUser.telegram_id)
						? <span className={s.item3}>
							<span className={s.claimed}><MdDone/></span>
							<span>+{task.reward}</span>
						</span>
						: <span className={s.item3}>
						{thisUser.points >= task.earnedPoints 
						? <button onClick={()=>{handleClaimTaskWithPoints(task.id,thisUser?.telegram_id,task.reward)}}>Claim</button>
						: <button disabled={true}>Claim</button>
					    }
					    <span>+{task.reward}</span>
						</span>
						}

					</div>)
	: ""

	
		const taskTableWallet = tasks ?
	tasks.filter(task=> task.type === 'wallet').map(task=>  <div className={s.taskContainer} key={task.id}>
						<span className={s.item1}>
							<img className={s.walletImg} src={task?.imgUrl} alt="" />
						</span>
						<span className={s.item2}>
							{task.description}
						</span>
						{task.is_completed.includes(thisUser.telegram_id)
						? <span className={s.item3}>
							<span className={s.claimed}><MdDone/></span>
							<span>+{task.reward}</span>
						</span> 
						:<span className={s.item3}>
							{userFriendlyAddress
							?	<button onClick={()=>{handleClaimTaskWithPoints(task.id,thisUser?.telegram_id,task.reward)}}>Claim</button>
							: <Link className={s.linkItem} to="/wallet">Start</Link>
							}
							<span>+{task.reward}</span>
						</span>
						}
					</div> )
	: ""


	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
				<div className={s.content1}>
					<span className={s.miniItem1}>TASKS</span>
					<span className={s.miniItem2}>GET REWARDS</span>
					<span className={s.miniItem3}>FOR COMPLETING QUEST</span>
					
				</div>
				<div className={s.content2}>
				{taskTableLinks}
				{taskTableEarn}
				{taskTableWallet}
				</div>
			</div>
		</div>
		)
}

export default Earn