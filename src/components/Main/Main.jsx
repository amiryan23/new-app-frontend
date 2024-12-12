import s from './Main.module.scss'
import HomePage from './HomePage/HomePage'
import Products from './Products/Products'
import Level1 from './../Levels/Level1/Level1'
import Leaders from './Leaders/Leaders'
import Earn from './Earn/Earn'
import Friends from './Friends/Friends'
import Wallet from './Wallet/Wallet'
import Shop from './Shop/Shop'
import WheelGame from './miniGames/Wheel/Wheel'
import ClaimPoints from './ClaimPoints/ClaimPoints'
import EarnBlocks from './EarnBlocks/EarnBlocks'
import { Route,Routes,useParams  } from 'react-router-dom';


const Main = () => {

	const {id} = useParams()


	return (
		<main className={s.megaContainer}>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/products" element={<Products/>} />
			<Route path="/level/:id" element={<Level1/>} />
			<Route path="/leaders" element={<Leaders/>} />
			<Route path="/earn" element={<Earn/>} />
			<Route path="/friends" element={<Friends/>} />
			<Route path="/wallet" element={<Wallet/>} />
			<Route path="/shop" element={<Shop/>} />
			<Route path="/wheel" element={<WheelGame/>} />
			<Route path="/claimPoints" element={<ClaimPoints/>} />
			<Route path="/earnBlocks" element={<EarnBlocks/>} />
		</Routes>
		</main>
		)
}

export default Main