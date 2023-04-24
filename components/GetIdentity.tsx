import localhost from "../constants/31337.json";
import mumbai from "../constants/80001.json";
import aadhaar_abi from "../constants/Aadhaar.json";
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification, Button, Form } from "web3uikit";
import { ethers } from "ethers";

export default function CreateID() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const [userID, setUserID] = useState("Not Found");
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex!);

  const contractAddress =
    chainId == 80001
      ? mumbai.aadhaar
      : chainId == 31337
      ? localhost.aadhaar
      : null;

  const abi = aadhaar_abi.abi;

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Get ID</h1>
      {contractAddress ? (
        <>
          <div className="flex flex-col gap-2 justify-items-start w-fit">
            <h2 className="text-2xl">Your ID: {userID}</h2>

            <Button
              id="get-id"
              onClick={async () => {
                const id: any = await runContractFunction({
                  params: {
                    abi: abi,
                    contractAddress: contractAddress,
                    functionName: "getIdentity",
                  },
                  onSuccess: () => console.log("Sucessfully fetched identity."),

                  onError: (error) => console.log(error),
                });
                if (id != undefined) {
                  setUserID(id.toString());
                } else {
                  setUserID("ID not found for this address");
                }
              }}
              text="Get ID"
              theme="primary"
              type="button"
            />
          </div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
  // return <div>Hello</div>;
}
