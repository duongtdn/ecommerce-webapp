'use strict'

function html({script, data, dom}) {
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
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swa" rel="stylesheet">
    <style>
      /* html {
        background: linear-gradient(to bottom right, #f1f1f1  0%, #ddffff  100%);
        background-attachment:fixed;
        height:100%;
      } */
      .embed-responsive {
        position : relative;
        padding-bottom : 56.25%;
        padding-top : 0px;
        height : 100%;
        overflow : hidden;
        clear : both;
      }
      .embed-responsive iframe,
      .embed-responsive img {
        position : absolute;
        top : 0;
        left : 0;
        width : 100%;
        height : 100%;
        border: 0;
      }
      .cursor-pointer {
        cursor: pointer;
      }
      .bold {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div id="root">${dom || ''}</div>
    <script type="text/javascript"> __data = ${JSON.stringify(data)} </script>
    <script type="text/javascript" src="${script}" ></script>
  </body>
</html>

  `
}

module.exports = html
