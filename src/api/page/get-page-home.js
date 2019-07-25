"use strict"

function render() {
  return function(req, res) {
    res.status(200).json("page: home")
  }
}

module.exports = [render]
