import s from './MiniLoader.module.scss'
import { Grid } from 'react-loader-spinner'


const MiniLoader = () => {
	return (
		<div className={s.megaContainer}>
		<div className={s.miniContainer}>
<Grid
  visible={true}
  height="80"
  width="80"
  color="#222"
  ariaLabel="grid-loading"
  radius="12.5"
  wrapperStyle={{}}
  wrapperClass="grid-wrapper"
  />			
  </div>
		</div>
		)
}

export default MiniLoader