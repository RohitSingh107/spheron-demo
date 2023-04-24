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
  // @ts-ignore
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

  async function createID(data: any) {
    const name = data.data[0].inputResult;
    const dob = data.data[1].inputResult;
    const gender = data.data[2].inputResult;
    const mobileNumber = data.data[3].inputResult;

    console.log("Creating Id...");
    const options = {
      abi: abi,
      contractAddress: contractAddress,

      functionName: "createIdentity",
      params: {
        name: name,
        dob: dob,
        gender: gender,
        mobileNumber: mobileNumber,
      },
    };

    await runContractFunction({
      // @ts-ignore
      params: options,
      onSuccess: () =>
        dispatch({
          type: "success",
          message: "ID created successfully",
          title: "ID Created!",
          position: "topR",
        }),
      onError: (error: any) => {
        console.log(error);
        dispatch({
          type: "success",
          message: "ID created successfully",
          title: "ID Created!",
          position: "topR",
        });
      },
    });
  }

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Create ID</h1>
      {contractAddress ? (
        <>
          <div>
            <Form
              onSubmit={createID}
              buttonConfig={{
                isLoading: false,
                type: "submit",
                theme: "ghost",
                text: "Create Id",
              }}
              data={[
                {
                  name: "Name",
                  type: "text",
                  validation: {
                    required: true,
                  },
                  value: "",
                  key: "name",
                },
                {
                  name: "D.O.B",
                  type: "text",
                  validation: {
                    required: true,
                  },
                  value: "",
                  key: "dob",
                },
                {
                  name: "Gender",
                  type: "text",
                  value: "",
                  key: "gender",
                },
                {
                  name: "Mobile Number",
                  type: "text",
                  validation: {
                    required: true,
                  },
                  value: "",
                  key: "mobileNumber",
                },
              ]}
              title="Create Identity"
              id="Main Form"
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
