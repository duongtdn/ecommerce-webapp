'use strict'

function html({script, dom}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>ecomm</title>
    <link rel="stylesheet" type="text/css" href="https://www.w3schools.com/w3css/4/w3.css">
	  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Allura|Architects+Daughter|Bad+Script|Cookie|Dancing+Script|Great+Vibes|Indie+Flower|Kalam|Pacifico|Sacramento|Satisfy|Tangerine&display=swap" rel="stylesheet">
    <style>
      /* html {
        background: linear-gradient(to bottom right, #f1f1f1  0%, #ddffff  100%);
        background-attachment:fixed;
        height:100%;
      } */
    </style>
  </head>
  <body>
    <div id="root"> ${dom || ''} </div>
    <script type="text/javascript" src="${script}" ></script>
  </body>
</html>

  `
}

module.exports = html
