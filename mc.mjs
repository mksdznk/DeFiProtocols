import { createPublicClient, http } from "viem";
import { mainnet, base, arbitrum, polygon } from "viem/chains";
const cometAbi=[{name:"baseToken",type:"function",stateMutability:"view",inputs:[],outputs:[{type:"address"}]},{name:"getUtilization",type:"function",stateMutability:"view",inputs:[],outputs:[{type:"uint256"}]}];
const markets=[[1,"0xc3d688B66703497DAA19211EEdff47f25384cdc3"],[1,"0xA17581A9E3356d9A858b789D68B4d866e593aE94"],[1,"0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840"],[8453,"0xb125E6687d4313864e53df431d5425969c15Eb2F"],[42161,"0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf"],[137,"0xF25212E676D1F7F89Cd72fFEe66158f541246445"]];
const chains={1:mainnet,8453:base,42161:arbitrum,137:polygon};
// http() with NO url = the chain's DEFAULT rpc — exactly what the wagmi config uses.
const clients=Object.fromEntries(Object.entries(chains).map(([id,c])=>[id,createPublicClient({chain:c,transport:http()})]));
console.log("default mainnet RPC:", mainnet.rpcUrls.default.http[0]);
for(const [cid,comet] of markets){
  try{
    const res=await clients[cid].multicall({allowFailure:true,contracts:[
      {address:comet,abi:cometAbi,functionName:"baseToken"},
      {address:comet,abi:cometAbi,functionName:"getUtilization"},
    ]});
    console.log(`chain ${cid} ${comet.slice(0,10)}: baseToken=${res[0].status} util=${res[1].status}`);
  }catch(e){console.log(`chain ${cid} ${comet.slice(0,10)}: THREW ${String(e.shortMessage||e.message).split("\n")[0].slice(0,80)}`);}
}
