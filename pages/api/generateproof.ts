// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groth16 } from "snarkjs";

type Data = {
  name: string;
};

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, dob, gender, mno } = req.query;

  const wasmFilePath = "public/checker.wasm";
  const finalZkeyPath = "public/checker_0001.zkey";
  const a = stringToAsciiArray(
    [name.toString(), dob.toString(), gender.toString(), mno.toString()],
    FIXEDARRAYSIZE
  );
  const b = "1";
  const witness = {
    a,
    b,
  };

  const { proof, publicSignals } = await groth16.fullProve(
    witness,
    wasmFilePath,
    finalZkeyPath,
    null
  );

  // console.log("proof: ", JSON.stringify(proof));

  console.log("Hello From API");
  res.status(200).json(proof);
}
