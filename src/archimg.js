const ImageKit = require("imagekit-javascript")
const _ = require("lodash")

/**
 * ARCHCONS image lookup library
 *
 * (cc) 2021 studio derfunke
 */
function Archi(bucketaddr) {
  console.log(`Archi image library points to bucket ${bucketaddr}`)

  // initialize ImageKit api
  this.ikit = new ImageKit({
    urlEndpoint: bucketaddr
  })

  this.cover = function (col, ref, xform = [{ height: 550, width: 360 }]) {
    return this.ikit.url({
      // path: `/collections/${col}/scans/${ref}__cvr.jpg`,
      path: `/collections/${col}/scans/${ref}__cvr.jpg`,
      transformation: [...xform]
    })
  }

  // from https://github.com/imagekit-developer/imagekit-javascript
  // https://archcons-images.s3.nl-ams.scw.cloud/collections/deappel/arm-b-2__00002.jpg
  this.lookup = function (col, ref, plate, xform) {
    return this.ikit.url({
      path: `/collections/${col}/scans/${ref}__${plate}.jpg`,
      // path: "/collections/deappel/arm-b-2__00002.jpg",
      transformation: [...xform]
    })
  } // lookup

  /*
      transformation: [
        {
          height: 500,
          width: 350,
          radius: 8
        }
      ]

      var transformation = [{ height: 500, width: 350, radius: 8 }]
*/
  // document.getElementById("cover").src = imageURL
} // class Archi

//var ARCHI = new Archi();

export { Archi }
