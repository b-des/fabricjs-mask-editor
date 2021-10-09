import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Side from './side';
import {App} from "./App";

const onSave = (data) => {
    console.log(data);
}
const onAddSide = () => {
    console.log('onAddSide');
}
const data = {"version":"4.6.0","objects":[{"type":"polygon","version":"4.6.0","originX":"left","originY":"top","left":211.42800000000003,"top":95.382,"width":234.08700000000002,"height":224.091,"fill":"white","stroke":"white","strokeWidth":1,"strokeDashArray":[5,5],"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":213.15079363512586,"y":96.89304996023434},{"x":447.22900858750336,"y":111.48925740604334},{"x":404.95373912400777,"y":257.67124540501993},{"x":346.49814620250663,"y":320.98670649180264}]}],"scaleFactor":2.1}
const data1 = {"version":"4.6.0","objects":[{"type":"polygon","version":"4.6.0","originX":"left","originY":"top","left":211.42800000000003,"top":95.382,"width":234.08700000000002,"height":224.091,"fill":"white","stroke":"white","strokeWidth":1,"strokeDashArray":[5,5],"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":213.15079363512586,"y":96.89304996023434},{"x":447.22900858750336,"y":111.48925740604334},{"x":404.95373912400777,"y":257.67124540501993},{"x":346.49814620250663,"y":320.98670649180264}]}],"scaleFactor":2.1}
const image = 'http://tshirts.imomin.com/img/crew_front.png';
const image1 = 'https://images.ua.prom.st/2586736688_w640_h640_2586736688.jpg';
const sides = [
    {data: data, image: image}, {data: data1, image: image1}
]
ReactDOM.render(
  <React.StrictMode>
    <App onSave={onSave.bind(this)} data={data} image={image} onAddSide={onAddSide} sides={sides}/>
  </React.StrictMode>,
  document.getElementById('root')
);

