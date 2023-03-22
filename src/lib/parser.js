function isEmpty(txt){
  return (txt.trim() == "");
}

let reChoice = /^\d+[\s\.\)]\s/;
function isChoice(txt){
  return reChoice.test(txt);
}

export function parseMessage(msg){
  let lines = msg.split("\n");
  
  let n = lines.length;
  let choices = [];
  while(n > 0) {
    if(isChoice(lines[n-1])){
      choices.push(lines.pop().trim());
      n--;
      continue;
    }
    if(isEmpty(lines[n-1])){
      lines.pop();
      n--;
      continue;
    }
    break;
  }
  choices.reverse();
  let story = lines.join("\n").trim();
  return {story, choices}
}