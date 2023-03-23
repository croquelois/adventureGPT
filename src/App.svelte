<script>
  import {startStory, continueStory, imageStory} from './lib/backend.js';
  import {parseMessage} from './lib/parser.js';
  import { onMount } from 'svelte';
  
  let apiKey = "";
  let storyType = "science fiction";
  let rawStory = null;
  let story = null;
  let error = null;
  let prompt = null;
  let requestInFlight = 0;
  let choices = null;
  
  function onKeySave(){
    localStorage.setItem("apiKey", apiKey);
  }
  onMount(() => {
    apiKey = localStorage.getItem("apiKey") || "";
  });
  
  function parse(rawStory){
    if(error)
      return;
    try {
      let parsed = parseMessage(rawStory);
      story = parsed.story;
      choices = parsed.choices;
    }catch(err){
      console.log(err);
      error = "unable to parse the story";
      story = rawStory;
      choices = null;
    }
  }
  
  async function onStart(){
    requestInFlight++;
    error = null;
    story = null;
    choices = null;
    rawStory = null;
    prompt = null;
    try { 
      let res = await startStory(apiKey, storyType);
      console.log(res);
      if(res.error)
        throw new Error(res.error);
      rawStory = res.story;
    } catch(err) {
      console.log(err);
      error = err.message;
    }
    requestInFlight--;
    parse(rawStory);
  }
  
  async function onNext(event){
    let index = event.target.dataset.index;
    requestInFlight++;
    error = null;
    prompt = null;
    try { 
      let res = await continueStory(apiKey, storyType, rawStory, choices[index]);
      console.log(res);
      if(res.error)
        throw new Error(res.error);
      rawStory = res.story;
    } catch(err) {
      console.log(err);
      error = err.message;
    }
    requestInFlight--;
    parse(rawStory);
  }
  
  async function onImage(event){
    let index = event.target.dataset.index;
    requestInFlight++;
    error = null;
    prompt = null;
    try { 
      let res = await imageStory(apiKey, storyType, rawStory);
      console.log(res);
      if(res.error)
        throw new Error(res.error);
      prompt = res.prompt.trim();
    } catch(err) {
      console.log(err);
      error = err.message;
    }
    requestInFlight--;
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
            <button class="btn btn-primary" type="button" disabled={requestInFlight} on:click={onKeySave}>local save</button>
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
      {#each (choices||[]) as choice,i}
        <button type="button" class="w-100 my-1 btn btn-info" on:click={onNext} data-index={i}>{choice}</button>
      {/each}
      <button type="button" class="w-100 my-1 btn btn-success" on:click={onImage}>Image prompt</button>
    {/if}
    {#if prompt}
      <div class="row align-items-start g-0">
        <div class="card text-bg-warning" style="align-items: normal">
          <div class="card-body p-0">
          <pre>{prompt}</pre>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
pre {
  text-align: left;
  white-space: pre-wrap;
  margin-bottom: 0rem;
}
</style>
