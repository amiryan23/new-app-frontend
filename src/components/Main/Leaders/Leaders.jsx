import s from './Leaders.module.scss'
import {useEffect,useContext,useRef,useState} from 'react'
import { MyContext } from './../../../context/Context';
import { FaSnowman } from "react-icons/fa";

const Leaders = () => {

	const { thisUser,levels,users,gifts } = useContext(MyContext);
	const [topUsers,setTopUsers] = useState(true)

	const animBlock = useRef()

	let timer;
	useEffect(()=>{
		if(animBlock.current){
			timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)	
		}

		return ()=> {clearTimeout(timer)}
	},[])

const giftCounts = gifts.reduce((acc, gift) => {
  if (gift.owner) {
    if (!acc[gift.owner]) {
      acc[gift.owner] = {
        limite: 0, // Сумма limite
        photo_url: gift.owner_photo_url,
        first_name: gift.owner_first_name,
        telegram_id: gift.owner,
      };
    }
    acc[gift.owner].limite += gift.limite || 0; // Добавляем limite (если есть)
  }
  return acc;
}, {});

const sortedGiftOwners = Object.values(giftCounts).sort((a, b) => b.limite - a.limite)

	const tablePoints = users 
	? users.sort((a, b) => b.points - a.points).map((user,index)=> 
		<div className={s.content} key={index}>
		<div className={s.miniItem1}>
		<span className={s.block1}>#{index + 1}
		{user?.photo_url !== ""
		? <img src={user.photo_url} alt="" /> 
		:  <span className={s.noPhoto}><FaSnowman/></span> }
		{user.team}</span>
		<span className={s.block2}>{user.first_name.length > 10 ? `${user.first_name.slice(0,10)}...` : user.first_name}</span>
		</div>
		<div className={s.miniItem2}>{user.points}</div>
	</div>)
	: ""

const tableGifts = sortedGiftOwners.map((user, index) => (
  <div className={s.content} key={index}>
    <div className={s.miniItem1}>
      <span className={s.block1}>
        #{index + 1}
        {user.photo_url ? (
          <img src={user.photo_url} alt="" />
        ) : (
          <span className={s.noPhoto}>
            <FaSnowman />
          </span>
        )}
        
      </span>
      <span className={s.block2}>
        {user.first_name.length > 10
          ? `${user.first_name.slice(0, 10)}...`
          : user.first_name}
      </span>
    </div>
    <div className={s.miniItem2}>{user.limite}</div> {/* Отображаем сумму limite */}
  </div>
));

	return (
		<div className={s.megaContainer} >
		<div className={s.miniContainer} ref={animBlock}>
		<div className={s.description}>
		<span className={s.miniItem1}>&#127942;</span>
		<div className={s.miniItem2} >Leaderboard</div>
		<div className={s.typeTop}>
		<span className={topUsers ? `${s.item1} ${s.active}` : s.item1} onClick={()=>{setTopUsers(true)}}>Points <img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" /></span>
		<span className={!topUsers ? `${s.item2} ${s.active}` : s.item2} onClick={()=>{setTopUsers(false)}}>Gifts <img src="https://i.ibb.co/2gD71Jp/Gift.png" alt="" /></span>
		</div>
		</div>
		<div className={s.container} >
			<div className={s.item2}>
			<div className={s.Block1}>
			<div className={s.miniBlock1}>
			<span className={s.golden}>{topUsers ? tablePoints[0] : tableGifts[0]}</span>
			</div>
			<div className={s.miniBlock2}>
			<span className={s.silver}>{topUsers ? tablePoints[1] : tableGifts[1]}</span>
			<span className={s.bronze}>{topUsers ? tablePoints[2] : tableGifts[2]}</span>
			</div>
			</div>
			<div className={s.Block2}>
			{topUsers ? tablePoints?.slice(3,100) : tableGifts?.slice(3,100) }
			</div>
			</div>
		</div>
		</div>
		</div>
		)
}

export default Leaders