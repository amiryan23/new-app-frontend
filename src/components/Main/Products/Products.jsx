import s from './Products.module.scss'
import { Typewriter } from 'react-simple-typewriter'
import React,{useState,useRef,useEffect,useContext} from 'react'
import { MyContext } from './../../../context/Context'
import axios from 'axios'
import { IoCheckmarkDoneSharp,IoLockClosed } from "react-icons/io5";
import CountUp from 'react-countup';
import { IoKeySharp } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { useReward } from 'react-rewards';


const Products = () => {
	let squad = localStorage.getItem("SquadSelected")
	let helper2 = localStorage.getItem("helper2");
	const { thisUser,setThisUser,users,tasks,setTasks,setNotific,referralUsers} = useContext(MyContext);
	const [openModal,setOpenModal] = useState(true)
	const [animation,setAnimation] = useState(true)
	const [openModal2,setOpenModal2] = useState(false)
	const [thisProduct,setThisProduct] = useState(null)
	const [mySquad,setMySquad] = useState(null)
	const btn1 = useRef()
	const animBlock1 = useRef()
	const animBlock2 = useRef()
	const dialogRef2 = useRef() 

	const {reward: confettiReward, isAnimating: isConfettiAnimating} = useReward('confettiReward', 'confetti');


	let timer1;
	let timer2;

	

	useEffect(()=>{
		if(openModal === true && animBlock1.current && animBlock2.current && btn1.current){
			timer1 = setTimeout(()=>{
				animBlock1.current.classList.add(s.animBlock1)
	 			animBlock2.current.classList.add(s.animBlock2)
			},250)	
			timer2 = setTimeout(()=>{btn1.current.classList.add(s.animBtn)},7000)
		} 
		return () => {
			clearTimeout(timer2)
			clearTimeout(timer1)
			
		}
	},[])


	useEffect(()=>{
		if(!openModal || helper2 === "is_read" ){
			setAnimation(false)
		} else {
			setAnimation(true)
		}

		return () => {
			setAnimation(true)
		}
	},[openModal])

		const animBlock4 = useRef();
		let timer4;


		useEffect(()=>{
				if(openModal2 && animBlock4.current){
					timer4 = setTimeout(()=>{animBlock4.current.classList.add(s.animBlock4)},50)
				} 

				return()=> {
					clearTimeout(timer4)
				}
		},[openModal2])


const updateTeam = async (newTeam) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/select-team`, {
      telegram_id: thisUser?.telegram_id, 
      team: newTeam
    });
    setThisUser({...thisUser, team: newTeam});
    setOpenModal2((prevOpenModal2)=>false)
    console.log('Пользователь обновлён:', response.data);
  } catch (error) {
    console.error('Ошибка при обновлении команды:', error);
  }
};

const usersJoinedTeam = users ? users.filter(user => user.team === thisUser?.team).length + 1 : "" 

const  earnedPoints = users ? users.filter(user => user.team === thisUser?.team).map(user => user.points).reduce((a, b) => a + b, 0) : ""


const handleClaimTask = async (taskId, keysReward) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/claimKey`, {
      taskId,
      telegram_id: thisUser?.telegram_id,
    });
    console.log(response.data.message);

    
    setThisUser({ ...thisUser, keysForCode: thisUser?.keysForCode + keysReward });

    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: [...task.is_completed, thisUser?.telegram_id] }
          : task
      )
    );

    
    setNotific('Claimed');
    confettiReward()
  } catch (error) {
    console.error('Error claiming task:', error.response?.data || error.message);
  }
};

			const taskElves1 = tasks ?
	tasks.filter(task=> task.type === 'elvesKey').map(task=>  
							!task.is_completed.includes(thisUser?.telegram_id)
							?
						<div className={referralUsers?.length >= task.earnedPoints ? `${s.itemElves1} ${s.taskCompleted}` : s.itemElves1} 
						onClick={()=>{referralUsers?.length >= task.earnedPoints && handleClaimTask(task.id,task.reward)}}>
						<span className={s.miniBlock1}>
							<span className={s.taskItem1}>{task.description} <span className={s.taskMiniItem}>{`${referralUsers?.length || 0}/${task.earnedPoints}`}</span></span>
							<span className={s.taskItem2}>+{task.reward} <IoKeySharp/></span>
						</span>
					</div>
							:
						<div className={s.itemElves1}>
						<span className={s.miniBlock1}>
							<span className={s.claimed}><MdDone/></span>
						</span>
					</div>
						)
	: ""

				const taskDeers1 = tasks ?
	tasks.filter(task=> task.type === 'deersKey').map(task=>  
							!task.is_completed.includes(thisUser?.telegram_id)
							?
						<div className={thisUser?.points >= task.earnedPoints ? `${s.itemDeers1} ${s.taskCompleted}` : s.itemDeers1} 
						onClick={()=>{thisUser?.points >= task.earnedPoints && handleClaimTask(task.id,task.reward)}}>
						<span className={s.miniBlock1}>
							<span className={s.taskItem1}>{task.description} <span className={s.taskMiniItem}>{`${thisUser?.points}/${task.earnedPoints}`}</span></span>
							<span className={s.taskItem2}>+{task.reward} <IoKeySharp/></span>
						</span>
					</div>
							:
						<div className={s.itemDeers1}>
						<span className={s.miniBlock1}>
							<span className={s.claimed}><MdDone/></span>
						</span>
					</div>
						)
	: ""


const handleClaimTaskWithPoints = async (taskId , reward) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/claim-with-points`, {
      taskId,
      telegram_id: thisUser?.telegram_id,
    });
    console.log(response.data.message);
    setThisUser({...thisUser,points:thisUser?.points + reward})
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_completed: [...task.is_completed, thisUser?.telegram_id] }
          : task
      )
    );
    setNotific("Claimed")
    confettiReward()
  } catch (error) {
    console.error('Error claiming task:', error.response?.data || error.message);
  }
};


				const taskElves2 = tasks ?
	tasks.filter(task=> task.type === 'elvesPoints').map(task=>  
							!task.is_completed.includes(thisUser?.telegram_id)
							?
						<div className={thisUser?.points >= task.earnedPoints ? `${s.itemElves2} ${s.taskCompleted}` : s.itemElves2} 
						onClick={()=>{thisUser?.points >= task.earnedPoints && handleClaimTaskWithPoints(task.id,task.reward)}}>
						<span className={s.miniBlock1}>
							<span className={s.taskItem1}>{task.description} <span className={s.taskMiniItem}>{`${thisUser?.points}/${task.earnedPoints}`}</span></span>
							<span className={s.taskItem2}>+{task.reward} <img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" /></span>
						</span>
					</div>
							:
						<div className={s.itemElves1}>
						<span className={s.miniBlock1}>
							<span className={s.claimed}><MdDone/></span>
						</span>
					</div>
						)
	: ""

			const taskDeers2 = tasks ?
	tasks.filter(task=> task.type === 'deersPoints').map(task=>  
							!task.is_completed.includes(thisUser?.telegram_id)
							?
						<div className={referralUsers?.length >= task.earnedPoints ? `${s.itemDeers2} ${s.taskCompleted}` : s.itemDeers2} 
						onClick={()=>{referralUsers?.length >= task.earnedPoints && handleClaimTaskWithPoints(task.id,task.reward)}}>
						<span className={s.miniBlock1}>
							<span className={s.taskItem1}>{task.description} <span className={s.taskMiniItem}>{`${referralUsers?.length || 0}/${task.earnedPoints}`}</span></span>
							<span className={s.taskItem2}>+{task.reward} <img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" /></span>
						</span>
					</div>
							:
						<div className={s.itemDeers2}>
						<span className={s.miniBlock1}>
							<span className={s.claimed}><MdDone/></span>
						</span>
					</div>
						)
	: ""

	return (
		<div className={s.megaContainer}>
			{helper2 !== "is_read" 
			? <dialog className={s.helpContainer} open={openModal}>
				<div className={s.helpContent}>
				<div className={s.item1} ref={animBlock1}>
					<img src="https://i.ibb.co/hdnM00R/person.png" alt="" />
				</div>
				<div className={s.item2} ref={animBlock2}>
			<Typewriter
            words={['Now it’s time to choose your squad. Will you join the brave Elves, masters of riddles and agility? Or will you team up with the swift and strong Deers, ready to tackle any challenge? Choose wisely — there’s no turning back!']}
            
            cursor
            cursorStyle=''
            typeSpeed={25}
            deleteSpeed={0}
            delaySpeed={1000}

          />					
				</div>
			<div className={s.item3}>
				<button 
				ref={btn1} 
				onClick={()=>{
					setOpenModal((prevOpenModal)=>false)
					localStorage.setItem("helper2", "is_read");
				}
			}>Okay!</button>
			</div>
				</div>
			
			</dialog> 
			: "" }
			<div className={s.miniContainer}>
				<div className={s.megaContent}>
					
				<div className={animation ? s.content : `${s.content} ${s.animBlock4}`}>
					<span className={s.miniItem1}>TEAM</span>
					<span className={s.miniItem2}>CHOOSE A TEAM</span>
					<span className={s.miniItem3}>MAYBE IT MEANS SOMETHING?</span>
					
				</div>
			{thisUser?.team !== null 
			?	""

				// <div className={s.miniContent}>
				// <div 
				// className={ animation ? s.content1 : `${s.content1} ${s.animBlock3} ${s.selectedTeam}`}>
				// 	<span className={s.miniItem1}>
				// 		Deers Team
				// 	</span>
				// 	<span className={s.miniItem2}>
				// 	{thisUser?.team === "Deers" ? <IoCheckmarkDoneSharp /> : ""}
				// 	</span>
				// </div>
				// <div className={animation ? s.content2 : `${s.content2} ${s.animBlock3} ${s.selectedTeam}`} onClick={()=>{console.log(thisUser?.team)}}>
				// 	<span className={s.miniItem1}>
				// 		Elves Team
				// 	</span>
				// 	<span className={s.miniItem2} >
				// 	{thisUser?.team === "Elves" ? <IoCheckmarkDoneSharp /> : ""}
				// 	</span>
				// </div>
				// </div>	
					 

			:	
				<div className={s.miniContent}>
				<div 
				className={ animation ? s.content1 : `${s.content1} ${s.animBlock3}`}
				onClick={()=>{
					setOpenModal2((prevOpenModal2)=>true)
					setMySquad("Deers")
				}}
				 >
					<span className={s.miniItem1}>
						Deers Team
					</span>
					<span className={s.miniItem2}>
						{/* <img src={squad1} alt="" /> */}
					</span>
				</div>
				<div className={animation ? s.content2 : `${s.content2} ${s.animBlock3}`}
				onClick={()=>{
					setOpenModal2((prevOpenModal2)=>true)
					setMySquad("Elves")
				}}
				 >
					<span className={s.miniItem1}>
						Elfs Team
					</span>
					<span className={s.miniItem2}>
						{/* <img src={squad2} alt="" /> */}
					</span>
				</div>
				</div> }
				{thisUser?.team !== null
				? 
				<div className={s.teamMegaContainer}>
				<div className={animation ? s.teamContainer : `${s.teamContainer} ${s.animBlock5}`}>
					<div className={s.teamContent}>
							<div className={s.content1}>Team {thisUser?.team}</div>
							<div className={s.content2}>
								<span className={s.item1}>
								<span className={s.miniItem1}>&#128100;</span>
								<span className={s.miniItem2}>Users Joined</span>
								<span className={s.miniItem3}>{usersJoinedTeam}</span>
								</span>
								<span className={s.item1}>
								<span className={s.miniItem1}>&#x1F4B0;</span>
								<span className={s.miniItem2}>Earned Points</span>
								<span className={s.miniItem3}><CountUp end={earnedPoints} preserveValue={true}/></span>
								</span>
								<span className={s.item1}>
								<span className={s.miniItem1}>&#127775;</span>
								<span className={s.miniItem2}>Stars Collected</span>
								<span className={s.miniItem3}>Soon</span>
								</span>
							</div>
					</div>
				</div>
				<div className={s.dailyTasksContainer}>
				<div className={s.Block1} id="confettiReward">{thisUser?.team === "Elves" ? "Tasks For Elves" : "Tasks For Deers"}</div>
				<div className={s.Block2}>
				{thisUser?.team === "Elves" 
				?
				<>
				{taskElves1}
				{taskElves2}
				</>
				: 
				<>
				{taskDeers1}
				{taskDeers2}
				</>
				}
				</div>
				</div>
				</div>
			   :  
			   <div className={s.teamMegaContainer}>
			   <div className={animation ? s.teamContainer : `${s.teamContainer} ${s.animBlock5}`}>
					<div className={s.closedContent}>
  						<IoLockClosed/>
					</div>
				</div>
				</div>}
				</div>
			</div>
	
				{openModal2 
				?		<dialog className={s.helpContainer2} ref={dialogRef2} >
					<div className={s.megaContent} ref={animBlock4}>
						<div className={s.content1}>
							<span className={s.item1}>Are you going to join the squad {mySquad}</span>
							<span className={s.item2}>
								<button className={s.btn1} onClick={()=>{updateTeam(mySquad)}}>Join</button>
								<button className={s.btn2} onClick={()=>{setOpenModal2((prevOpenModal2)=>false)}}>Exit</button>
							</span>

						</div>
						</div>
				</dialog>
				: ""}
				
			
		</div>
		)
}

export default Products;