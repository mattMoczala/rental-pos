"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.router=void 0;var express=require("express");exports.router=express.Router(),exports.router.get("/",function(e,r){var o="production"==process.env.API_VERSION?"prod":"dev";r.send("rentalAPI - ".concat(o))});