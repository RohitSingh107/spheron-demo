const groth16 = require("snarkjs").groth16;

export async function exportCallDataGroth16(input, wasmPath, zkeyPath) {
  const { proof: _proof, publicSignals: _publicSignals } =
    await groth16.fullProve(input, wasmPath, zkeyPath);

  return { _proof, _publicSignals };
}
