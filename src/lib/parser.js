function isEmpty(txt){
  return (txt.trim() == "");
}

let reChoices = [
  /^(Option )?(\d+|[a-zA-Z])[\s\.\):]\s/
];
function isChoice(txt){
  return reChoices.some(re => re.test(txt));
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