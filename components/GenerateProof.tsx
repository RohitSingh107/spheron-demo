import localhost from "../constants/31337.json";
import mumbai from "../constants/80001.json";
import aadhaar_abi from "../constants/Aadhaar.json";
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification, Button, Form } from "web3uikit";
import { ethers } from "ethers";
// import { stringToAsciiArray, FIXEDARRAYSIZE } from "../../utils/converters";
const snarkjs = require("snarkjs");
// const snarkjs = window.snarkjs;

const FIXEDARRAYSIZE = 100;

function stringToAsciiArray(strs: string[], fixedArraySize: number): string[] {
  var str = concatenateStringsWithSpace(strs);
  str = convertToLowerCase(str);

  const asciiArray: string[] = [];

  for (let i = 0; i < fixedArraySize; i++) {
    if (i < str.length) {
      asciiArray.push(str.charCodeAt(i).toString());
    } else {
      asciiArray.push("0");
    }
  }

  return asciiArray;
}
// console.log(stringToAsciiArray("Hello World", FIXEDARRAYSIZE));

function concatenateStringsWithSpace(strings: string[]): string {
  let concatenatedString: string = "";

  for (let i = 0; i < strings.length; i++) {
    concatenatedString += strings[i];

    if (i !== strings.length - 1) {
      concatenatedString += " ";
    }
  }

  return concatenatedString;
}

function convertToLowerCase(str: string): string {
  let lowerCaseString: string = "";

  for (let i = 0; i < str.length; i++) {
    const charCode: number = str.charCodeAt(i);

    if (charCode >= 65 && charCode <= 90) {
      // Character is an uppercase letter
      lowerCaseString += String.fromCharCode(charCode + 32);
    } else {
      // Character is not an uppercase letter
      lowerCaseString += str[i];
    }
  }

  return lowerCaseString;
}

export default function GenerateProof() {
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

  async function generateProof(data: any) {
    const name = data.data[0].inputResult;
    const dob = data.data[1].inputResult;
    const gender = data.data[2].inputResult;
    const mobileNumber = data.data[3].inputResult;

    console.log("Generating proof...");

    const wasmFilePath = "../build/circuits/checker_js/checker.wasm";
    const finalZkeyPath = "../build/circuits/checker_js/checker_0001.zkey";

    const a = stringToAsciiArray(
      ["Rohit Singh", "10072000", "male", "9319126891"],
      FIXEDARRAYSIZE
    );
    const b = "1";
    const witness = {
      a,
      b,
    };

    const { proof, publicSignals } = await snarkjs.fullProve(
      witness,
      wasmFilePath,
      finalZkeyPath,
      null
    );
    console.log(proof);
  }

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Generate Proof</h1>
      {contractAddress ? (
        <>
          <div>
            <Form
              onSubmit={generateProof}
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
              title="Generate Proof"
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
