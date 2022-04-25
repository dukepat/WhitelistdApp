import Head from 'next/head';
// import Image from 'next/image';
import {useRef, useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
    const web3ModalRef = useRef();


    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 4) {
            window.alert("Change the network to Rinkeby");
            throw new Error("Change network to Rinkeby");
        }

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;

    };

    // addAddressToWhitelist: Adds the current connected address to the whitelist
    const addAddressToWhitelist = async () => {
        try {

            const signer = await getProviderOrSigner(true);
            const whitelistContract = new Contract(
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                signer
            );

            const tx = await whitelistContract.addAddressToWhitelist();
            setLoading(true);

            await tx.wait();

            await getNumberOfWhitelisted();
            setJoinedWhitelist(true);
        } catch (err) {
            console.error(err);

        }
    };

    //getNumberOfWhitelisted: gets the number of whitelisted address

    const getNumberOfWhitelisted = async () => {
        try {
            const provider = await getProviderOrSigner();
            const whitelistContract = new Contract(
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                provider
            );
            const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
            setNumOfWhitelisted(_numberOfWhitelisted);

        } catch (err){
            console.error(err);
        }
    };

    // checkIfAddressInWhitelist: checks if the address is in whitelist

    const checkIfAddressInWhitelist = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const whitelistContract = new Contract(
                WHITELIST_CONTRACT_ADDRESS,
                abi,
                signer
            );

            const address = await signer.getAddress();
            const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
                address
            );
            setJoinedWhitelist(_joinedWhitelist);
        } catch(err) {
            console.error(err);
        }

    }


    const connectWallet = async() => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
            checkIfAddressInWhitelist();
            getNumberOfWhitelisted();
        } catch (err) {
            console.error(err);
        }

    };

    // renderButton: Returns a button based on the state of the dApp
    const renderSomething = () => {
        if (walletConnected === false) {
            return (
            <div className={styles.description}> 
                Ensure you have a metamask extension installed, then click on <b>connect your wallet</b> below!
            </div>
            );
        }
    };

    const renderButton = () => {
        if (walletConnected) {
            if (joinedWhitelist) {
                return (
                <div className={styles.description}>
                    Thanks for joining the Whitelist!
                </div>
                );
                } else if (loading) {
                    return <button className={styles.button}>Loading...</button>
                }
                else {
                    return (
                        <button onClick={addAddressToWhitelist} className={styles.button}>
                            Join the Whitelist
                        </button>
                    );
            }
        } else {
            return (
                <button onClick={connectWallet} className={styles.button}>
                    Connect your wallet
                </button>
            );
        }

    };

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disabledInjectedProvider: false,
            });

            connectWallet();
        }
    }, [walletConnected]);

    return ( 
            <div>
                <Head>
                    <title> Whitelist dApp </title>  
                    <meta name = "description" content = "Whitelist-dApp"/> 
                    <link rel="icon" href="/favicon.ico" /> 
                </Head>  
                    {renderSomething()}
                <div className = { styles.main }>
                    <h1 className = { styles.title }> Welcome to Crypto Devs!</h1>
                    <p></p>
                <div className={styles.description}>
                    Its an NFT collection for Crypto developers 2.
                </div>
                <div className = { styles.description } > { numOfWhitelisted } have already joined the Whitelist. </div> 
                </div> 
                {renderButton()}
                <div>
                    <img className = { styles.image } src = "./crypto-devs.svg"/> 
                </div> 
                <footer className = { styles.footer }> Made with &#10084; from Duke Dev </footer>                                                       
            </div>
  )
}