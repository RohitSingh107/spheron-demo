import localhost from "../../scripts/31337.json";
import mumbai from "../../scripts/80001.json";
import aadhaar_abi from "../../artifacts/contracts/Aadhaar.sol/Aadhaar.json";
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification, Button, Form } from "web3uikit";
import { ethers } from "ethers";

export default function VerifyProof() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const [verificationResult, setVerificationResult] = useState("N/A");
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex!);

  const contractAddress =
    chainId == 80001
      ? mumbai.aadhaar
      : chainId == 31337
      ? localhost.aadhaar
      : null;

  const abi = aadhaar_abi.abi;

  async function verifyProof(data: any) {
    const proof = JSON.parse(data.data[0].inputResult);

    const solidityProof = [
      proof.pi_a[0],
      proof.pi_a[1],
      proof.pi_b[0][1],
      proof.pi_b[0][0],
      proof.pi_b[1][1],
      proof.pi_b[1][0],
      proof.pi_c[0],
      proof.pi_c[1],
    ];

    console.log("Verifying proof...");
    const options = {
      abi: abi,
      contractAddress: contractAddress,

      functionName: "verifyProof",
      params: {
        _proof: solidityProof,
      },
    };

    const validity = await runContractFunction({
      params: options,
      onSuccess: () =>
        console.log("Verification Transaction executed successfully."),
      onError: (error: any) => {
        console.log(error.message.toString());
        dispatch({
          type: "error",
          message: "Proof not verified, some error occured",
          title: "Proof Verification",
          position: "topR",
        });
      },
    });
    if (validity) {
      setVerificationResult("Valid");
      dispatch({
        type: "success",
        message: "Proof Verification Transaction Successful.",
        title: "Proof Verification",
        position: "topR",
      });
    } else {
      setVerificationResult("Invalid");
      dispatch({
        type: "warning",
        message: "Proof is Invalid.",
        title: "Proof Verification.",
        position: "topR",
      });
    }
    console.log("Proof Verification Result: ", validity);
  }

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Verify Proof</h1>
      {contractAddress ? (
        <>
          <div>
            <Form
              onSubmit={verifyProof}
              buttonConfig={{
                isLoading: false,
                type: "submit",
                theme: "ghost",
                text: "Verify",
              }}
              data={[
                {
                  name: "Proof",
                  type: "textarea",
                  validation: {
                    required: true,
                  },
                  value: "",
                  key: "proof",
                },
              ]}
              title="Submit Proof"
              id="Main Form"
            />
            <h2 className="text-2xl">
              Result Verification Result: {verificationResult}
            </h2>
          </div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
  // return <div>Hello</div>;
}
