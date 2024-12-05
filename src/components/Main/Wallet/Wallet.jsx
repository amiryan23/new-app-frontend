import s from './Wallet.module.scss'
import React,{useState,useRef,useEffect,useContext} from 'react'
import { MyContext } from './../../../context/Context'
import { TonConnectButton,useTonAddress,useTonConnectUI  } from '@tonconnect/ui-react';
import axios from 'axios'
import CountUp from 'react-countup';

const Wallet = () => {

    const userFriendlyAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();


		const { thisUser,setThisUser} = useContext(MyContext);

	const animBlock = useRef()

	let timer;
	useEffect(()=>{
		if(animBlock.current){
			timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},50)	
		}


		return ()=> {clearTimeout(timer)}

	},[])


    useEffect(() => {
        if (userFriendlyAddress && thisUser?.wallet_address !== userFriendlyAddress) {
            sendWalletAddressToServer(userFriendlyAddress);
        }
    }, [userFriendlyAddress]);

    const sendWalletAddressToServer = async (walletAddress) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/update-wallet`, {
                telegramId: thisUser?.telegram_id, // Передаем telegram_id
                walletAddress, // Передаем адрес кошелька
            });

            if (response.data.success) {
                console.log("Кошелек успешно обновлен!");
                setThisUser({...thisUser,wallet_address:userFriendlyAddress})
            } else {
                console.warn("Обновление кошелька не выполнено:", response.data.message);
            }
        } catch (error) {
            console.error("Ошибка при отправке кошелька на сервер:", error);
        }
    };



	return (
		<div className={s.megaContainer}>
			<div className={s.miniContainer} ref={animBlock}>
				<div className={s.content1}>
					<span className={s.miniItem1}>CONNECT YOUR TON WALLET</span>
					<span className={s.miniItem2}>GET YOUR REWARD</span>
					<span className={s.miniItem3}>& COMPLETE FUTURE TASKS</span>
				</div>
				<div className={s.content2}>
					<CountUp end={thisUser?.points} preserveValue={true}/><img src="https://i.ibb.co/1Zg54G1/coin.png" alt="" />
				</div>
				<div className={s.content3}>
					{/* <button onClick={connectWallet}><img src="https://ton.org/download/ton_symbol.png" alt=""/>Connect TON wallet</button> */}
				<TonConnectButton />
				{userFriendlyAddress ? "Wallet Connected" : ""}
				</div>
			</div>
		</div>
		)
}

export default Wallet