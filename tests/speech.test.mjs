import test from 'node:test';import assert from 'node:assert/strict';
import {LocalSpeech} from '../dist/speech.mjs';
import {ReadingAttempt} from '../dist/reading.mjs';
function environment(){let stopped=0,closed=0,removed=0,terminated=0;const track={stop(){stopped++;}};const stream={getTracks:()=>[track],getAudioTracks:()=>[track]};const node=()=>({connect(){},disconnect(){}});class Context{sampleRate=48000;resume(){return Promise.resolve();}close(){closed++;return Promise.resolve();}createMediaStreamSource(){return node();}createScriptProcessor(){return node();}createGain(){return {...node(),gain:{value:1}};}}
class Recognizer{constructor(rate,grammar){assert.equal(rate,48000);this.grammar=grammar;this.listeners={};}setWords(value){assert.equal(value,true);}on(name,cb){this.listeners[name]=cb;}acceptWaveform(){}remove(){removed++;}}
class Model{constructor(){this.ready=false;this.listeners={};queueMicrotask(()=>{this.ready=true;this.listeners.load?.({result:true});});}on(name,cb){this.listeners[name]=cb;}setLogLevel(){}KaldiRecognizer=Recognizer;terminate(){terminated++;}}
Object.defineProperty(globalThis,'isSecureContext',{value:true,configurable:true});Object.defineProperty(globalThis,'navigator',{value:{mediaDevices:{getUserMedia:async()=>stream}},configurable:true});globalThis.AudioContext=Context;globalThis.Vosk={Model};return {track,stream,counts:()=>({stopped,closed,removed,terminated})};}
test('Mikrofonstart, lokale Ergebnisse, Stop und Neustart ohne altes Ergebnis',async()=>{const env=environment();const speech=new LocalSpeech();const heard=[];assert.equal(await speech.start((text)=>heard.push(text),()=>{},()=>{},()=>{}),true);const recognizer=speech.recognizer;recognizer.listeners.result({result:{text:'haus',result:[]}});assert.deepEqual(heard,['haus']);speech.stop();recognizer.listeners.result({result:{text:'maus',result:[]}});assert.deepEqual(heard,['haus']);assert.deepEqual(env.counts(),{stopped:1,closed:1,removed:1,terminated:0});assert.equal(await speech.start(()=>{},()=>{},()=>{},()=>{}),true);speech.dispose();assert.deepEqual(env.counts(),{stopped:2,closed:2,removed:2,terminated:1});});
test('Verweigerter Mikrofonzugriff schließt AudioContext',async()=>{const env=environment();navigator.mediaDevices.getUserMedia=async()=>{throw Object.assign(new Error('Nein'),{name:'NotAllowedError'});};const speech=new LocalSpeech();await assert.rejects(speech.start(()=>{},()=>{},()=>{},()=>{}),{name:'NotAllowedError'});assert.equal(env.counts().closed,1);assert.equal(speech.stream,null);});
test('Abbruch während Berechtigungsdialog stoppt später gelieferte Tracks',async()=>{const env=environment();let permission;let requested;const reached=new Promise(resolve=>{requested=resolve;});navigator.mediaDevices.getUserMedia=()=>{requested();return new Promise(resolve=>{permission=resolve;});};const speech=new LocalSpeech();const start=speech.start(()=>{},()=>{},()=>{},()=>{});await reached;speech.stop();permission(env.stream);assert.equal(await start,false);assert.equal(env.counts().stopped,1);assert.equal(speech.recognizer,null);});
test('Wortschatz wird an Vosk übergeben; Abschalten startet wieder freie Erkennung',async()=>{
  environment();const speech=new LocalSpeech();
  await speech.start(()=>{},()=>{},()=>{},()=>{},{words:[{text:'Regenbogen'}]});
  assert.deepEqual(JSON.parse(speech.recognizer.grammar),['regenbogen','regen','bogen','[unk]']);
  speech.stop();
  await speech.start(()=>{},()=>{},()=>{},()=>{},{words:[{text:'Regenbogen'}],vocabularyHelp:false});
  assert.equal(speech.recognizer.grammar,undefined);speech.dispose();
});

test('Unveränderte Teilhypothese fordert endgültiges Ergebnis an und wertet nur dieses',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});environment();
  const speech=new LocalSpeech(),heard=[];
  await speech.start((text,details)=>heard.push({text,details}),()=>{},()=>{},()=>{});
  const r=speech.recognizer;let flushes=0;r.retrieveFinalResult=()=>{flushes++;};
  r.listeners.partialresult({result:{partial:'haus'}});
  t.mock.timers.tick(1500);r.listeners.partialresult({result:{partial:'haus'}});
  t.mock.timers.tick(500);assert.equal(flushes,1);assert.deepEqual(heard,[]);
  r.listeners.partialresult({result:{partial:'haus'}});
  t.mock.timers.tick(6000);assert.equal(flushes,1);
  const details=[{word:'haus',conf:.9}];
  r.listeners.result({result:{text:'haus',result:details}});
  assert.deepEqual(heard,[{text:'haus',details}]);
  r.listeners.partialresult({result:{partial:'maus'}});
  t.mock.timers.tick(2000);assert.equal(flushes,2);speech.dispose();
});

test('Geänderte Hypothesen und geduldige Einstellung lassen Zeit zum Weiterlesen',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});environment();const speech=new LocalSpeech();
  await speech.start(()=>{},()=>{},()=>{},()=>{},{pauseMs:3000});
  const r=speech.recognizer;let flushes=0;r.retrieveFinalResult=()=>{flushes++;};
  r.listeners.partialresult({result:{partial:'regen'}});t.mock.timers.tick(2500);
  r.listeners.partialresult({result:{partial:'regen bogen'}});t.mock.timers.tick(2999);
  assert.equal(flushes,0);t.mock.timers.tick(1);assert.equal(flushes,1);speech.dispose();
});

test('Natürliche Endergebnisse und leere Hypothesen löschen den ausstehenden Abschluss',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});environment();const speech=new LocalSpeech();
  await speech.start(()=>{},()=>{},()=>{},()=>{});
  const r=speech.recognizer;let flushes=0;r.retrieveFinalResult=()=>{flushes++;};
  r.listeners.partialresult({result:{partial:'haus'}});t.mock.timers.tick(1000);
  r.listeners.result({result:{text:'haus'}});t.mock.timers.tick(2000);
  r.listeners.partialresult({result:{partial:'maus'}});t.mock.timers.tick(1000);
  r.listeners.partialresult({result:{partial:''}});t.mock.timers.tick(2000);
  assert.equal(flushes,0);speech.dispose();
});

test('Stop und Neustart verwerfen ausstehende Abschlüsse und alte Teilhypothesen',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});environment();const speech=new LocalSpeech();
  await speech.start(()=>{},()=>{},()=>{},()=>{});
  const old=speech.recognizer;let flushes=0;old.retrieveFinalResult=()=>{flushes++;};
  old.listeners.partialresult({result:{partial:'haus'}});speech.stop();
  await speech.start(()=>{},()=>{},()=>{},()=>{});
  old.listeners.partialresult({result:{partial:'maus'}});t.mock.timers.tick(5000);
  assert.equal(flushes,0);speech.dispose();
});

test('Angeforderte Endergebnisse treffen nur sichere sichtbare Wörter und zählen einmal',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});environment();
  const speech=new LocalSpeech(),attempt=new ReadingAttempt();
  const target={id:1,word:{text:'Haus'},hit:false};let hits=0,now=0,confidence=.4;
  await speech.start((text,details)=>{
    for(const hit of attempt.final(text,details,[target],now).hits){hit.hit=true;hits++;}
  },text=>attempt.partial(text,[target],now),()=>{},()=>{});
  const r=speech.recognizer;
  r.retrieveFinalResult=()=>r.listeners.result({result:{text:'haus',result:[{word:'haus',conf:confidence}]}});
  for(const conf of [.4,.9,.9]){
    confidence=conf;r.listeners.partialresult({result:{partial:'haus'}});
    now+=2000;attempt.expire(now);t.mock.timers.tick(2000);
    assert.equal(hits,conf===.4?0:1);
  }
  speech.dispose();
});
