import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {

  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  return (
    <div> 
      <head> 
        <title> Whitelist dApp</title>
        <meta name="description" content="Whitelist-dApp"></meta>
      </head>
      <div className ={styles.main}>
        <h1 className={styles.title}>
          Welcome to Crypto Devs!
        </h1>

        <div className={styles.description}> {numOfWhitelisted} have already joined the Whitelist.</div>
      </div>
      <div>
        <img className={styles.image} src="./crypto-devs.svg"></img>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; from Crypto Devs
      </footer>
    </div>
  )
}
