import Head from "next/head";
import styles from "../styles/Home.module.css";
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header";
import CreateID from "../components/CreateIdentity";
import GetID from "../components/GetIdentity";
import UpdateID from "../components/UpdateIdentity";
import VerifyProof from "../components/VerifyProof";
// import GenerateProof from "../components/GenerateProof";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Decentralized Aadhar</title>
        <meta name="description" content="Decentralized Aadhar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <CreateID />
      <GetID />
      <UpdateID />
      <VerifyProof />
    </div>
  );
}
