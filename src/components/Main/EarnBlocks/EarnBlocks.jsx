import s from './EarnBlocks.module.scss'
import {useState,useEffect,useContext,useRef} from "react"
import axios from 'axios'
import { IoKeySharp } from "react-icons/io5";
import { MyContext } from './../../../context/Context';
import {Link} from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import MiniLoader from './../../MiniLoader/MiniLoader'
import { CiNoWaitingSign } from "react-icons/ci";


const EarnBlocks = () => {

	const [blocks,setBlocks] = useState(null)
	const [openModal,setOpenModal] = useState(false)
	const [thisBlockData,setThisBlockData] = useState(null)
	const [viewBlock,setViewBlock] = useState(false)
	const [newPrice,setNewPrice] = useState(null)
	const [loading,setLoading] = useState(false)

	const { thisUser, setThisUser, setNotific } = useContext(MyContext);

const animBlock = useRef()

let timer;
	  useEffect(() => {
   
    axios.get(`${process.env.REACT_APP_API_URL}/blocks`)
      .then((response) => {
        setBlocks(response.data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
      });

  }, []);

	  useEffect(()=>{
	 if(animBlock.current && blocks){
		timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)
	}

     return () => {
		clearTimeout(timer)
	}
	  },[blocks])

	  const getBlockData = (blockId,price) => {
	  	setOpenModal(true)
	  	setThisBlockData({
	  		id:blockId,
	  		name:`Block#${blockId}`,
	  		price:price
	  	})
	  }

	      const handleBuyBlock = async () => {
	      	setLoading(true)
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/blocks/buy`, {
                telegram_id: thisUser?.telegram_id,
                block_id: thisBlockData?.id
            });

            setOpenModal(false)
            setNotific(`Block successfully purchased`)

        setBlocks(prevBlocks => 
            prevBlocks.map(block => 
                block.id === thisBlockData?.id 
                    ? {
                        ...block, 
                        owner: thisUser?.telegram_id, 
                        owner_photo_url: thisUser?.photo_url, 
                        owner_first_name: thisUser?.first_name ,
                        is_selling:false
                    }
                    : block
            )
        );
        setThisUser({...thisUser,keysForCode:thisUser?.keysForCode - thisBlockData.price})
        setLoading(false)
        } catch (error) {
        	setLoading(false)
        	console.log(error)
        }
    };

    const handleSellBlock = async ( new_price) => {
    	setLoading(true)
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/blocks/sell`, {
            user_id:thisUser?.telegram_id, 
            block_id:thisBlockData?.id, 
            new_price 
        });

       
              setBlocks(prevBlocks => 
            prevBlocks.map(block => 
                block.id === thisBlockData?.id 
                    ? {
                        ...block, 
                        owner: thisUser?.telegram_id, 
                        owner_photo_url: thisUser?.photo_url, 
                        owner_first_name: thisUser?.first_name ,
                        is_selling:true,
                        price:new_price
                    }
                    : block
            )
        );
             setLoading(false)
             setViewBlock(false)
             setNotific("Added for sale")
        
    } catch (error) {
         setLoading(false)
        if (error.response) {
            console.error('Ошибка на сервере:', error.response.data.error);
        } else {
            console.error('Ошибка запроса:', error.message);
        }
    }
};

	const handleViewBlock = (blockId,price) => {
		setViewBlock(true)
	  	setThisBlockData({
	  		id:blockId,
	  		name:`Block#${blockId}`,
	  		price:price
	  	})
	}




	  const newBlocks = blocks 
	  ?
	   blocks.map(m=> 
	   	<div className={s.blockContent} onClick={()=>{
	   		(m.is_selling && m.owner !== thisUser?.telegram_id && getBlockData(m.id,m.price)) || (thisUser.telegram_id === m.owner && handleViewBlock(m.id,m.price))}}>
	   		<div className={s.content1}>Block#{m.id}</div>
	   		<div className={s.content2}>
	   			{!m.owner
	   			? <><span className={s.item1}>?</span><span className={s.item2}>Owner</span><span className={s.item3}>Empty</span></> 
	   			: <><img src={m.owner_photo_url} className={s.item1} /><span className={s.item2}>Owner</span>
	   			<span className={s.item3}>{m.owner_first_name?.length > 12 ? `${m.owner_first_name.slice(0,12)}...` : m.owner_first_name }</span></> }
	   		</div>
	   		<div className={s.content3}>
	   			{m.is_selling 
	   			? <span className={s.item1}>{m.price} <IoKeySharp/></span>
	   			: <span className={s.item2}>Not for sale</span>}
	   		</div>
	   		<div className={s.content4}>
	   			<span className={s.item1}>{m.reward}<img src="https://i.ibb.co/1Zg54G1/coin.png" alt=""/>/   h</span>
	   		</div>
	   </div>) 
	  : ""




	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer}>
			<div className={s.content1}>
			<Link to="/" className={s.content}><RiArrowGoBackLine/></Link>
			<Link to='/shop' className={s.item}>{thisUser?.keysForCode}<IoKeySharp/></Link>
			</div>
				<div className={s.blockContainer} ref={animBlock}>
					{newBlocks}	
				</div>
				{!blocks && <MiniLoader/>}
				{openModal ?
				<div className={s.modalBuying}>
					<div className={s.contentBuying}>
						<div className={s.modalContent1}>{`Are you going to buy ${thisBlockData.name} for ${thisBlockData.price} `}<IoKeySharp/> ?</div>
						<div className={s.modalContent2}>
							<button className={s.btn1} 
							disabled={(thisUser?.keysForCode < thisBlockData?.price || loading) ? true : false} 
							onClick={handleBuyBlock}>
							{loading ? <CiNoWaitingSign color="whitesmoke" size="17"/> : "Yes"}</button>
							<button className={s.btn2}  
							onClick={()=>setOpenModal(false)}>
							No</button>
						</div>
					</div>
				</div>
				: ""}
				{viewBlock 
				? <div className={s.viewContainer}>
					<div className={s.viewContent}>
						<div className={s.content1}>{thisBlockData?.name}</div>
						<div className={s.content2}>
							{blocks?.filter(m=> m.id === thisBlockData.id).map(block=>
								<>
								<img src={block.owner_photo_url} alt=""/>
								<span className={s.miniItem1}>Owner</span>
								<span className={s.miniItem2}>{block.owner_first_name}</span>
								</>)}
						</div>
						<div className={s.content3}>
							* If you are going to sell this block, you cannot cancel the sale, you can only change the price
						</div>
						<div className={s.content4}>
							<span><IoKeySharp/>(50-999)</span>
							<input type="text" value={newPrice} min={50} max={999} pattern="\d*" maxLength={3} required
							onChange={(e)=>{setNewPrice(e.target.value)}}/>
						</div>
						<div className={s.content5}>
							<button disabled={(!newPrice || loading) && true} className={s.sellBtn} onClick={()=>{handleSellBlock(newPrice)}}>{loading ? <CiNoWaitingSign color="whitesmoke" size="17"/> : "Sell"}</button>
							<button className={s.closeBtn} onClick={()=>{setViewBlock(false)}}>Exit</button>
						</div>
					</div>
				  </div>
				: ""}
			</div>
		</div>
		)
}

export default EarnBlocks


