"use strict";var __awaiter=this&&this.__awaiter||function(e,s,i,u){return new(i=i||Promise)(function(n,t){function r(e){try{o(u.next(e))}catch(e){t(e)}}function a(e){try{o(u.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?n(e.value):((t=e.value)instanceof i?t:new i(function(e){e(t)})).then(r,a)}o((u=u.apply(e,s||[])).next())})},__generator=this&&this.__generator||function(r,a){var o,s,i,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},e={next:t(0),throw:t(1),return:t(2)};return"function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function t(n){return function(e){var t=[n,e];if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,s&&(i=2&t[0]?s.return:t[0]?s.throw||((i=s.return)&&i.call(s),0):s.next)&&!(i=i.call(s,t[1])).done)return i;switch(s=0,(t=i?[2&t[0],i.value]:t)[0]){case 0:case 1:i=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,s=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(!(i=0<(i=u.trys).length&&i[i.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!i||t[1]>i[0]&&t[1]<i[3])){u.label=t[1];break}if(6===t[0]&&u.label<i[1]){u.label=i[1],i=t;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(t);break}i[2]&&u.ops.pop(),u.trys.pop();continue}t=a.call(r,u)}catch(e){t=[6,e],s=0}finally{o=i=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},express=(Object.defineProperty(exports,"__esModule",{value:!0}),exports.router=void 0,require("express")),rental_1=require("../models/rental"),logger_1=require("../logger");exports.router=express.Router(),exports.router.get("/",function(t,r,e){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){switch(e.label){case 0:return t.query.getOnlyOngoing?[4,rental_1.default.find({ongoing:!0}).populate("client").populate("rented").exec(function(e,t){var n;e?(console.log(e),n={status:"err",data:{message:"Server error occured."}},r.status(500)):(n={status:"succ",data:t},r.status(200)),r.set({"content-type":"application/json"}),r.send(JSON.stringify(n))})]:[3,2];case 1:return e.sent(),[3,4];case 2:return[4,rental_1.default.find().populate("client").populate("rented").exec(function(e,t){var n;e?(console.log(e),n={status:"err",data:{message:"Server error occured."}},r.status(500)):(n={status:"succ",data:t},r.status(200)),r.set({"content-type":"application/json"}),r.send(JSON.stringify(n))})];case 3:e.sent(),e.label=4;case 4:return[2]}})})}),exports.router.post("/",function(t,n,e){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return new rental_1.default({priceTotal:t.body.priceTotal,startDate:t.body.startDate,endDate:t.body.endDate,ongoing:!0,rented:t.body.rented,client:t.body.client}).save().then(function(e){e={status:"succ",data:{message:'Succesfully created rental to client "'.concat(t.body.client,'".'),data:e}};(0,logger_1.logAction)(e.data.message,"info"),n.status(201),n.set({"contnet-type":"application/json"}),n.send(JSON.stringify(e))}),[2]})})}),exports.router.get("/changeRentalStatus",function(n,r,e){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){switch(e.label){case 0:return[4,rental_1.default.findById(n.query.id).exec(function(e,t){e?((0,logger_1.logAction)('GET /rent/changeRentalStatus\tProvided parameter id, "'.concat(n.query.id,'"  is invalid or does not exist in database.'),"error"),e={status:"err",data:{message:'GET /rent/changeRentalStatus\tProvided parameter id: "'.concat(n.query.id,'"  is invalid or does not exist in database.')}},r.status(420),r.set({"content-type":"application/json"}),r.send(JSON.stringify(e))):rental_1.default.findByIdAndUpdate(n.query.id,{ongoing:!t.ongoing}).exec(function(){var e={status:"succ",data:{message:'rental "'.concat(n.query.id,'" status changed.'),currentStatus:!t.ongoing}};(0,logger_1.logAction)(e.data.message,"info"),r.status(200),r.set({"content-type":"application/json"}),r.send(JSON.stringify(e))})})];case 1:return e.sent(),[2]}})})});