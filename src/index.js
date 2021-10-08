import { Archi } from "./archimg";
import { animate } from "motion";

// initialize Archi library with location of S3 bucket
//var archi = new Archi("https://archcons-images.s3.nl-ams.scw.cloud");
var archi = new Archi("https://ik.imagekit.io/archconsciousness/");

let coverurl = archi.cover("deappel", "arm-b-2");
console.log(`Cover for item: ${coverurl}`);

let dec = 100;
let opc = 100;

setInterval(() => {
  let opcnow = 100 / opc;
  animate(
    ".card",
    {
      opacity: opcnow,
      transform: `translateX(${dec}%)`
    },
    { duration: 0.5, ease: "ease-out" }
  );
  opc += 100;
  dec += 100;
}, 2000);

/*
collection "cdp":

5842__cvr.jpg
588__cvr.jpg
5893__cvr.jpg
5958__cvr.jpg
6013__cvr.jpg
6133__cvr.jpg
6169__cvr.jpg
6169__cvr2.jpg
6169__cvr3.jpg
6179__cvr.jpg
6931__cvr2.jpg
7495__cvr.jpg
79__cvr.jpg

collection "deappel":
arm-b-2__cvr.jpg
arm-b-5__cvr.jpg
emi-t-1__cvr.jpg
gra-d-17__cvr.jpg
gra-d-9__cvr.jpg
mar-a-2__cvr.jpg
mar-r-3__cvr.jpg
mol-8__cvr.jpg
mol-p-10__cvr.jpg
pai-n-5__cvr.jpg
pee-3__cvr.jpg
sag-SN__cvr.jpg

*/
