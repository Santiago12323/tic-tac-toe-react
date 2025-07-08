export default function calculateWinner(b:(string|null)[]){
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b1,c] of lines){
    if(b[a]&&b[a]===b[b1]&&b[a]===b[c]) return b[a];
  }
  return null;
}
export const isDraw=(b:(string|null)[])=>b.every(s=>s!==null);
