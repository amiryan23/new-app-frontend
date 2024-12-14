import s from './CreateGift.module.scss'
import { IoCloseCircle } from "react-icons/io5";
import React,{useContext,useRef,useEffect,useState} from 'react'
import { FaUser } from "react-icons/fa";
import CountUp from 'react-countup';
import axios from 'axios'
import { MyContext } from './../../../../context/Context'

const CreateGift = ({openCreateModal,setOpenCreateModal}) => {

	    const [giftData, setGiftData] = useState({
        isPrivate: false,
        description: '',
        link: '',
        limite: 1
    });
	    const [loading,setLoading] = useState(false)
	    const {  thisUser,setThisUser,setNotific} = useContext(MyContext);
    
    const pointsPerPerson = 500; 
    
    const calculateGiftPrice = () => {
        return giftData.limite * pointsPerPerson; 
    };

        const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGiftData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const createGift = async () => {
    	setLoading(true)
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/gifts/create-gift`,{
        	telegram_id:thisUser?.telegram_id,
         	isPrivate: giftData.isPrivate,
       	    description: giftData.description,
        	link: giftData.link || null,
      	    limite: giftData.limite       	
        });
        setOpenCreateModal(false)
        setLoading(false)
        setThisUser({...thisUser,points:thisUser?.points - (giftData.limite * 500)})
        setNotific("Sended to moderation")
    } catch (error) {
        console.error('Error creating gift:', error.response?.data?.error || error.message);
        alert('Failed to create gift');
        setLoading(false)
    }
};

	return (
		openCreateModal ?
		<div className={s.megaContainer}>
			<div className={s.modalContent}>
			<div className={s.content1}>
			<span className={s.item1}></span>
			<span className={s.item2}>Gift Parameters</span>
				<span className={s.item3}>
					<span onClick={()=>{
						// setGiftModal(false)
						// setLoading(false)
						// setGiftOpening(false)
						// setGiftTaskId(null)
						setOpenCreateModal(false)
					}}><IoCloseCircle/></span>
				</span>
			</div>
            <div className={s.content2}>
                <label>Private</label>
                <span className={s.item1}>* If 'yes' is selected, other users will not see who the gift is from.</span>
                <span className={s.item2}>
                <input
                    type="radio"
                    name="isPrivate"
                    value="true"
                    checked={giftData.isPrivate === true}
                    onChange={() => setGiftData({ ...giftData, isPrivate: true })}
                /> Yes
                <input
                    type="radio"
                    name="isPrivate"
                    value="false"
                    checked={giftData.isPrivate === false}
                    onChange={() => setGiftData({ ...giftData, isPrivate: false })}
                /> No
                </span>
            </div>
            <div className={s.content3}>
                <label>Description</label>
                <span className={s.item1}>*What is your gift created for (this will be visible to all users who open your gift).</span>
                <textarea
                    name="description"
                    value={giftData.description}
                    onChange={handleChange}
                    maxLength={300}
                    required
                    placeholder="Enter gift description"
                />
            </div>
            <div className={s.content4}>
                <label>Link</label>
                <span className={s.item1}>*Only Telegram links (Not required)</span>
                <input
                    type="url"
                    name="link"
                    value={giftData.link}
                    onChange={handleChange}
                    placeholder="Optional link"
                />
            </div>
            <div className={s.content5}>
                <label>Limite (1-250)</label>
                <span className={s.item1}><FaUser/>{giftData.limite}</span>
                <input
                    type="range"
                    name="limite"
                    value={giftData.limite}
                    onChange={handleChange}
                    min="1"
                    max="250"
                    required
                />
            </div>
            <div>
                {/* <p>Total cost for the gift: {calculateGiftPrice()} points</p> */}
            </div>
            <button className={s.createBtn} disabled={loading || calculateGiftPrice() > thisUser?.points} onClick={createGift}>
                Create 
                <img src="https://i.ibb.co/2gD71Jp/Gift.png" alt=""/> 
                <CountUp end={calculateGiftPrice()} preserveValue={true} />
                <img className={s.coinimg} src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
            </button>
			</div>
		</div>
		: ""
		)
}

export default CreateGift