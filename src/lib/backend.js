const backendUrl = "http://127.0.0.1:5003";

function promiseOnAjaxReturn(xhr){
  return new Promise((res, rej) => {
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4){
        if(xhr.status == 0)
          return res({status: "error", message:"unable to contact the backend"});
        if(xhr.status == 500) {
          console.log(xhr.responseText);
          return res({status: "error", message:"backend crashed"});
        }
        let json;
        try {
          json = JSON.parse(xhr.responseText);
        } catch(err) {
          console.log(xhr.responseText);
          return res({status: "error", message:"can't parse backend response"});
        }
        return res(json);
      }
    };
  });
}

export async function startStory(apiKey, storyType){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", backendUrl+"/start");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({apiKey, storyType}));
  return await promiseOnAjaxReturn(xhr);
}

export async function continueStory(apiKey, storyType, story, choice){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", backendUrl+"/continue");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({apiKey, storyType, story, choice}));
  return await promiseOnAjaxReturn(xhr);
}

export async function imageStory(apiKey, storyType, story){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", backendUrl+"/image");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({apiKey, storyType, story}));
  return await promiseOnAjaxReturn(xhr);
}