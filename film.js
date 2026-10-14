/* Wriggly Snake film: the 3D cinematic engine shared by the phone and PC editions.
   Each step is a scene of cues keyed to the narration clock (times come from the pauses in the narration recordings). */
(function(){
'use strict';
const T=window.THREE;
const NUMS='一二三四五六七八九',SUITG={m:'萬',p:'筒',s:'條'},SUITC={m:'#b3261e',p:'#1f4e9a',s:'#1d7149'};
const HONG={E:'東',S:'南',W:'西',N:'北',R:'中',G:'發',H:''},HONC={R:'#b3261e',G:'#1d7149'};
const TW=1,TH=1.36,FD=.5,BD=.26,SP=1.12,GAP=.6,UP=TH/2;
const WINDS=['E','S','W','N'];

/* ---------- the narration ---------- */
const STEPS=[
 {name:'Welcome',vo:'audio/vo-intro.mp3',dur:16.6,text:"Welcome to the Wriggly Snake. It's a limit hand: nine tiles of one suit, one of each wind, and one tile doubled. To everyone else at the table, it looks like a hand going nowhere. That's the beauty of it. I'll show you when to chase it, what to throw away, and when to walk away."},
 {name:'The hand',vo:'audio/vo-hand.mp3',dur:30.2,text:"Here's the shape. One through nine in a single suit, one copy each. East, South, West and North, one each. That's thirteen different tiles. The fourteenth tile doubles any one of them, and that's your pair. You can't call pung, chow or kong along the way, so the whole hand comes from your own draws, though most tables let you take the very last tile from a discard. One warning: rule cards disagree about which tile can be the pair. Settle that before you play."},
 {name:'Counting',vo:'audio/vo-count.mp3',dur:20.5,text:"How far away are you? Because the snake is all singles, counting is easy. Pick your best suit. Count the different tiles you need that you're already holding. Here, that's ten. You also have a pair of fives, so take off one more. Thirteen, minus ten, minus one: you're two draws from ready. And the dragons? Dead weight."},
 {name:'Commit or not',vo:'audio/vo-commit.mp3',dur:18.9,text:"So, should you chase it? Decide on the deal. Four steps or fewer: go for it. Five: only if the same tiles also point to a half flush. Six or more: play a normal hand. That's about three deals in four, so most of the time, the answer is no. Patience is part of this hand."},
 {name:'Discard order',vo:'audio/vo-discards.mp3',dur:19.6,text:"When you do go for it, throw tiles in this order. First, number tiles from the other two suits. They help nothing. Second, dragons. Let them go early, before they get dangerous. Third, extra copies. You only need one pair. And never, ever break one of your needed singles."},
 {name:'When to let it go',vo:'audio/vo-fold.mp3',dur:17.6,text:"Now watch the table. Every tile has four copies. One South goes by. Then two. Then three. When all four are gone, the snake is dead. Switch plans that same turn. And remember: your discards tell everyone you're building one suit, so expect to win on your own draw."},
 {name:'Backup plan',vo:'audio/vo-backup.mp3',dur:14.2,text:"Here's your safety net. Look at that one-to-nine run again. It's really three chows. Add a pung of East and a pair of North, and you've got a half flush with a pure straight. When the snake dies, slide into this hand. You lose almost nothing."},
 {name:'Quick count',vo:'audio/vo-quick.mp3',dur:13.6,text:"Let's practice counting. Here's a deal. Find your best suit, count the needed tiles, check for a pair, and you have your number. Here's another. And one more. With a little practice, you'll count a hand in seconds."},
 {name:'Practice',vo:'audio/vo-practice.mp3',dur:11.9,text:"Try this one. Characters is your suit, and you've just drawn the Green Dragon. What do you throw? The four of Dots. It helps neither the snake nor your backup plan. The dragons can wait a turn."},
 {name:'Finale',vo:'audio/vo-finale.mp3',dur:8.8,text:"That's the Wriggly Snake. Count on the deal, commit only when it's close, throw in the right order, and know when to let it go. See you at the table."}
];

/* Fin's narration: per teaching line [oldStart, oldEnd, newStart, newEnd] so each cue lands on the same words, plus timed jokes */
const TIMING=[{"name": "intro", "file": "intro", "dur": 26.51, "text": "Welcome to the Wriggly Snake, ya gobshite. It's a limit hand: nine tiles of one suit, one of each wind, and one tile doubled. To everyone else at the table, it looks like a hand going nowhere. A bit like yourself, really. That's the beauty of it. I'll show you when to chase it, what to throw away, and when to walk away. Now sit up straight and pay attention, ya eejit.", "anchors": [[0.0, 0.0], [0.38, 0.38], [0.58, 0.6], [0.68, 0.72], [0.98, 1.16], [2.02, 3.14], [2.16, 3.36], [2.24, 3.44], [2.4, 3.74], [3.1, 4.76], [3.36, 5.04], [3.6, 5.4], [3.9, 5.82], [4.04, 6.02], [4.76, 6.88], [4.82, 7.04], [4.98, 7.2], [5.08, 7.36], [5.74, 8.12], [5.82, 8.3], [6.02, 8.6], [6.26, 9.1], [7.4, 10.32], [7.66, 10.48], [7.86, 10.7], [8.12, 11.0], [8.3, 11.16], [8.38, 11.24], [8.98, 12.04], [9.06, 12.18], [9.2, 12.32], [9.4, 12.56], [9.5, 12.66], [9.76, 13.0], [10.02, 13.26], [11.28, 16.52], [11.56, 16.84], [11.68, 16.96], [11.84, 17.24], [12.12, 17.44], [12.86, 18.06], [13.06, 18.32], [13.2, 18.52], [13.36, 18.78], [13.54, 19.02], [13.66, 19.2], [13.88, 19.46], [14.4, 19.96], [14.46, 20.16], [14.6, 20.34], [14.78, 20.54], [15.36, 21.22], [15.54, 21.42], [15.7, 21.64], [15.86, 21.9], [16.06, 22.16], [16.59, 26.51]], "jokes": [[14.57, "A BIT LIKE<br>YOURSELF", "warn"], [23.29, "SIT UP,<br>EEJIT", "bad"]]}, {"name": "hand", "file": "hand-v2", "dur": 46.76, "text": "Here's the shape. One through nine in a single suit, one copy each. East, South, West and North, one each. That's thirteen different tiles. Count them on your fingers if you have to, I won't tell anyone. The fourteenth tile doubles any one of them, and that's your pair. You can't call pung, chow or kong along the way, ya racist cunt, so the whole hand comes from your own draws, though most tables let you take the very last tile from a discard. So no, you can't nick tiles off your granny either. One warning: rule cards disagree about which tile can be the pair. Settle that before you play. Or there'll be a row, and you'll lose it, ya muppet.", "anchors": [[0.0, 0.0], [0.32, 0.32], [0.44, 0.42], [1.28, 1.4], [1.52, 1.5], [1.74, 1.86], [1.98, 2.28], [2.18, 2.52], [2.26, 2.62], [2.44, 2.86], [3.18, 3.88], [3.38, 4.04], [3.68, 4.48], [4.78, 5.6], [5.44, 6.56], [6.36, 7.02], [7.1, 7.24], [7.2, 7.64], [7.9, 8.6], [8.1, 8.78], [9.0, 9.9], [9.3, 10.14], [9.56, 10.44], [9.98, 11.04], [11.46, 16.3], [11.54, 16.48], [12.08, 17.08], [12.28, 17.26], [12.58, 17.72], [12.92, 18.26], [13.12, 18.52], [13.24, 18.66], [13.78, 19.02], [13.98, 19.24], [14.22, 19.64], [14.32, 19.74], [15.28, 20.64], [15.38, 20.72], [15.66, 21.02], [15.82, 21.22], [16.58, 22.02], [17.2, 22.6], [17.54, 23.1], [17.82, 23.4], [18.02, 23.6], [18.64, 25.64], [18.84, 25.74], [18.98, 25.88], [19.08, 26.04], [19.42, 26.44], [19.7, 26.72], [19.88, 26.92], [20.02, 27.06], [20.22, 27.3], [21.14, 28.16], [21.32, 28.44], [21.5, 28.64], [21.76, 29.02], [22.08, 29.36], [22.2, 29.5], [22.38, 29.68], [22.52, 29.84], [22.7, 30.14], [22.94, 30.5], [23.24, 30.82], [23.5, 31.16], [23.6, 31.26], [24.56, 36.58], [24.7, 36.9], [25.6, 37.78], [26.1, 38.02], [26.28, 38.36], [26.52, 38.94], [26.9, 39.46], [27.1, 39.74], [27.38, 40.14], [27.64, 40.44], [27.76, 40.58], [27.88, 40.7], [28.94, 41.74], [29.16, 41.98], [29.34, 42.22], [29.62, 42.46], [29.78, 42.72], [30.2, 46.76]], "jokes": [[12.27, "USE YOUR<br>FINGERS", "warn"], [24.12, "YA RACIST<br>#@!%", "bad"], [32.51, "HANDS OFF<br>GRANNY'S TILES", "bad"], [43.75, "YA MUPPET", "bad"]]}, {"name": "count", "file": "count", "dur": 29.31, "text": "How far away are you? From being any good at this? Miles. Because the snake is all singles, counting is easy. Even for you. Pick your best suit. Count the different tiles you need that you're already holding. Here, that's ten. You also have a pair of fives, so take off one more. Thirteen, minus ten, minus one: you're two draws from ready. And the dragons? Dead weight. Get fecked, dragons.", "anchors": [[0.0, 0.0], [0.16, 0.18], [0.34, 0.38], [0.62, 0.64], [0.76, 0.82], [1.76, 5.1], [1.98, 5.3], [2.16, 5.48], [2.42, 5.72], [2.56, 5.9], [3.16, 6.76], [3.32, 6.9], [3.56, 7.18], [4.46, 9.5], [4.66, 10.06], [4.82, 10.3], [5.8, 11.4], [5.94, 11.54], [6.12, 11.8], [6.34, 12.02], [6.62, 12.34], [6.88, 12.62], [7.04, 12.82], [7.2, 13.06], [7.4, 13.22], [7.62, 13.56], [8.72, 14.58], [9.1, 14.8], [9.4, 15.04], [10.32, 15.84], [10.46, 15.96], [10.6, 16.12], [10.88, 16.38], [11.12, 16.64], [11.22, 16.78], [11.94, 17.54], [12.14, 17.94], [12.32, 18.14], [12.56, 18.38], [13.4, 19.6], [14.5, 20.04], [14.68, 20.36], [15.28, 21.2], [16.6, 22.74], [16.72, 22.82], [16.94, 23.14], [17.18, 23.5], [17.5, 23.94], [18.66, 24.84], [18.78, 25.02], [19.98, 26.76], [20.51, 29.31]], "jokes": [[1.77, "MILES", "bad"], [7.95, "EVEN FOR YOU", "warn"], [27.79, "GET FECKED,<br>DRAGONS", "bad"]]}, {"name": "commit", "file": "commit-v2", "dur": 31.09, "text": "So, should you chase it? Decide on the deal. Four steps or fewer: go for it. Five: only if the same tiles also point to a half flush. Six or more: play a normal hand. Don't be a hero. You're not that good. That's about three deals in four, so most of the time, the answer is no. I know. Life's hard. Get over it. Patience is part of this hand. Something you clearly know nothing about.", "anchors": [[0.0, 0.0], [0.5, 0.5], [0.7, 0.64], [0.84, 0.8], [1.06, 1.06], [2.5, 2.08], [2.78, 2.56], [2.9, 2.72], [3.0, 2.82], [3.7, 3.72], [4.3, 4.38], [5.16, 5.26], [5.5, 5.68], [7.22, 6.54], [7.62, 7.94], [8.14, 8.1], [8.28, 8.22], [8.46, 8.46], [8.72, 8.8], [9.16, 9.34], [9.4, 9.76], [9.6, 10.08], [9.7, 10.18], [9.86, 10.46], [11.14, 11.66], [11.24, 11.94], [11.42, 12.22], [12.0, 13.02], [12.2, 13.12], [12.32, 13.28], [12.5, 13.54], [13.76, 17.68], [13.98, 18.24], [14.1, 18.38], [14.36, 18.78], [14.76, 19.36], [15.18, 20.0], [15.28, 20.18], [15.46, 20.46], [15.62, 20.62], [15.7, 20.7], [15.9, 21.28], [16.06, 21.38], [16.3, 21.82], [16.48, 22.2], [17.62, 26.52], [17.78, 27.1], [17.98, 27.26], [18.16, 27.46], [18.32, 27.68], [18.46, 27.8], [18.91, 31.09]], "jokes": [[14.57, "DON'T BE<br>A HERO", "bad"], [23.53, "GET OVER IT", "warn"], [28.65, "CLEARLY", "bad"]]}, {"name": "discards", "file": "discards-v2", "dur": 37.8, "text": "When you do go for it, throw tiles in this order. First, number tiles from the other two suits. They help nothing. Away with ye, four of Dots. Second, dragons. Let them go early, before they get dangerous. Dragons are like your uncle at a wedding. Grand early on, a menace by midnight. Third, extra copies. You only need one pair. And never, ever break one of your needed singles, like Darrin breaking through the fecking wall of Nan's house. Do that and I'll come round and slap the tiles out of your hand myself.", "anchors": [[0.0, 0.0], [0.16, 0.2], [0.32, 0.34], [0.44, 0.48], [0.7, 0.74], [0.92, 0.98], [1.44, 1.48], [1.56, 1.62], [1.76, 1.82], [2.14, 2.22], [2.3, 2.36], [3.86, 3.48], [4.16, 3.8], [4.54, 4.16], [4.8, 4.52], [5.12, 4.82], [5.28, 4.98], [5.48, 5.28], [5.68, 5.52], [6.64, 6.46], [6.86, 6.86], [8.52, 11.2], [8.82, 11.76], [9.84, 12.76], [10.06, 13.04], [10.22, 13.22], [10.5, 13.52], [10.98, 13.92], [11.34, 14.3], [11.48, 14.46], [13.14, 22.3], [13.76, 22.98], [14.04, 23.42], [15.04, 24.46], [15.3, 24.7], [15.52, 24.96], [15.78, 25.26], [16.78, 26.06], [17.48, 27.1], [17.76, 27.48], [18.18, 27.86], [18.4, 28.14], [18.52, 28.26], [18.62, 28.36], [18.86, 28.76], [19.64, 37.8]], "jokes": [[8.27, "AWAY WITH YE", "bad"], [16.03, "LIKE YOUR<br>UNCLE", "warn"], [28.42, "LIKE DARRIN<br>THROUGH NAN'S WALL", "bad"], [33.85, "I'LL COME<br>ROUND", "bad"]]}, {"name": "fold", "file": "fold", "dur": 29.81, "text": "Now watch the table. Every tile has four copies. One South goes by. Then two. Then three. When all four are gone, the snake is dead. Dead as a doornail. Stop crying. Switch plans that same turn. Don't just sit there like a lemon. And remember: your discards tell everyone you're building one suit, so expect to win on your own draw. They're not as thick as you look.", "anchors": [[0.0, 0.0], [0.16, 0.2], [0.4, 0.46], [0.6, 0.7], [1.6, 1.54], [1.88, 2.22], [2.14, 2.66], [2.38, 3.02], [3.56, 4.76], [3.8, 5.28], [4.14, 5.62], [5.1, 6.58], [6.14, 7.72], [6.3, 7.88], [7.42, 9.12], [7.68, 9.42], [7.92, 9.66], [8.1, 9.88], [8.66, 10.58], [8.72, 10.66], [8.86, 10.92], [9.12, 11.44], [10.22, 15.72], [10.5, 16.22], [10.88, 16.64], [11.16, 17.0], [12.3, 20.16], [13.12, 21.1], [13.2, 21.24], [13.64, 21.84], [13.96, 22.14], [14.32, 22.64], [14.58, 23.02], [14.86, 23.32], [15.08, 23.68], [15.8, 24.54], [15.94, 24.72], [16.16, 25.0], [16.46, 25.34], [16.64, 25.56], [16.8, 25.84], [16.94, 26.0], [17.14, 26.3], [17.55, 29.81]], "jokes": [[12.37, "STOP CRYING", "bad"], [18.09, "LIKE A<br>LEMON", "warn"], [28.09, "NOT AS THICK<br>AS YOU", "bad"]]}, {"name": "backup", "file": "backup", "dur": 22.83, "text": "Here's your safety net. God knows you need one. Look at that one-to-nine run again. It's really three chows. Add a pung of East and a pair of North, and you've got a half flush with a pure straight. When the snake dies, slide into this hand. You lose almost nothing. Which is about what you'd have won anyway, ya chancer.", "anchors": [[0.0, 0.0], [0.32, 0.38], [0.42, 0.46], [0.66, 0.82], [1.88, 3.82], [2.0, 4.1], [2.12, 4.24], [2.38, 4.52], [2.56, 4.7], [2.82, 5.0], [2.98, 5.2], [3.86, 6.02], [4.1, 6.34], [4.46, 6.76], [5.66, 8.04], [5.74, 8.1], [5.86, 8.22], [6.18, 8.54], [6.34, 8.7], [6.54, 8.9], [6.84, 9.22], [6.94, 9.3], [7.1, 9.52], [7.28, 9.72], [7.48, 10.48], [8.0, 10.64], [8.18, 10.9], [8.28, 11.0], [8.42, 11.14], [8.64, 11.46], [8.88, 11.72], [9.12, 12.0], [9.22, 12.14], [9.46, 12.5], [10.5, 14.54], [10.72, 15.06], [10.84, 15.2], [11.02, 15.38], [11.36, 16.44], [11.88, 16.56], [12.1, 16.86], [12.32, 17.1], [13.12, 17.86], [13.3, 18.18], [13.58, 18.62], [14.21, 22.83]], "jokes": [[2.01, "YOU NEED ONE", "warn"], [19.73, "YA CHANCER", "bad"]]}, {"name": "quick", "file": "quick", "dur": 20.19, "text": "Let's practice counting. Fingers out, eejit. Here's a deal. Find your best suit, count the needed tiles, check for a pair, and you have your number. Here's another. And one more. With a little practice, you'll count a hand in seconds. Well. Maybe minutes, in your case.", "anchors": [[0.0, 0.0], [0.22, 0.28], [0.46, 0.52], [1.88, 3.2], [2.02, 3.46], [2.08, 3.54], [3.02, 4.5], [3.22, 4.82], [3.36, 5.02], [4.26, 5.86], [4.38, 6.04], [4.58, 6.36], [4.74, 6.62], [5.74, 7.5], [5.84, 7.68], [6.06, 7.94], [6.14, 8.04], [6.82, 8.76], [7.0, 8.92], [7.1, 9.1], [7.26, 9.42], [7.36, 9.64], [8.6, 10.88], [8.96, 11.16], [10.16, 11.66], [10.24, 11.92], [10.4, 12.12], [11.34, 13.0], [11.5, 13.1], [11.58, 13.2], [11.76, 13.38], [12.3, 14.3], [12.38, 14.5], [12.6, 14.78], [12.7, 14.92], [12.84, 15.24], [13.0, 15.6], [13.56, 20.19]], "jokes": [[1.73, "FINGERS OUT", "warn"], [17.09, "MINUTES,<br>FOR YOU", "bad"]]}, {"name": "practice", "file": "practice", "dur": 25.16, "text": "Try this one. Characters is your suit, and you've just drawn the Green Dragon. What do you throw? Take your time. No, actually, don't. The four of Dots. Get fecked, four of Dots. It helps neither the snake nor your backup plan. The dragons can wait a turn. There. You got one right. Mark the calendar.", "anchors": [[0.0, 0.0], [0.18, 0.22], [0.4, 0.5], [1.42, 1.44], [1.62, 1.68], [2.02, 2.32], [2.18, 2.48], [2.42, 3.24], [2.84, 3.38], [3.06, 3.62], [3.22, 3.82], [3.42, 4.06], [3.62, 4.38], [3.86, 4.68], [4.98, 5.92], [5.04, 6.12], [5.12, 6.28], [5.2, 6.34], [6.22, 11.14], [6.48, 13.94], [6.68, 14.18], [7.72, 15.04], [7.82, 15.32], [7.96, 15.5], [8.24, 15.82], [8.52, 16.14], [8.74, 16.38], [9.1, 16.92], [9.28, 17.2], [9.48, 17.48], [10.48, 18.68], [10.54, 18.76], [10.76, 18.98], [11.12, 19.44], [11.3, 19.68], [11.38, 19.86], [11.89, 25.16]], "jokes": [[7.47, "HURRY UP", "warn"], [13.03, "GET FECKED", "bad"], [21.49, "MARK THE<br>CALENDAR", "ok"]]}, {"name": "finale", "file": "finale", "dur": 13.79, "text": "That's the Wriggly Snake. Count on the deal, commit only when it's close, throw in the right order, and know when to let it go. See you at the table. Now get fecked, ya gobshite. Go on. Off with ye.", "anchors": [[0.0, 0.0], [0.36, 0.38], [0.48, 0.48], [0.8, 0.8], [1.88, 1.98], [2.04, 2.32], [2.14, 2.44], [3.02, 3.16], [3.4, 3.76], [3.58, 4.02], [3.74, 4.2], [4.82, 5.0], [4.98, 5.42], [5.06, 5.5], [5.22, 5.68], [5.54, 6.44], [6.08, 6.6], [6.28, 6.86], [6.48, 7.16], [6.58, 7.32], [6.74, 7.52], [6.82, 7.62], [7.96, 8.72], [8.02, 8.86], [8.16, 9.04], [8.26, 9.16], [8.34, 9.24], [8.83, 13.79]], "jokes": [[9.93, "NOW GET<br>FECKED", "bad"]]}];
TIMING.forEach((m,i)=>{STEPS[i].text=m.text;STEPS[i].dur=m.dur;STEPS[i].vo='audio/fin-'+m.file+'.mp3'});
function remap(m,t){
  /* word-level anchors [oldTime, newTime]: each cue moves to the same word in Fin's read */
  const A=m.anchors;if(t<=A[0][0])return t;
  for(let k=1;k<A.length;k++){if(t<=A[k][0]){const o0=A[k-1][0],n0=A[k-1][1],o1=A[k][0],n1=A[k][1];return n0+(t-o0)*(n1-n0)/Math.max(.001,o1-o0)}}
  const L=A[A.length-1];return L[1]+(t-L[0]);
}

/* ---------- hand counting ---------- */
const needOf=s=>[1,2,3,4,5,6,7,8,9].map(n=>s+n).concat(WINDS);
function countHand(keys){
  const c={};keys.forEach(k=>c[k]=(c[k]||0)+1);
  return ['m','p','s'].map(s=>{const need=needOf(s),have=need.filter(k=>c[k]>0),pair=need.find(k=>c[k]>=2);
    return {s,have,pair,steps:13-have.length-(pair?1:0)}}).sort((a,b)=>a.steps-b.steps)[0];
}
const verdict=n=>n<=4?['CHASE IT','ok']:n===5?['ONLY WITH A BACKUP','warn']:['PLAY NORMALLY','bad'];
const SUITNAME={m:'Characters',p:'Dots',s:'Bamboo'};

/* ---------- tile faces ---------- */
const texCache={};
function face(k,renderer){
  if(texCache[k])return texCache[k];
  const c=document.createElement('canvas');c.width=256;c.height=348;const g=c.getContext('2d');
  const grd=g.createLinearGradient(0,0,0,348);grd.addColorStop(0,'#fffdf7');grd.addColorStop(1,'#efe6cf');
  g.fillStyle=grd;g.fillRect(0,0,256,348);g.strokeStyle='rgba(120,100,60,.18)';g.lineWidth=6;g.strokeRect(8,8,240,332);
  g.textAlign='center';g.textBaseline='middle';
  const cjk='"Noto Serif SC", "Songti SC", "SimSun", serif';
  if(k==='H'){g.strokeStyle='#1f4e9a';g.lineWidth=14;g.strokeRect(60,70,136,208)}
  else if(HONG[k]!==undefined){g.fillStyle=HONC[k]||'#1b1b18';g.font='700 190px '+cjk;g.fillText(HONG[k],128,186)}
  else{const n=+k[1];g.fillStyle='#1b1b18';g.font='700 118px '+cjk;g.fillText(NUMS[n-1],128,112);
    g.fillStyle=SUITC[k[0]];g.font='700 128px '+cjk;g.fillText(SUITG[k[0]],128,250)}
  g.textAlign='left';g.textBaseline='top';g.fillStyle='rgba(27,27,24,.5)';g.font='700 34px "JetBrains Mono", monospace';
  g.fillText(HONG[k]!==undefined?(k==='H'?'Wh':k):k[1],20,18);
  const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;if(renderer)t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  return texCache[k]=t;
}
function labelTex(text,color){
  const c=document.createElement('canvas');c.width=512;c.height=160;const g=c.getContext('2d');
  g.font='800 104px "Bricolage Grotesque", "Segoe UI", sans-serif';g.textAlign='center';g.textBaseline='middle';
  g.lineWidth=14;g.strokeStyle='rgba(6,30,24,.65)';g.strokeText(text,256,84);g.fillStyle=color||'#f4efe2';g.fillText(text,256,84);
  const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}

/* ---------- the film ---------- */
function Film(o){
  const F=this;F.o=o;F.sfx=o.sfx||function(){};
  const r=F.r=new T.WebGLRenderer({canvas:o.canvas,antialias:true,alpha:true});
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.outputEncoding=T.sRGBEncoding;
  r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  const sc=F.sc=new T.Scene();F.cam=new T.PerspectiveCamera(34,1,.1,160);
  sc.add(new T.HemisphereLight(0xfff4dc,0x0b3a2f,.75));
  const key=new T.DirectionalLight(0xffffff,.95);key.position.set(-4,13,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-15,right:15,top:12,bottom:-12,near:1,far:50});sc.add(key);
  F.flash=new T.PointLight(0xffc24a,0,18,2);F.flash.position.set(0,3.5,3);sc.add(F.flash);
  const floor=new T.Mesh(new T.PlaneGeometry(120,120),new T.ShadowMaterial({opacity:.4}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;sc.add(floor);
  F.barrier=new T.Mesh(new T.PlaneGeometry(24,3.6),new T.MeshBasicMaterial({color:0xff4a3d,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));
  F.barrier.position.set(0,1.8,-1.9);sc.add(F.barrier);
  const ivory=new T.MeshStandardMaterial({color:0xf2ead4,roughness:.42}),green=new T.MeshStandardMaterial({color:0x1f6b55,roughness:.38});
  const frontG=new T.BoxGeometry(TW,TH,FD),backG=new T.BoxGeometry(TW*.985,TH*.985,BD);F.geo={frontG,backG,ivory,green};
  F.tiles=[];F.meshes=[];F.ray=new T.Raycaster();
  for(let i=0;i<20;i++){
    const mat=new T.MeshStandardMaterial({map:face('m1',r),roughness:.32,emissive:new T.Color(0xffb83d),emissiveIntensity:0});
    const g=new T.Group(),fm=new T.Mesh(frontG,[ivory,ivory,ivory,ivory,mat,ivory]),bm=new T.Mesh(backG,green);
    bm.position.z=-(FD+BD)/2;[fm,bm].forEach(m=>{m.castShadow=true;m.receiveShadow=true});g.add(fm,bm);sc.add(g);
    fm.userData.i=bm.userData.i=i;F.meshes.push(fm,bm);
    F.tiles.push({g,mat,k:'m1',p:new T.Vector3(0,-30,0),tp:new T.Vector3(0,-30,0),base:new T.Vector3(),ry:0,try:0,rx:0,trx:0,glow:0,tglow:0,dim:0,tdim:0,
      spin:false,sa:0,sp:7,hopT:-9,hopH:.55,spinT:-9,arcT:-9,arcH:2,pulseT:-9,shakeT:-9,snake:false});
  }
  // the commit chart
  F.bars=[];F.barGroup=new T.Group();sc.add(F.barGroup);
  const barCols=[0x2f9e64,0x2f9e64,0xd8aa4c,0xd2463a,0xd2463a,0xd2463a];
  const BARS=[['≤3','0.2%',.22],['4','1.9%',1.85],['5','9.2%',9.22],['6','26%',25.87],['7','37%',36.52],['8+','26%',26.32]];
  BARS.forEach((b,i)=>{
    const m=new T.MeshStandardMaterial({color:barCols[i],roughness:.5,emissive:new T.Color(barCols[i]),emissiveIntensity:0});
    const mesh=new T.Mesh(new T.BoxGeometry(1,1,1),m);mesh.castShadow=true;mesh.receiveShadow=true;F.barGroup.add(mesh);
    const lab=new T.Sprite(new T.SpriteMaterial({map:labelTex(b[0]),transparent:true,depthWrite:false}));lab.scale.set(1.6,.5,1);F.barGroup.add(lab);
    const val=new T.Sprite(new T.SpriteMaterial({map:labelTex(b[1],'#f6cf6b'),transparent:true,depthWrite:false,opacity:0}));val.scale.set(1.5,.47,1);F.barGroup.add(val);
    F.bars.push({mesh,m,lab,val,h:.01,th:.01,full:Math.max(.12,b[2]/36.52*3.2),glow:0,tglow:0});
  });
  F.barGroup.visible=false;F.barGroup.position.z=-1.8;
  // sparks
  F.NP=200;F.pg=new T.BufferGeometry();F.pp=new Float32Array(F.NP*3);F.pv=new Float32Array(F.NP*3);
  F.pg.setAttribute('position',new T.BufferAttribute(F.pp,3));
  F.pm=new T.PointsMaterial({color:0xffd27a,size:.13,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending});
  const pts=new T.Points(F.pg,F.pm);pts.frustumCulled=false;sc.add(pts);
  F.v={yaw:0,pitch:.42,zoom:1};F.tv={yaw:0,pitch:.42,zoom:1};F.look=new T.Vector3(0,.7,0);F.tlook=new T.Vector3(0,.7,0);
  F.shake=0;F.dist=14;F.port=false;F.now=0;F.phase=0;F.snakeA=0;F.tsnakeA=0;
  F.visible=true;F.active=false;F.last=performance.now();
  const host=o.canvas.parentElement;
  F.fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;r.setSize(w,h,false);F.cam.aspect=w/h;
    const was=F.port;F.port=w/h<1;const halfW=F.port?4.85:8.9,hf=Math.atan(Math.tan(F.cam.fov*Math.PI/360)*F.cam.aspect);
    F.dist=Math.max(halfW/Math.tan(hf),F.port?11:9);F.cam.updateProjectionMatrix();if(was!==F.port&&F.onReflow)F.onReflow()};
  new ResizeObserver(F.fit).observe(host);F.fit();
  requestAnimationFrame(t=>F.loop(t));
}
const P=Film.prototype;
P.layout=function(groups){
  const maxW=this.port?8.6:16.8,cap=Math.max(1,Math.floor((maxW+SP-TW)/SP)),chunks=[];
  groups.forEach(n=>{while(n>cap){chunks.push(cap);n-=cap}if(n)chunks.push(n)});
  const wOf=n=>n*SP-(SP-TW),rows=[];let row=[],w=0;
  chunks.forEach(n=>{const add=wOf(n)+(row.length?GAP:0);if(row.length&&w+add>maxW){rows.push(row);row=[];w=0}row.push(n);w+=wOf(n)+(row.length>1?GAP:0)});
  if(row.length)rows.push(row);
  const out=[],RZ=this.port?2.5:2.4;
  rows.forEach((rw,ri)=>{const total=rw.reduce((a,n)=>a+wOf(n),0)+GAP*(rw.length-1);let x=-total/2+TW/2;const z=(ri-(rows.length-1)/2)*RZ;
    rw.forEach((n,gi)=>{for(let j=0;j<n;j++){out.push(new T.Vector3(x,UP,z));x+=SP}x+=GAP-SP+TW});});
  return out;
};
/* discards land front-left on wide screens, and behind the rows on phones so the subtitles never cover them */
P.pile=function(n){return this.port?new T.Vector3((n-1.5)*1.15,UP,-4.4):new T.Vector3(-7.2+n*1.15,.4,2.5)};
P.pileFlat=function(){return !this.port};
P.hideAll=function(){this.tiles.forEach(t=>{t.p.set(0,-30,0);t.tp.set(0,-30,0);t.g.position.copy(t.p);t.snake=false})};
P.key=function(i,k){const t=this.tiles[i];t.k=k;t.mat.map=face(k,this.r);t.mat.needsUpdate=true};
P.deal=function(keys,groups,mode,from){
  const F=this,slots=F.layout(groups||[keys.length]),off=from||0;
  keys.forEach((k,j)=>{const i=off+j,t=F.tiles[i];F.key(i,k);t.base.copy(slots[j]);t.tp.copy(slots[j]);t.try=0;t.trx=0;t.tglow=0;t.tdim=0;t.spin=false;t.sa=0;t.sp=7;
    if(mode==='rain'){t.p.set(slots[j].x+(Math.random()-.5)*6,8+Math.random()*5,slots[j].z-2-Math.random()*4);t.ry=(Math.random()-.5)*4;t.rx=(Math.random()-.5)*2;t.sp=2.8+j*.1}
    else if(mode==='down'){t.p.set(slots[j].x+(Math.random()-.5)*8,9+Math.random()*5,-3-Math.random()*4);t.ry=Math.PI+(Math.random()-.5)*3;t.rx=(Math.random()-.5)*2;t.try=Math.PI;t.sp=2.6+j*.15}
    else if(mode==='drop'){t.p.copy(slots[j]).add(new T.Vector3(0,9,0));t.ry=0;t.rx=0;t.sp=8}
    else{t.p.copy(slots[j]);t.ry=0;t.rx=0}
    t.g.position.copy(t.p);
  });
  return slots;
};
P.relayout=function(idx,groups){const s=this.layout(groups||[idx.length]);idx.forEach((i,j)=>{const t=this.tiles[i];t.base.copy(s[j]);t.tp.copy(s[j]);t.sp=6})};
P.hop=function(i,h){const t=this.tiles[i];t.hopT=this.now;t.hopH=h||.55};
P.spinOnce=function(i){this.tiles[i].spinT=this.now};
P.pulse=function(i){this.tiles[i].pulseT=this.now};
P.shakeTile=function(i){this.tiles[i].shakeT=this.now};
P.throwTo=function(i,pos,flat){const t=this.tiles[i];t.tp.copy(pos);t.trx=flat?-Math.PI/2:0;t.sp=4;t.arcT=this.now;t.arcH=2.2;this.sfx('discard')};
P.view=function(o,instant){Object.assign(this.tv,o);if(instant)Object.assign(this.v,o)};
P.burst=function(at,color){
  this.pm.color.set(color);
  for(let i=0;i<this.NP;i++){const a=Math.random()*Math.PI*2,u=Math.random()*2-1,s=2+Math.random()*4.8,c=Math.sqrt(1-u*u);
    this.pp.set([at.x,at.y,at.z],i*3);this.pv.set([Math.cos(a)*c*s,Math.abs(u)*s+1.5,Math.sin(a)*c*s],i*3)}
  this.pg.attributes.position.needsUpdate=true;this.sparkT=this.now;
};
P.flashNow=function(){this.flashT=this.now};
P.hitBarrier=function(){this.barrierT=this.now};
P.stamp=function(html,cls,life,style){
  const el=this.o.stamps;if(!el)return;const d=document.createElement('div');d.className='stamp '+(cls||'');d.innerHTML=html;
  d.style.cssText='--life:'+(life||1.7)+'s;'+(style||'');el.appendChild(d);setTimeout(()=>d.remove(),((life||1.7)+.7)*1000);
};
P.hud=function(html){const el=this.o.hud;if(!el)return;if(html){el.innerHTML=html;el.classList.add('on')}else el.classList.remove('on')};
P.mid=function(a,b){return this.tiles[a].base.clone().add(this.tiles[b].base).multiplyScalar(.5)};
P.reset=function(){
  const F=this;if(F.yardOn)F.yardEnd();F.hideAll();F.barGroup.visible=false;F.bars.forEach(b=>{b.h=b.th=.01;b.glow=b.tglow=0});
  F.look.set(0,.7,0);F.tlook.set(0,.7,0);F.tsnakeA=0;F.snakeA=0;F.shake=0;F.flashT=F.barrierT=F.sparkT=-99;
  if(F.o.stamps)F.o.stamps.innerHTML='';F.hud('');
  F.tiles.forEach(t=>{t.mat.emissive.set(0xffb83d);t.glow=t.tglow=0;t.dim=t.tdim=0;t.hopT=t.spinT=t.arcT=t.pulseT=t.shakeT=-99});
};
P.play=function(i,getT){
  const F=this;F.reset();F.step=i;F.getT=getT;F.fired=0;F.active=true;F.now=0;
  const S=SCENES[i],m=TIMING[i];
  F.cues=S.cues.map(([t,f])=>[remap(m,t),f]).concat(m.jokes.map(([t,html,cls])=>/DARRIN/.test(html)?[t,G=>G.yardStart(t)]:[t,G=>{G.stamp(html,cls+' joke',2);G.shake=.12;G.sfx('discard');
    G.tiles.forEach((o,k)=>{if(o.tp.y>0)G.hop(k,.22)})}])).sort((a,b)=>a[0]-b[0]);
  if(S.setup)S.setup(F);
};
P.stop=function(){this.active=false};
/* free play: no script, just a running clock so hops, spins and throws still animate */
P.free=function(){const F=this;F.reset();F.cues=[];F.fired=0;F.active=true;const t0=performance.now();F.getT=()=>(performance.now()-t0)/1000;F.view({pitch:.5,zoom:1.05,yaw:0})};
/* which tile is under a screen point, or -1 */
P.pick=function(cx,cy){
  const r=this.o.canvas.getBoundingClientRect(),v=new T.Vector2(((cx-r.left)/r.width)*2-1,-((cy-r.top)/r.height)*2+1);
  this.ray.setFromCamera(v,this.cam);const hit=this.ray.intersectObjects(this.meshes,false)[0];return hit?hit.object.userData.i:-1;
};
P.loop=function(now){
  const F=this;requestAnimationFrame(t=>F.loop(t));
  const dt=Math.min(.1,(now-F.last)/1000);F.last=now;
  if(!F.visible)return;
  if(F.active){const t=F.getT();F.now=t;while(F.fired<F.cues.length&&F.cues[F.fired][0]<=t){try{F.cues[F.fired][1](F)}catch(e){console.error(e)}F.fired++}}
  const t=F.now;
  F.phase+=dt*1.7;F.snakeA+=(F.tsnakeA-F.snakeA)*Math.min(1,dt*2);
  const A=F.snakeA,K=F.port?.95:.62;
  F.tiles.forEach(o=>{
    if(o.snake&&A>.001){const a=K*o.base.x+F.phase+o.base.z;o.tp.z=o.base.z+A*Math.sin(a);o.try=-Math.atan(A*K*Math.cos(a))}
    else if(o.snake){o.tp.z=o.base.z}
    o.p.lerp(o.tp,1-Math.exp(-dt*o.sp));
    o.ry+=(o.try-o.ry)*Math.min(1,dt*8);o.rx+=(o.trx-o.rx)*Math.min(1,dt*7);
    o.glow+=(o.tglow-o.glow)*Math.min(1,dt*6);o.dim+=(o.tdim-o.dim)*Math.min(1,dt*4);
    if(o.spin)o.sa+=dt*13;else if(t-o.spinT<.75&&t>=o.spinT){const u=(t-o.spinT)/.75;o.sa=Math.PI*2*(1-Math.pow(1-u,3))}
    else{const tg=Math.round(o.sa/(Math.PI*2))*Math.PI*2;o.sa+=(tg-o.sa)*Math.min(1,dt*6)}
    let y=0;const hu=(t-o.hopT)/.45;if(hu>=0&&hu<1)y+=o.hopH*Math.sin(Math.PI*hu);
    const au=(t-o.arcT)/.9;if(au>=0&&au<1)y+=o.arcH*Math.sin(Math.PI*au);
    const su=(t-o.spinT)/.75;if(su>=0&&su<1)y+=.5*Math.sin(Math.PI*su);
    let sx=0;const ku=(t-o.shakeT);if(ku>=0&&ku<.7)sx=Math.sin(ku*55)*.12*(1-ku/.7);
    const pu=(t-o.pulseT)/.9,pg=(pu>=0&&pu<1)?1-pu:0;
    o.g.position.set(o.p.x+sx,o.p.y+y,o.p.z);o.g.rotation.set(o.rx,o.ry+o.sa,0);
    o.mat.emissiveIntensity=Math.min(1,o.glow+pg)*.6;const d=1-o.dim*.55;o.mat.color.setRGB(d,d,d);
  });
  if(F.barGroup.visible){const sp=F.port?1.3:1.75;F.bars.forEach((b,i)=>{b.h+=(b.th-b.h)*Math.min(1,dt*3.2);b.glow+=(b.tglow-b.glow)*Math.min(1,dt*5);
    const x=(i-2.5)*sp;b.mesh.scale.set(sp*.72,Math.max(.01,b.h),1);b.mesh.position.set(x,b.h/2,0);b.m.emissiveIntensity=b.glow*.55;
    b.lab.position.set(x,.32,1.05);b.val.position.set(x,b.h+.5,0);b.val.material.opacity=Math.min(1,Math.max(0,(b.h-.05)/Math.max(.1,b.full*.6)))})}
  if(F.yardOn)F.yardTick(t);
  const k=Math.min(1,dt*2.2);
  F.v.yaw+=(F.tv.yaw-F.v.yaw)*k;F.v.pitch+=(F.tv.pitch-F.v.pitch)*k;F.v.zoom+=(F.tv.zoom-F.v.zoom)*k;F.look.lerp(F.tlook,k);
  const d=F.dist*F.v.zoom,cp=Math.cos(F.v.pitch);
  F.cam.position.set(F.look.x+d*Math.sin(F.v.yaw)*cp,F.look.y+d*Math.sin(F.v.pitch),F.look.z+d*Math.cos(F.v.yaw)*cp);
  if(F.shake>.001){F.cam.position.x+=(Math.random()-.5)*F.shake;F.cam.position.y+=(Math.random()-.5)*F.shake;F.shake*=Math.pow(.004,dt)}
  F.cam.lookAt(F.look);
  F.flash.intensity=7*Math.max(0,1-(t-F.flashT)/.9);F.barrier.material.opacity=.55*Math.max(0,1-(t-F.barrierT)/.55);
  const sl=1.4-(t-F.sparkT);
  if(sl>0&&sl<=1.4){const p=F.pp,v=F.pv;for(let i=0;i<F.NP;i++){v[i*3+1]-=9.8*dt;p[i*3]+=v[i*3]*dt;p[i*3+1]=Math.max(.02,p[i*3+1]+v[i*3+1]*dt);p[i*3+2]+=v[i*3+2]*dt}
    F.pg.attributes.position.needsUpdate=true;F.pm.opacity=sl/1.4}else F.pm.opacity=0;
  F.r.render(F.sc,F.cam);
};

/* ---------- the backyard: Darrin, Glenn and Evan play touch footy, and Darrin goes through Nan's fibro wall ---------- */
const Y_IMPACT=3.6,Y_END=6.6;
P.buildYard=function(){
  const F=this,Y=F.yard={},g=Y.group=new T.Group();g.visible=false;F.sc.add(g);
  const grass=new T.Mesh(new T.PlaneGeometry(22,12),new T.MeshStandardMaterial({color:0x5c9a3c,roughness:.95}));
  grass.rotation.x=-Math.PI/2;grass.position.set(0,.006,-.5);grass.receiveShadow=true;g.add(grass);
  // the back of Nan's house: white fibro sheets with cover strips, a window and a gutter
  const wall=Y.wall=new T.Group();wall.position.set(0,0,-4.1);g.add(wall);
  const sheet=new T.Mesh(new T.BoxGeometry(18,4.3,.25),new T.MeshStandardMaterial({color:0xf4f3ee,roughness:.88}));
  sheet.position.y=2.15;sheet.castShadow=true;sheet.receiveShadow=true;wall.add(sheet);
  const strip=new T.MeshStandardMaterial({color:0xe3e2dc,roughness:.8});
  for(let x=-9;x<=9.01;x+=1.2){const s=new T.Mesh(new T.BoxGeometry(.08,4.3,.06),strip);s.position.set(x,2.15,.15);s.receiveShadow=true;wall.add(s)}
  const rail=new T.Mesh(new T.BoxGeometry(18,.08,.06),strip);rail.position.set(0,1.05,.15);wall.add(rail);
  const gutter=new T.Mesh(new T.BoxGeometry(18.4,.24,.4),new T.MeshStandardMaterial({color:0x8a9096,roughness:.45,metalness:.2}));gutter.position.set(0,4.36,.12);wall.add(gutter);
  const frame=new T.Mesh(new T.BoxGeometry(2.3,1.5,.08),new T.MeshStandardMaterial({color:0xffffff,roughness:.6}));frame.position.set(-4.4,2.7,.16);wall.add(frame);
  const glass=new T.Mesh(new T.BoxGeometry(2.02,1.22,.1),new T.MeshStandardMaterial({color:0x6f8fa8,roughness:.15,metalness:.2}));glass.position.set(-4.4,2.7,.18);wall.add(glass);
  const bar=new T.Mesh(new T.BoxGeometry(.06,1.22,.12),new T.MeshStandardMaterial({color:0xffffff}));bar.position.set(-4.4,2.7,.2);wall.add(bar);
  // the hole Darrin leaves behind
  const hs=new T.Shape(),pts=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=.55+((i*37)%7)/14;pts.push([Math.cos(a)*r*1.05,Math.sin(a)*r*1.35])}
  hs.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>hs.lineTo(p[0],p[1]));
  Y.hole=new T.Mesh(new T.ShapeGeometry(hs),new T.MeshBasicMaterial({color:0x17130f}));Y.hole.visible=false;wall.add(Y.hole);
  // the lads: mahjong tiles with their names over their heads
  const mk=(k,name,col)=>{
    const mat=new T.MeshStandardMaterial({map:face(k,F.r),roughness:.32}),G=F.geo;
    const t=new T.Group(),fm=new T.Mesh(G.frontG,[G.ivory,G.ivory,G.ivory,G.ivory,mat,G.ivory]),bm=new T.Mesh(G.backG,G.green);
    bm.position.z=-(FD+BD)/2;fm.castShadow=bm.castShadow=true;t.add(fm,bm);g.add(t);
    const lab=new T.Sprite(new T.SpriteMaterial({map:labelTex(name,col),transparent:true,depthWrite:false}));lab.scale.set(1.9,.6,1);g.add(lab);
    return {t,lab};
  };
  Y.darrin=mk('R','Darrin','#ff5a4e');Y.glenn=mk('p8','Glenn','#5aa8ff');Y.evan=mk('S','Evan','#ffd23f');
  Y.ball=new T.Mesh(new T.SphereGeometry(.28,20,14),new T.MeshStandardMaterial({color:0xb8743d,roughness:.55}));
  Y.ball.scale.set(1.4,.82,.82);Y.ball.castShadow=true;g.add(Y.ball);
};
P.yardStart=function(t0){
  const F=this;if(!F.yard)F.buildYard();const Y=F.yard;
  F.yardOn=true;F.yardT=t0==null?F.now:t0;Y.hit=false;Y.s1=Y.s2=false;Y.hole.visible=false;Y.group.visible=true;
  F.tiles.forEach(o=>{o.g.visible=false});
  F.view({yaw:.28,pitch:.36,zoom:F.port?1.7:.95});F.tlook.set(0,1.2,-1.4);F.sfx('place');
};
P.yardEnd=function(){
  const F=this;if(!F.yardOn)return;F.yardOn=false;
  F.yard.group.visible=false;F.tiles.forEach(o=>{o.g.visible=true});
  F.view({yaw:0,pitch:.5,zoom:1.05});F.tlook.set(0,.7,0);
};
P.yardTick=function(t){
  const F=this,Y=F.yard,u=t-F.yardT,S=F.port?.62:1;
  const cl=k=>Math.max(0,Math.min(1,k)),lerp=(a,b,k)=>a+(b-a)*cl(k),ease=k=>{k=cl(k);return k*k*(3-2*k)};
  const put=(p,x,y,z,rx,rz,ry,sy)=>{sy=sy||1;p.t.position.set(x*S,y*sy+(1-sy)*0,z);p.t.rotation.set(rx||0,ry||0,rz||0);p.t.scale.set(1/Math.sqrt(sy),sy,1);p.lab.position.set(x*S,y+(rx?.95:1.3*sy),z)};
  // Darrin runs the ball, swerves off Glenn's dummy tackle, and goes straight into the wall
  let dx,dz,dy=UP,drx=0,drz=0;
  if(u<1.5){dx=lerp(-6,-1.0,u/1.5);dz=1.5;dy=UP+Math.abs(Math.sin(u*13))*.2;drz=-.2}
  else if(u<1.8){const k=ease((u-1.5)/.3);dx=lerp(-1.0,-.5,k);dz=lerp(1.5,.9,k);dy=UP+Math.sin(k*Math.PI)*.35;drz=lerp(-.2,.45,k)}   // flinches from the hit that never comes
  else if(u<Y_IMPACT){const k=(u-1.8)/(Y_IMPACT-1.8),e=k*k;dx=lerp(-.5,2.6,e);dz=lerp(.9,-3.42,e);dy=UP+Math.abs(Math.sin(u*17))*.14;drz=Math.sin(u*11)*.22;drx=-.22}   // stumbles, can't stop
  else{const k=ease((u-Y_IMPACT)/.7);dx=2.6;dz=lerp(-3.42,-2.2,k);dy=lerp(UP,.38,k)+Math.sin(cl((u-Y_IMPACT)/.7)*Math.PI)*.55;drx=lerp(0,-Math.PI/2,k)}
  put(Y.darrin,dx,dy,dz,drx,drz);
  // Glenn closes in, lunges for the tackle, then pulls out: the fake
  let gx,gz,grz=0,gy=UP,gry=0,gsy=1;
  if(u<1.0){const k=ease(u/1.0);gx=lerp(5.5,1.4,k);gz=lerp(-.6,1.5,k);gy=UP+Math.abs(Math.sin(u*12))*.15}
  else if(u<1.35){const k=ease((u-1.0)/.35);gx=1.4;gz=1.5;gsy=lerp(1,.74,k);grz=lerp(0,-.18,k)}                       // crouches, ready to hit
  else if(u<1.6){const k=ease((u-1.35)/.25);gx=lerp(1.4,.45,k);gz=1.5;gsy=lerp(.74,1.12,k);grz=lerp(-.18,.55,k)}     // lunges in for the tackle
  else if(u<1.95){const k=ease((u-1.6)/.35);gx=lerp(.45,1.4,k);gz=lerp(1.5,3.4,k);gy=UP+Math.sin(k*Math.PI)*.85;gry=k*Math.PI*2;grz=lerp(.55,0,k)}   // ...and gets out of the way: olé
  else{gx=1.4;gz=3.4}
  if(u>Y_IMPACT+.3)gy+=Math.abs(Math.sin(u*9))*.38;
  if(!Y.s1&&u>=1.35){Y.s1=true;F.sfx('remove')}
  if(!Y.s2&&u>=1.62){Y.s2=true;F.sfx('place')}
  put(Y.glenn,gx,gy,gz,0,grz,gry,gsy);
  // Evan waits in the middle of the yard, then cracks up
  let ey=UP+Math.abs(Math.sin(u*3))*.06,erz=Math.sin(u*2)*.06;
  if(u>Y_IMPACT+.2){ey=UP+Math.abs(Math.sin(u*10))*.42;erz=Math.sin(u*14)*.18}
  put(Y.evan,-1.2,ey,-.6,0,erz);
  // the ball: tucked under Darrin's arm, then loose
  if(u<Y_IMPACT){Y.ball.position.set(dx*S+.6,dy+.1,dz+.25);Y.ball.rotation.set(0,0,.4)}
  else{const k=cl((u-Y_IMPACT)/1.0),x0=2.9*S,x1=.9*S;
    Y.ball.position.set(lerp(x0,x1,k),.25+Math.sin(k*Math.PI)*2.4+(k>=1?Math.abs(Math.sin((u-Y_IMPACT-1)*8))*.25*Math.max(0,1-(u-Y_IMPACT-1)):0),lerp(-3.3,-.8,k));
    Y.ball.rotation.z=u*9}
  // the impact
  if(!Y.hit&&u>=Y_IMPACT){Y.hit=true;Y.hole.visible=true;Y.hole.position.set(2.6*S,1.25,.14);
    F.burst(new T.Vector3(2.6*S,1.3,-3.8),0xf6f4ee);F.shake=.5;F.flashNow();F.sfx('discard');F.sfx('wrong');
    F.stamp("THROUGH NAN'S<br>FIBRO WALL",'bad joke',2.2)}
  const w=u-Y_IMPACT;Y.wall.position.x=(w>0&&w<.8)?Math.sin(w*70)*.09*(1-w/.8):0;
  if(u>Y_END)F.yardEnd();
};

/* ---------- scenes ---------- */
const at=(list,t,f)=>list.push([t,f]);
const range=(a,b)=>{const r=[];for(let i=a;i<b;i++)r.push(i);return r};
const SNAKE=['m1','m2','m3','m4','m5','m6','m7','m8','m9','E','S','W','N','N'];
const SCENES=[];

/* 1. Welcome */
(function(){const c=[];
  at(c,0,F=>{F.deal(SNAKE,[14],'rain');F.view({pitch:.9,zoom:1.35,yaw:-.4},true);F.view({pitch:.45,zoom:1,yaw:0});F.stamp('WRIGGLY<br>SNAKE','title',1.6)});
  at(c,1.1,F=>{F.tiles.forEach((t,i)=>{if(i<14)t.snake=true});F.tsnakeA=F.port?.42:1.1});
  at(c,2.05,F=>F.stamp('LIMIT HAND','warn',1));
  range(0,9).forEach(i=>at(c,3.2+i*.13,F=>{F.hop(i);F.tiles[i].tglow=.8;if(i%2===0)F.sfx('place')}));
  at(c,3.3,F=>F.stamp('1 – 9<small>one suit</small>','sm',1.2));
  range(9,13).forEach((i,n)=>at(c,4.75+n*.2,F=>{F.hop(i);F.tiles[i].tglow=.8;F.sfx('place')}));
  at(c,4.8,F=>{F.stamp('+ E S W N','sm',1)});
  at(c,5.8,F=>{F.spinOnce(13);F.tiles[13].tglow=1;F.tiles[12].tglow=1;F.stamp('+ 1 DOUBLED','sm',1.1)});
  at(c,7.2,F=>F.tiles.forEach(t=>t.tglow=0));
  at(c,7.6,F=>{F.view({yaw:.5,pitch:.32,zoom:.85});F.tiles.forEach((t,i)=>{if(i<14)t.tdim=.6});F.stamp('LOOKS LIKE<br>NOTHING…','',2.4)});
  at(c,11.38,F=>{F.tiles.forEach((t,i)=>{if(i<14){t.tdim=0;F.spinOnce(i)}});F.burst(new T.Vector3(0,1.6,.5),0xffd27a);F.flashNow();F.shake=.2;F.sfx('discard');
    F.view({yaw:0,pitch:.45,zoom:1});F.stamp('PAYS THE<br>LIMIT','ok',1.4)});
  range(0,14).forEach(i=>at(c,13.1+i*.08,F=>{F.spinOnce(i);if(i%3===0)F.sfx('place')}));
  at(c,13.2,F=>F.stamp('CHASE IT · THROW IT · FOLD IT','sm',2.4));
  SCENES.push({cues:c});
})();

/* 2. The hand */
(function(){const c=[];const H=13;
  at(c,0,F=>{F.view({pitch:.8,zoom:1.4,yaw:-.3},true);F.view({pitch:.42,zoom:1,yaw:0});
    const s=F.layout([14]);SNAKE.forEach((k,i)=>{F.key(i,k);F.tiles[i].base.copy(s[i])});
    for(let i=0;i<9;i++){const o=F.tiles[i];o.p.set((Math.random()-.5)*16,9+Math.random()*5,-3-Math.random()*4);o.ry=Math.PI+(Math.random()-.5)*3;o.rx=(Math.random()-.5)*2;o.tp.copy(s[i]);o.try=Math.PI;o.trx=0;o.sp=2.6+i*.18}});
  for(let i=0;i<9;i++){at(c,1.4+i*.3,F=>{const o=F.tiles[i];o.try=0;o.tglow=1;F.hop(i);F.sfx('place')});at(c,2.3+i*.3,F=>{F.tiles[i].tglow=0})}
  at(c,1.6,F=>F.stamp('1 – 9<small>one suit · one of each</small>'));
  [[4.87,'EAST'],[5.59,'SOUTH'],[6.49,'WEST'],[7.14,'NORTH']].forEach(([t,name],n)=>{const i=9+n;
    at(c,t-.38,F=>{const o=F.tiles[i];o.tp.copy(o.base);o.p.copy(o.base).add(new T.Vector3(0,10,0));o.ry=0;o.try=0;o.rx=.5;o.trx=0;o.sp=9});
    at(c,t,F=>{F.shake=.28;F.sfx('discard');F.tiles[i].tglow=.8;F.stamp(name,'sm',.9)});
    at(c,t+.5,F=>{F.tiles[i].tglow=0});
  });
  at(c,9.13,F=>{F.stamp('13<small>different tiles</small>','big',1.6);F.view({zoom:.88})});
  for(let i=0;i<13;i++)at(c,9.13+i*.06,F=>{F.hop(i,.65);F.pulse(i)});
  at(c,11.5,F=>{const o=F.tiles[H],x=F.port?.5:1;F.key(H,'N');o.base.copy(F.layout([14])[H]);o.p.set(-10*x,4.6,1.6);o.tp.set(-6.5*x,3.3,1.3);o.ry=0;o.try=0;o.spin=true;o.sp=3;o.tglow=.7;F.view({zoom:1})});
  at(c,12.2,F=>{F.tiles[H].tp.set((F.port?-.5:-1),3.5,1.3)});
  at(c,12.85,F=>{F.tiles[H].tp.set((F.port?2.6:5.2),3.3,1.3)});
  at(c,13.4,F=>{const o=F.tiles[H];o.tp.copy(o.base).add(new T.Vector3(0,1.7,0))});
  at(c,13.72,F=>{const o=F.tiles[H];o.spin=false;o.tp.copy(o.base);o.sp=11});
  at(c,13.93,F=>{F.tiles[12].tglow=1;F.tiles[H].tglow=1;F.burst(F.mid(12,H).add(new T.Vector3(0,.9,.4)),0xffd27a);F.flashNow();F.shake=.18;F.sfx('right');F.stamp('PAIR<small>the 14th tile doubles one</small>','ok',1.4)});
  at(c,15.1,F=>{F.tiles[12].tglow=0;F.tiles[H].tglow=0});
  at(c,15.05,F=>{F.view({pitch:.6,zoom:1.12,yaw:.38});['p5','s3','p8'].forEach((k,n)=>{const i=14+n,o=F.tiles[i],x=(F.port?.5:1)*[-4.5,0,4.5][n];F.key(i,k);o.p.set(x,UP,-14);o.tp.set(x,UP,-14);o.ry=0;o.try=0;o.rx=0;o.trx=0;o.g.position.copy(o.p)})});
  [[15.9,'PUNG'],[16.75,'CHOW'],[17.55,'KONG']].forEach(([t,name],n)=>{
    at(c,t-.5,F=>{const o=F.tiles[14+n];o.tp.z=-2.4;o.sp=5.5});
    at(c,t,F=>{const o=F.tiles[14+n];F.hitBarrier();o.tp.set(o.tp.x,.4,-6);o.trx=-Math.PI/2;o.sp=4;F.shake=.22;F.sfx('wrong');
      F.stamp(name+' ✕','bad',1.1,'left:'+[24,50,76][n]+'%;top:26%')});
  });
  at(c,18.4,F=>F.view({pitch:.42,zoom:1,yaw:0}));
  at(c,18.77,F=>F.stamp('ALL FROM YOUR<br>OWN DRAWS','',1.8));
  for(let i=0;i<14;i++)at(c,18.8+i*.05,F=>F.hop(i,.45));
  at(c,21.25,F=>{[14,15,16].forEach(i=>{F.tiles[i].tp.y=-3;F.tiles[i].sp=3});const o=F.tiles[H];o.tp.set(o.base.x,UP+1.4,-6.5);o.sp=4.5;o.try=Math.PI*2});
  at(c,22.35,F=>{const o=F.tiles[H];o.ry=0;o.try=0;o.p.set(o.base.x,UP+.05,-6.5);o.tp.copy(o.base);o.sp=3.2;o.mat.emissive.set(0x5cf08f);o.tglow=1});
  at(c,23.25,F=>{F.burst(F.tiles[H].base.clone().add(new T.Vector3(0,.9,.3)),0x7ee2a8);F.sfx('place');F.stamp('✓ LAST TILE<small>can come off a discard</small>','ok',1.4)});
  at(c,24.3,F=>{F.tiles[H].tglow=0});
  at(c,24.62,F=>{F.tiles[H].mat.emissive.set(0xffb83d);F.stamp('ONE WARNING','warn',1);F.tlook.copy(F.mid(12,H)).setY(.8);F.view({zoom:.5,pitch:.3,yaw:-.18})});
  at(c,25.85,F=>F.stamp('WHICH TILE<br>CAN PAIR?<small>check your table\'s rule</small>','warn',2.2));
  ['m1','E','m9','N'].forEach((k,n)=>at(c,25.8+n*.62,F=>{const o=F.tiles[H];o.ry=Math.PI;o.try=0;F.key(H,k);o.tglow=k==='N'?0:.5;F.sfx('place')}));
  at(c,28.93,F=>{F.tlook.set(0,.7,0);F.view({zoom:1.2,pitch:.55,yaw:.22});F.stamp('SETTLE IT<small>before you play</small>','',1.5)});
  for(let i=0;i<14;i++)at(c,29.1+i*.05,F=>F.hop(i,.5));
  SCENES.push({cues:c});
})();

/* 3. Counting */
(function(){const c=[];const HAND=['m1','m2','m3','m5','m5','m7','m8','m9','E','S','N','R','G'];
  const NEED=[0,1,2,3,5,6,7,8,9,10];
  at(c,0,F=>{F.deal(HAND,[13],'rain');F.view({pitch:.7,zoom:1.2,yaw:.3},true);F.view({pitch:.45,zoom:1,yaw:0});F.stamp('HOW FAR<br>AWAY?','',1.3)});
  at(c,1.62,F=>F.stamp('ALL SINGLES<small>no sets to find</small>','sm',2));
  at(c,4.43,F=>{range(0,8).forEach(i=>F.hop(i,.4));F.stamp('BEST SUIT<small>characters</small>','sm',1.2);F.sfx('place')});
  NEED.forEach((i,n)=>at(c,5.9+n*.24,F=>{F.tiles[i].tglow=1;F.hop(i,.35);F.hud('<b>'+(n+1)+'</b><span>needed tiles held</span>');if(n%2===0)F.sfx('place')}));
  at(c,8.76,F=>F.stamp('10','big',1.3));
  at(c,10.42,F=>{F.tiles[3].mat.emissive.set(0x5cf08f);F.tiles[4].mat.emissive.set(0x5cf08f);F.tiles[4].tglow=1;F.hop(3);F.hop(4);F.spinOnce(4);F.sfx('right')});
  at(c,11.3,F=>{F.stamp('+1 PAIR<small>a pair of fives</small>','ok',1.4);F.burst(F.mid(3,4).add(new T.Vector3(0,.9,.4)),0x7ee2a8)});
  at(c,13.68,F=>{F.hud('<b>13</b><span>tiles needed</span>');F.view({zoom:1.1,pitch:.5})});
  at(c,14.6,F=>F.hud('<b>13 − 10</b><span>minus what you hold</span>'));
  at(c,15.4,F=>F.hud('<b>13 − 10 − 1</b><span>minus the pair</span>'));
  at(c,16.68,F=>{F.hud('<b>= 2</b><span>steps from ready</span>');F.stamp('2 DRAWS<br>FROM READY','ok',1.6);F.flashNow();F.sfx('right')});
  at(c,18.62,F=>{F.tiles.forEach(t=>t.tglow=0);[11,12].forEach(i=>{F.tiles[i].mat.emissive.set(0xff4a3d);F.tiles[i].tglow=1;F.shakeTile(i)});F.view({zoom:.7,yaw:-.25})});
  at(c,19.98,F=>{[11,12].forEach(i=>{const o=F.tiles[i];o.trx=-Math.PI/2;o.tp.y=.4;o.tdim=1;o.tglow=0});F.stamp('DEAD WEIGHT','bad',1.2);F.sfx('wrong');F.hud('')});
  SCENES.push({cues:c});
})();

/* 4. Commit or not: a 3D bar chart of how far deals start */
(function(){const c=[];
  at(c,0,F=>{F.barGroup.visible=true;F.view({pitch:.75,zoom:1.6,yaw:-.5},true);F.view({pitch:.36,zoom:1.3,yaw:-.18});F.tlook.set(0,1.25,-1.8);F.stamp('SHOULD YOU<br>CHASE IT?','',1.4)});
  F_bars(c,.4);
  at(c,2.51,F=>F.hud('<b>Steps away</b><span>on the deal · % of deals</span>'));
  at(c,3.73,F=>{[0,1].forEach(i=>F.bars[i].tglow=1);F.view({yaw:-.4,zoom:1.15})});
  at(c,5.13,F=>{F.stamp('GO FOR IT<small>4 steps or fewer</small>','ok',1.4);F.sfx('right')});
  at(c,6.95,F=>{[0,1].forEach(i=>F.bars[i].tglow=0);F.bars[2].tglow=1;F.view({yaw:-.12,zoom:1.25})});
  at(c,7.87,F=>{F.stamp('ONLY WITH A<br>HALF-FLUSH BACKUP','warn',2.2);F.sfx('place')});
  at(c,11.07,F=>{F.bars[2].tglow=0;[3,4,5].forEach(i=>F.bars[i].tglow=1);F.view({yaw:.32,zoom:1.2})});
  at(c,12.1,F=>{F.stamp('PLAY NORMALLY<small>6 or more</small>','bad',1.3);F.sfx('wrong')});
  at(c,13.82,F=>{[3,4,5].forEach(i=>{F.bars[i].th=F.bars[i].full*1.12});F.stamp('3 IN 4<small>deals say no</small>','big',2.6);F.shake=.12});
  at(c,15.2,F=>{[3,4,5].forEach(i=>{F.bars[i].th=F.bars[i].full})});
  at(c,17.53,F=>{F.bars.forEach(b=>b.tglow=0);F.view({yaw:0,pitch:.5,zoom:1.4});F.stamp('PATIENCE','',1.4);F.hud('')});
  SCENES.push({cues:c});
})();
function F_bars(c,t0){[0,1,2,3,4,5].forEach(i=>at(c,t0+i*.22,F=>{F.bars[i].th=F.bars[i].full;F.sfx('place')}))}

/* 5. Discard order */
(function(){const c=[];const HAND=['m1','m2','m3','m5','m5','m5','m7','m8','m9','E','S','N','p4','R'];
  let keep=range(0,14);
  const out=(F,i,n)=>{keep=keep.filter(x=>x!==i);F.throwTo(i,F.pile(n),F.pileFlat());F.tiles[i].tglow=0;F.relayout(keep)};
  at(c,0,F=>{keep=range(0,14);F.deal(HAND,[14],'rain');F.view({pitch:.62,zoom:1.15,yaw:-.25},true);F.view({pitch:.5,zoom:1.05,yaw:0});F.stamp('THROW IN<br>THIS ORDER','',2)});
  at(c,3.66,F=>{F.stamp('1 · OTHER SUITS','sm',2.3);F.tiles[12].mat.emissive.set(0xff4a3d);F.tiles[12].tglow=1;F.shakeTile(12)});
  at(c,5.0,F=>out(F,12,0));
  at(c,6.6,F=>F.stamp('HELP NOTHING','bad',.9));
  at(c,8.19,F=>{F.stamp('2 · DRAGONS','sm',2.6);F.tiles[13].mat.emissive.set(0xff4a3d);F.tiles[13].tglow=1;F.shakeTile(13)});
  at(c,9.6,F=>out(F,13,1));
  at(c,10.3,F=>F.stamp('EARLY<small>before they get dangerous</small>','warn',1.6));
  at(c,13.05,F=>{F.stamp('3 · EXTRA COPIES','sm',2.6);[3,4,5].forEach(i=>F.hop(i,.35));F.tiles[5].mat.emissive.set(0xff4a3d);F.tiles[5].tglow=1});
  at(c,14.2,F=>out(F,5,2));
  at(c,15.0,F=>{F.stamp('ONE PAIR<br>IS ENOUGH','ok',1.2);[3,4].forEach(i=>F.pulse(i))});
  at(c,16.71,F=>{const o=F.tiles[6];o.mat.emissive.set(0xff4a3d);o.tglow=1;o.tp.y=UP+.9;o.sp=5;F.view({zoom:.8,pitch:.38})});
  at(c,17.2,F=>{F.shakeTile(6);F.stamp('✕ NEVER<small>break a needed single</small>','bad',2);F.sfx('wrong');F.shake=.15});
  at(c,18.9,F=>{const o=F.tiles[6];o.tp.y=UP;o.tglow=0;o.mat.emissive.set(0xffb83d)});
  SCENES.push({cues:c});
})();

/* 6. When to let it go */
(function(){const c=[];const HAND=['m1','m2','m3','m4','m5','m6','m7','m8','m9','E','W','N','N'];
  at(c,0,F=>{F.deal(HAND,[13],'rain');F.view({pitch:.62,zoom:1.15,yaw:.25},true);F.view({pitch:.55,zoom:1.08,yaw:0});F.stamp('WATCH THE<br>TABLE','',1.3)});
  at(c,1.49,F=>F.stamp('4 COPIES<small>of every tile</small>','sm',1.6));
  [[3.48,0],[5.04,1],[6.15,2],[7.6,3]].forEach(([t,n])=>{
    at(c,t-.45,F=>{const i=13+n,o=F.tiles[i],p=F.pile(n);F.key(i,'S');o.p.set(p.x,7,p.z-5);o.tp.copy(p);o.rx=-1;o.trx=F.pileFlat()?-Math.PI/2:0;o.ry=0;o.try=0;o.sp=6;o.tglow=n===3?1:.4;o.mat.emissive.set(n===3?0xff4a3d:0xffb83d)});
    at(c,t,F=>{F.sfx('discard');F.shake=.1+n*.05;F.hud('<b>'+(n+1)+' / 4</b><span>Souths gone</span>')});
  });
  at(c,8.0,F=>{F.view({zoom:.95,pitch:.6})});
  at(c,8.6,F=>{F.stamp('SNAKE IS<br>DEAD','bad',1.4);F.sfx('wrong');F.hitBarrier();
    range(0,13).forEach(i=>{const o=F.tiles[i];setTimeout(()=>{o.trx=-Math.PI/2;o.tp.y=.4;o.tdim=.85},i*55)})});
  at(c,10.05,F=>{F.stamp('SWITCH PLANS<small>that same turn</small>','warn',1.5);range(0,13).forEach(i=>{const o=F.tiles[i];o.trx=0;o.tp.y=UP;o.tdim=0});F.hud('')});
  at(c,12.28,F=>{range(13,17).forEach(i=>{F.tiles[i].tp.y=-3;F.tiles[i].sp=3});F.view({yaw:.4,pitch:.4,zoom:.95})});
  at(c,13.15,F=>{range(0,9).forEach(i=>F.tiles[i].tglow=.7);F.stamp('THEY SEE<br>YOUR SUIT','warn',1.6)});
  at(c,15.0,F=>{range(0,9).forEach(i=>F.tiles[i].tglow=0);F.view({yaw:0,pitch:.5,zoom:1})});
  at(c,15.3,F=>{F.stamp('WIN ON YOUR<br>OWN DRAW','ok',1.8);F.spinOnce(12);F.tiles[12].tglow=1;F.sfx('right')});
  SCENES.push({cues:c});
})();

/* 7. Backup plan */
(function(){const c=[];
  at(c,0,F=>{F.deal(SNAKE,[14],'rain');F.view({pitch:.62,zoom:1.2,yaw:-.3},true);F.view({pitch:.48,zoom:1.05,yaw:0});F.stamp('SAFETY NET','',1.2)});
  at(c,1.8,F=>{range(0,9).forEach(i=>setTimeout(()=>{F.hop(i,.4)},i*70));range(0,9).forEach(i=>F.tiles[i].tglow=.6)});
  at(c,3.82,F=>{range(0,9).forEach(i=>F.tiles[i].tglow=0);F.relayout(range(0,14),[3,3,3,5]);F.sfx('discard')});
  [0,1,2].forEach(g=>at(c,4.1+g*.35,F=>{[0,1,2].forEach(j=>F.pulse(g*3+j));F.stamp('CHOW','sm',.7,'left:'+[25,50,75][g]+'%;top:20%')}));
  at(c,5.63,F=>{F.relayout(range(0,14),[3,3,3,3,2])});
  at(c,5.9,F=>{[10,11].forEach(i=>{const o=F.tiles[i];o.ry=Math.PI;o.try=0;F.key(i,'E');o.tglow=1});F.sfx('place')});
  at(c,6.4,F=>{[9,10,11].forEach(i=>{F.hop(i,.5);F.tiles[i].tglow=1});F.stamp('PUNG<small>of East</small>','sm',1)});
  at(c,7.3,F=>{[9,10,11].forEach(i=>F.tiles[i].tglow=0);[12,13].forEach(i=>{F.hop(i,.5);F.tiles[i].tglow=1});F.stamp('PAIR<small>of North</small>','sm',.9)});
  at(c,7.95,F=>{[12,13].forEach(i=>F.tiles[i].tglow=0);F.burst(new T.Vector3(0,1.6,.6),0xffd27a);F.flashNow();F.shake=.18;F.sfx('right');
    range(0,14).forEach(i=>F.spinOnce(i));F.stamp('HALF FLUSH<small>+ pure straight</small>','ok',1.8)});
  at(c,10.68,F=>{F.view({yaw:.35,zoom:.95});F.stamp('SNAKE DIES?<br>SLIDE IN','warn',1.6)});
  at(c,13.11,F=>{F.view({yaw:0,zoom:1.1});F.stamp('LOSE ALMOST<br>NOTHING','',1.2)});
  SCENES.push({cues:c});
})();

/* 8. Quick count: three dealt hands, counted live */
(function(){const c=[];
  const DEALS=[['m1','m2','m4','m6','m7','m9','E','N','p3','p8','s2','R','H'],['m1','m2','m3','m4','m6','m8','m9','E','S','W','N','s5','G'],['p2','p5','p5','s1','s4','s9','m3','m7','E','R','R','G','H']];
  const show=(F,d)=>{const keys=DEALS[d];F.tiles.forEach((t,i)=>{if(i<13){t.tdim=0;t.tglow=0;t.mat.emissive.set(0xffb83d)}});F.deal(keys,[13],'rain');F.hud('')};
  const count=(F,d,full)=>{const keys=DEALS[d],r=countHand(keys),need=needOf(r.s);
    keys.forEach((k,i)=>{const t=F.tiles[i];if(need.includes(k))t.tglow=.8;else t.tdim=.7});
    if(full){const v=verdict(r.steps);F.hud('<b>'+r.steps+' steps</b><span>'+SUITNAME[r.s]+' · '+r.have.length+' held'+(r.pair?' · pair':'')+'</span>');F.stamp(v[0],v[1],1.3);F.sfx(r.steps<=4?'right':'wrong')}};
  at(c,0,F=>{F.view({pitch:.5,zoom:1.05,yaw:0},true);F.stamp('QUICK<br>COUNT','',1.2)});
  at(c,1.86,F=>show(F,0));
  at(c,2.92,F=>{const r=countHand(DEALS[0]);DEALS[0].forEach((k,i)=>{if(k[0]===r.s)F.hop(i,.4)});F.stamp('BEST SUIT','sm',.8)});
  at(c,4.3,F=>{const r=countHand(DEALS[0]),need=needOf(r.s);DEALS[0].forEach((k,i)=>{if(need.includes(k))F.tiles[i].tglow=.8});F.hud('<b>'+r.have.length+'</b><span>needed tiles held</span>')});
  at(c,5.75,F=>{F.hud('<b>no pair</b><span>nothing extra off</span>')});
  at(c,6.95,F=>count(F,0,true));
  at(c,8.83,F=>show(F,1));
  at(c,9.75,F=>count(F,1,true));
  at(c,10.18,F=>show(F,2));
  at(c,11.15,F=>count(F,2,true));
  at(c,12.6,F=>{F.hud('');F.stamp('IN SECONDS','ok',1)});
  SCENES.push({cues:c});
})();

/* 9. Practice */
(function(){const c=[];const HAND=['m1','m2','m3','m5','m5','m7','m8','m9','E','S','N','R','p4'];
  at(c,0,F=>{F.deal(HAND,[13],'rain');F.view({pitch:.55,zoom:1.12,yaw:-.25},true);F.view({pitch:.48,zoom:1.05,yaw:0});F.stamp('TRY THIS<br>ONE','',1)});
  at(c,1.47,F=>{range(0,8).forEach(i=>{F.tiles[i].tglow=.6;F.hop(i,.3)});F.stamp('CHARACTERS','sm',1.2)});
  at(c,2.6,F=>{range(0,8).forEach(i=>F.tiles[i].tglow=0);const o=F.tiles[13],s=F.layout([13]),last=s[12];F.key(13,'G');
    o.p.set(last.x+(F.port?2:6),UP+2.5,last.z+1.5);o.tp.set(last.x+(F.port?.4:1.6),UP,last.z+(F.port?1.6:.9));o.ry=0;o.try=0;o.rx=0;o.trx=0;o.sp=5;o.spin=true;o.tglow=1});
  at(c,3.3,F=>{F.tiles[13].spin=false;F.sfx('place');F.stamp('DRAWN','sm',.9)});
  at(c,4.4,F=>{F.tiles[13].tglow=0});
  at(c,4.98,F=>{F.stamp('?','big',1.1);[12,11,3].forEach(i=>F.pulse(i));F.view({zoom:.95})});
  at(c,6.21,F=>{const o=F.tiles[12];o.mat.emissive.set(0x5cf08f);o.tglow=1;F.hop(12,.7)});
  at(c,6.7,F=>{F.throwTo(12,F.pile(1),F.pileFlat());F.burst(F.tiles[12].base.clone().add(new T.Vector3(0,1,0)),0x7ee2a8);F.sfx('right');F.stamp('✓ 4 OF DOTS','ok',1.5)});
  at(c,7.77,F=>{F.stamp('HELPS NEITHER<br>PLAN','sm',1.8);F.tiles[12].tglow=0});
  at(c,10.5,F=>{[11,13].forEach(i=>{F.tiles[i].tglow=.9;F.hop(i,.4)});F.stamp('DRAGONS<br>CAN WAIT','warn',1.2)});
  SCENES.push({cues:c});
})();

/* 10. Finale */
(function(){const c=[];
  at(c,0,F=>{F.deal(SNAKE,[14],'drop');F.tiles.forEach((t,i)=>{if(i<14)t.snake=true});F.tsnakeA=F.port?.42:1.1;F.view({pitch:.3,zoom:.9,yaw:-.4},true);F.view({pitch:.45,zoom:1,yaw:.1});F.sfx('discard');F.stamp('WRIGGLY<br>SNAKE','title',1.2)});
  [[1.79,'COUNT'],[2.94,'COMMIT'],[4.7,'DISCARD'],[6.03,'LET IT GO']].forEach(([t,w],n)=>at(c,t,F=>{F.stamp(w,'sm',1);range(0,14).forEach(i=>{if(i%4===n)F.spinOnce(i)});F.sfx('place')}));
  at(c,7.9,F=>{range(0,14).forEach(i=>F.spinOnce(i));F.burst(new T.Vector3(0,1.6,.5),0xffd27a);F.flashNow();F.shake=.2;F.sfx('discard');F.stamp('SEE YOU AT<br>THE TABLE','ok',2.4);F.view({yaw:0,pitch:.5,zoom:1.15})});
  SCENES.push({cues:c});
})();

window.WSFilm={Film,STEPS,SCENES,countHand,face};
})();
