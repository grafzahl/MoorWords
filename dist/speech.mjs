import {buildVocabulary,DEFAULT_PAUSE_MS} from './reading.mjs?v=0.4.1';
const MODEL_URL='https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-de-0.15.tar.gz';
const SCRIPT_URL='https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js';
let scriptPromise;
function loadScript(){if(globalThis.Vosk)return Promise.resolve();if(scriptPromise)return scriptPromise;scriptPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=SCRIPT_URL;script.onload=resolve;script.onerror=()=>{script.remove();scriptPromise=null;reject(new Error('Die Spracherkennung konnte nicht geladen werden. Prüfe die Internetverbindung.'));};document.head.append(script);});return scriptPromise;}
export class LocalSpeech{
  constructor(){this.model=null;this.stream=null;this.context=null;this.recognizer=null;this.generation=0;}
  async start(onResult,onPartial,onStatus,onFailure,{words=[],vocabularyHelp=true,pauseMs=DEFAULT_PAUSE_MS}={}){
    const generation=++this.generation;
    if(!isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('Das Mikrofon benötigt HTTPS oder localhost. Öffne die App über die bereitgestellte Adresse.');
    try{
      onStatus('Bitte erlaube den Mikrofonzugriff.');
      this.context=new AudioContext();await this.context.resume();
      const stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      if(generation!==this.generation){stream.getTracks().forEach(t=>t.stop());return false;}
      this.stream=stream;stream.getAudioTracks()[0].onended=()=>{if(generation===this.generation)onFailure('Die Verbindung zum Mikrofon wurde unterbrochen.');};
      onStatus('Spracherkennung wird vorbereitet …');await loadScript();
      if(generation!==this.generation)return false;
      if(!this.model){
        onStatus('Deutsches Sprachmodell wird geladen (ca. 45 MB). Das kann beim ersten Start einige Minuten dauern.');
        const model=new Vosk.Model(MODEL_URL);this.model=model;
        await new Promise((resolve,reject)=>{let done=false;const finish=(error)=>{if(done)return;done=true;clearTimeout(timer);this.cancelModel=null;error?reject(error):resolve();};const timer=setTimeout(()=>finish(new Error('Das Sprachmodell braucht zu lange. Prüfe die Verbindung und versuche es noch einmal.')),180000);this.cancelModel=()=>finish(new Error('Abgebrochen'));model.on('load',m=>finish(m.result?null:new Error('Das Sprachmodell konnte nicht geladen werden.')));model.on('error',()=>finish(new Error('Das Sprachmodell ist nicht verfügbar. Bitte versuche es erneut.')));});
      }
      if(generation!==this.generation)return false;
      this.model.setLogLevel(-1);
      const vocabulary=vocabularyHelp?buildVocabulary(words):[];
      const grammar=vocabulary.length?JSON.stringify(vocabulary):undefined;
      const recognizer=new this.model.KaldiRecognizer(this.context.sampleRate,grammar);this.recognizer=recognizer;recognizer.setWords(true);
      let partialText='',finishing=false;
      const clearPartial=()=>{clearTimeout(this.partialTimer);this.partialTimer=null;partialText='';};
      recognizer.on('result',m=>{
        if(generation!==this.generation)return;
        clearTimeout(this.finalTimer);this.finalTimer=null;
        clearPartial();finishing=false;
        onResult(m.result.text,m.result.result||[]);
      });
      recognizer.on('partialresult',m=>{
        if(generation!==this.generation)return;
        // Slow workers may still deliver queued hypotheses while finalizing.
        // Keep the game's stable-word matcher supplied without another flush.
        if(finishing){onPartial(m.result.partial);return;}
        const text=m.result.partial;
        // Unchanged hypotheses must not postpone finalization forever.
        // Request a real final result with confidence; never score partial text.
        if(text!==partialText){
          clearPartial();partialText=text;
          if(text)this.partialTimer=setTimeout(()=>{
            this.partialTimer=null;
            if(generation!==this.generation)return;
            finishing=true;
            this.finalTimer=setTimeout(()=>{
              this.finalTimer=null;
              if(generation===this.generation&&finishing)onFailure('Die Spracherkennung antwortet nicht mehr. Tippe auf Weiterlesen, um sie neu zu starten.');
            },5000);
            try{recognizer.retrieveFinalResult();}
            catch{onFailure('Die lokale Spracherkennung wurde unterbrochen. Bitte starte erneut.');}
          },[1200,2000,3000].includes(pauseMs)?pauseMs:DEFAULT_PAUSE_MS);
        }
        onPartial(text);
      });
      recognizer.on('error',()=>{if(generation===this.generation)onFailure('Die lokale Spracherkennung wurde unterbrochen. Bitte starte erneut.');});
      this.source=this.context.createMediaStreamSource(stream);
      // Vosk's documented AudioBuffer interface; a silent output keeps processing active.
      this.processor=this.context.createScriptProcessor(4096,1,1);
      this.processor.onaudioprocess=e=>{if(generation!==this.generation)return;try{recognizer.acceptWaveform(e.inputBuffer);}catch{onFailure('Die Audioverarbeitung wurde unterbrochen.');}};
      this.mute=this.context.createGain();this.mute.gain.value=0;
      this.source.connect(this.processor);this.processor.connect(this.mute);this.mute.connect(this.context.destination);
      return true;
    }catch(error){if(generation!==this.generation)return false;this.stop();throw error;}
  }
  stop(){this.generation++;clearTimeout(this.finalTimer);this.finalTimer=null;clearTimeout(this.partialTimer);this.partialTimer=null;this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.source?.disconnect();this.processor?.disconnect();this.mute?.disconnect();if(this.processor)this.processor.onaudioprocess=null;this.recognizer?.remove();this.recognizer=null;if(this.context)this.context.close().catch(()=>{});this.context=null;if(this.cancelModel){this.cancelModel();this.model?.terminate();this.model=null;}else if(this.model&&!this.model.ready){this.model.terminate();this.model=null;}}
  dispose(){this.stop();this.model?.terminate();this.model=null;}
}
