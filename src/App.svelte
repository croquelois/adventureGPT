<script>
  import {startStory} from './lib/backend.js';
  import {parseMessage} from './lib/parser.js';
  import { onMount } from 'svelte';
  
  let apiKey = "";
  let storyType = "science fiction";
  let story = null;
  let error = null;
  let requestInFlight = 0;
  let choices = null;
  
  function onKeySave(){
    localStorage.setItem("apiKey", apiKey);
  }
  onMount(() => {
    apiKey = localStorage.getItem("apiKey") || "";
  });
  
  async function onStart(){
    requestInFlight++;
    error = null;
    story = null;
    choices = null;
    let tmpStory = '\n\nThe year is 2076, and Earth has finally fallen into chaos. Governments have failed, and anarchy rules the world. The only hope for humanity is a group of scientists who have managed to build a spacecraft capable of finding and colonizing a new planet.\n\nThe crew consists of five members, each with their own specialized skill set. They are led by Dr. Sarah Chang, a brilliant astrophysicist who has orchestrated the entire mission. Also onboard are Dr. Thomas Woods, an expert in terraforming; Lt. James Rodriguez, a skilled pilot; Dana Gray, an accomplished botanist; and Trevor Turner, the communications specialist.\n\nThe voyage is long and grueling, but the crew remains dedicated to their mission. After months in stasis, they finally reach their destination: a habitable planet orbiting a star similar to Earth’s.\n\nAs they make their descent, however, disaster strikes. The ship is hit by a massive explosion, sending it careening towards the surface of the planet. The crew barely manages to deploy the emergency landing protocols in time, but the ship is heavily damaged.\n\nNow, stranded on an unknown planet with limited supplies and no way to contact Earth, the crew must find a way to survive and complete their mission.\n\nOption 1: The crew decides to explore their new surroundings in search of resources and a way to send a distress signal. But they soon realize they are not alone on the planet and must fight to stay alive against an unknown enemy.\n\nOption 2: Dr. Woods proposes a plan to terraform the planet, creating a new home for humanity. The crew agrees, but the process proves to be more difficult than anticipated, and they must overcome numerous obstacles to succeed.\n\nOption 3: Lt. Rodriguez manages to repair the ship’s communication systems, and the crew sends out a distress signal. However, they receive a shocking response from Earth, revealing a conspiracy that led to the destruction of their ship and a dangerous new threat to humanity. The crew must decide whether to fight against their own kind or continue their mission to colonize a new world.';
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
    if(error)
      return;
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
    {/if}
    {#each (choices||[]) as choice}
      <button type="button" class="w-100 my-1 btn btn-info" on:click={onNext} >{choice}</button>
    {/each}
  </div>
</main>

<style>
pre {
  text-align: left;
  white-space: pre-wrap;
  margin-bottom: 0rem;
}
</style>
