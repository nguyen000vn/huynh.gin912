let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
//---Output function-----//
// imgElement.onload = function() {
//   let dub = cv.imread(imgElement);

//   cv.imshow('canvasOutput', dub);
//   dub.delete();
// };

//---Processing function----//
imgElement.onload = function() {            //only execute after image is loaded
  let src = cv.imread(imgElement);          //create a source from HTML image
  //
  let dst_size = new cv.Mat();              //create a blank destination matrix for sized image
  let dsize = new cv.Size(300, 300);        //create a new size ratio for sized image
  //
  let dst_gray = new cv.Mat();              //create a blank destiantion matrix for grayed image
  //
  let ksize = new cv.Size(3, 3);            //create a new kernel for gaussian blurred image
  let dst_gaus = new cv.Mat();              //create a blank destiantion matrix for gaussian blurred image
  //
  let dst_canny = new cv.Mat();
  //
  let dst_contours = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  let contoursColor = new cv.Scalar(255, 255, 255);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  let i = -1;
  var c = 1;
  //
  let dst_box = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  // You can try more different parameters
  cv.resize(src, dst_size, dsize, 0, 0, cv.INTER_AREA);

  cv.cvtColor(dst_size, dst_gray, cv.COLOR_RGBA2GRAY, 0);

  cv.GaussianBlur(dst_gray, dst_gaus, ksize, 0, 0, cv.BORDER_DEFAULT);

  cv.Canny(dst_gaus, dst_canny, 50, 100, 3, false);
  
  cv.findContours(dst_canny, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  let cnt = contours.get(c);
  cv.drawContours(dst_contours, contours, i, contoursColor, -1, 8, hierarchy, 100);
  let len = contours.size();
  document.getElementById("len").innerHTML = len;

  // let Mo = cv.Mat.ones(5, 5, cv.CV_8UC3);
  // let dst_morphed = new cv.Mat();
  // cv.morphologyEx(dst_contours, dst_morphed, cv.MORPH_ClOSE, Mo);

  let rect = cv.boundingRect(cnt);
  let rectangleColor = new cv.Scalar(255, 0, 0);
  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  cv.rectangle(dst_box, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  let dst_boxed = new cv.Mat();
  //let mask1 = new cv.Mat();
  //let dtype = -1;
  //cv.add(dst_contours, dst_box, dst_boxed, mask1, dtype);

  let dst_roi_cnt = new cv.Mat();
  let dst_roi_src = new cv.Mat();
  dst_roi_cnt = dst_contours.roi(rect);
  dst_roi_src = src.roi(rect);


  cv.imshow('canvasOutput', dst_contours);
 // cv.imshow('sized',dst_size);
  cv.imshow('test',dst_roi_cnt);
  cv.imshow('test2',dst_roi_src);

  let imgElement1 = document.getElementById('test');
  let imgElement2 = document.getElementById('test2');
  let src1 = cv.imread(imgElement1);
  let src2 = cv.imread(imgElement2);
  let res = new cv.Mat();
  cv.bitwise_and(src1, src2, res);
  cv.imshow('result', res);
 
  // img = document.getElementById('result');
  // imgData = getBase64Image(img);
  // localStorage.setItem("imgData", imgData);
  //console.log(imgData);

  let canvas = document.getElementById('result');
  let dataURL = canvas.toDataURL('image/png', 1.0);
  console.log(dataURL);
  localStorage.setItem("nho", dataURL);
  // let base64url = String(dataURL);
  // document.getElementById("base64url").innerHTML = base64url;

  src.delete(); dst_size.delete(); dst_gray.delete(); dst_gaus.delete();
  dst_canny.delete(); dst_contours.delete(); dst_box.delete(); 
  dst_boxed.delete(); res.delete(); dst_roi_src.delete(); dst_roi_cnt.delete();
  src1.delete(); src2.delete();  
}
// var a = localStorage.getItem('imgData');
// console.log(a);
// function onOpenCvReady() {
//   document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
// }