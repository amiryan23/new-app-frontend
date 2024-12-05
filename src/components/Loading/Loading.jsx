import s from './Loading.module.scss'
import { InfinitySpin } from 'react-loader-spinner'
import { MyContext } from './../../context/Context'
import React,{useContext} from 'react'
import CountUp from 'react-countup';

const Loading = () => {

	const { isLoaded } = useContext(MyContext);


	return (
		<div className={s.megaContainer}>
		<div className={s.miniContainer}>
		<div className={s.content1}>
<InfinitySpin
  visible={true}
  width="200"
  color="#999"
  ariaLabel="infinity-spin-loading"
  />	
  </div>
  <div className={s.content2}>
  	<span className={s.miniItem1}>
  		<span className={s.loading} style={{width:`${isLoaded}%`}}></span>
  	</span>
  	<span className={s.miniItem2}><CountUp end={isLoaded} duration={1} preserveValue={true}/>%</span>
  </div>
  </div>		
		</div>
		)
}

export default Loading