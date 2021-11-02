import { Archi } from "./archimg";
import { animate } from "motion";
import { randstr } from "./idrand";

// this is the one that seems to work:
// https://github.com/lunchboxer/graphql-subscriptions-client
import { SubscriptionClient } from "graphql-subscriptions-client";
import { SUB_TABLE_STREAM_LAST, SUB_TABLE_STREAM_FULL } from "./queries";

import { _ } from "lodash";
//const _ = require("lodash")

// get ready
const GRAPHQL_ENDPOINT =
  "wss://archcons-dev.eu-central-1.aws.cloud.dgraph.io/graphql";

const query = SUB_TABLE_STREAM_LAST;

// timestamp of item that was last added to the table
var last = null;

let dec = 100;
let opc = 100;
var current = null;

const MISSING_IMG = "https://dummyimage.com/360x550/aaa/999";
var archi = new Archi("https://ik.imagekit.io/archconsciousness/");

var firstTime = true;
var currentItem = null;

function shift_cards_right() {
  let opcnow = 100 / opc;

  if (current) {
    current.classList.toggle("current");
  }

  var cards = document.querySelectorAll(".card img");
  Array.from(cards).forEach((el) => {
    el.style.boxShadow = "none";
  });

  // animate(
  //   ".card",
  //   {
  //     opacity: opcnow,
  //     transform: `translateX(${dec}%)`
  //   },
  //   { duration: 0.5, ease: "ease-out" }
  // );
  opc += 100;
  dec += 100;
}

function handle_metadata() {
  if (!_.isEmpty(currentItem.what.meta)) {
    let meta = JSON.parse(currentItem.what.meta);
    console.log(`Book metadata ${meta}`);
  }
}

function update_book_info() {
  // different collections have different needs to describe specific items
  // some of these needs are in the metadata section of the item
  // and they might affect the display of book information
  handle_metadata();

  if (!_.isEmpty(currentItem)) {
    document.getElementById("deposit-title").innerHTML = currentItem.what.title;
    if (_.isEmpty(currentItem.what.author)) {
      document.getElementById("deposit-author").firstChild.innerHTML =
        "Unknown";
    } else {
      document.getElementById("deposit-author").firstChild.innerHTML =
        currentItem.what.author.name;
    }
    document.getElementById("deposit-locator").firstChild.innerHTML =
      currentItem.what.locator;
  }
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function html_to_dom(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function append_card_for_current() {
  console.log(
    `institution: ${currentItem.what.institution.short}, locator: ${currentItem.what.locator}`
  );
  let coverurl = archi.cover(
    currentItem.what.institution.short,
    currentItem.what.locator
  );

  console.log(coverurl);

  // let placeholder = archi.cover("deappel", "arm-b-2")
  // console.log(`Cover for item: ${coverurl}`)

  // let newHtml = `
  // <div class="card">
  //   <img id="cover__${currentItem.what.locator}" src="" />
  // </div>
  // `
  // let newCard = html_to_dom( newHtml )

  var div = document.createElement("div");
  div.id = randstr("card__");
  div.classList.toggle("card");
  div.classList.toggle("current");
  var img = document.createElement("img");
  img.id = randstr("cover__");
  img.src = coverurl;
  //img.onerror = `this.src="${MISSING_IMG}"`
  div.appendChild(img);

  current = div;

  var dominsert = document.getElementById("carousel");
  dominsert.insertBefore(div, dominsert.firstChild);

  animate(
    ".card",
    {
      opacity: 0.8,
      transform: `scale(1.0) translateX(380px)`
    },
    { duration: 0.5, ease: "ease-out" }
  );

  animate(
    ".current img",
    {
      "box-shadow": `0 0 32px -8px #ffffff`
    },
    { duration: 0.5, ease: "ease-out" }
  );

  /*
// Create a new element
var newNode = document.createElement('div');

// Get the parent node
var parentNode = document.querySelector('#some-element');

// Insert the new node before the reference node
parentNode.insertBefore(newNode, parentNode.firstChild);
*/
}

// set up the client, which can be reused
const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  lazy: true, // only connect when there is a query
  connectionCallback: (error) => {
    error && console.error(error);
  }
});

// make the actual request
client.request({ query });

// call subscription.unsubscribe() later to clean up
const subscription = client.request({ query }).subscribe({
  next({ data }) {
    if (data) {
      // check if this is the first request
      if (firstTime) {
        firstTime = !firstTime;
        console.log("This was the first request");
      }

      if (!_.isEmpty(data["queryTableLog"])) {
        console.log(">> received: ", data["queryTableLog"]);

        // pop the last element in the list
        currentItem = _.head(data["queryTableLog"]);
        console.log(">> current item: ", currentItem);

        // if book has been entered show it
        if (currentItem.action === "entered") {
          update_book_info(); // update book info display
          shift_cards_right(); // shift all other books to the right
          append_card_for_current(); // add image for current entry
        } else {
          // if book was removed
          shift_cards_right(); // shift all other books to the right
        }
      } // if result set not empty
    } // if data was received
  } // fn
}); // subscription

// handle missing images in carousel
document.addEventListener(
  "error",
  (e) => {
    //alert("Failed image")
    console.log(e);
    e.target.src = `${MISSING_IMG}`;
  },
  true
);

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
