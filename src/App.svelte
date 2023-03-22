<script>
  import {startStory} from './lib/backend.js';
  import {parseMessage} from './lib/parser.js';
  
  let apiKey = "";
  let storyType = "science fiction";
  let story = null;
  let error = null;
  let requestInFlight = 0;
  let choices = null;
  
  async function onStart(){
    requestInFlight++;
    error = null;
    story = null;
    choices = null;
    let tmpStory;
    try { 
      let res = await startStory(apiKey, storyType);
      console.log(res);
      if(res.error)
        throw new Error(res.error);
      tmpStory = res.story;
    } catch(err) {
      console.log(err);
      error = err.message;
    }
    requestInFlight--;
    try {
      let parsed = parseMessage(tmpStory);
      story = parsed.story;
      choices = parsed.choices;
    }catch(err){
      console.log(err);
      error = "unable to parse the story";
      story = tmpStory;
      choices = null;
    }
  }
  
  async function onNext(){
    console.log("next");
  }
</script>

<main>
  <div class="container text-center">
    <div class="row align-items-start g-0">
      <div class="card" style="align-items: normal">
        <div class="card-body p-0">
          <div class="input-group">
            <span class="input-group-text">API Key: </span>
            <input type="text" class="form-control" bind:value={apiKey}>
          </div>
          <div class="input-group">
            <span class="input-group-text">Story type: </span>
            <input type="text" class="form-control" bind:value={storyType}>
            <button class="btn btn-primary" type="button" disabled={requestInFlight} on:click={onStart}>start !</button>
          </div>
        </div>
      </div>
    </div>
    {#if error}
      <div class="row align-items-start g-0">
        <div class="card text-bg-danger" style="align-items: normal">
          <div class="card-body p-0">
          <pre>{error}</pre>
          </div>
        </div>
      </div>
    {/if}
    {#if story}
      <div class="row align-items-start g-0">
        <div class="card text-bg-light" style="align-items: normal">
          <div class="card-body p-0">
          <pre>{story}</pre>
          </div>
        </div>
      </div>
    {/if}
    {#each (choices||[]) as choice}
      <button type="button" class="btn btn-info" on:click={onNext} >{choice}</button>
    {/each}
  </div>
</main>

<style>
pre {
  text-align: left;
  white-space: pre-wrap;
  margin-bottom: 0rem;
}
button{
  margin-bottom: 0.5rem;
  width: 100%;
}
</style>
