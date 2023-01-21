var express = require('express');
var morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
const cors = require('cors');
var methodOverride = require('method-override');
require('dotenv').config();
// override with POST having ?_method=DELETE
const port = process.env.PORT || 3000;
const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

app.use(methodOverride('_method'));


const route = require('./routes');
const db = require('./config/db');

// middleware để xử lý việc gửi dữ liệu từ form

app.use(express.urlencoded({ extended: true }));

// middleware để xử lý việc gửi dữ liệu từ client bằng các cách như XmlHttp , Fetch, Axios

app.use(express.json());

// Static file
app.use(express.static(path.join(__dirname, 'public/')));

// logger mogan
app.use(morgan('dev'));

// template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

//  Routes init
route(app);

// Connect to MongoDB
db.connect();
// CORS

// Handlebar numberal
var Handlebars = require("handlebars");
var NumeralHelper = require("handlebars.numeral");
NumeralHelper.registerHelpers(Handlebars);

// Handlebar helper
Handlebars.registerHelper('activeFirstSize', (productInforObject) => {
  const productSizeList = productInforObject.data.root.productInfor.productSize;
  const selectBtnHtml =  productSizeList.map((size, index) => {
      if(index === 0 ) {          
        return `<li class="selectSize__btn--item active">${size}</li>`
    }
      else {
         return `<li class="selectSize__btn--item">${size}</li>`

      }
  });

  return selectBtnHtml.join("").toString();
    
 });

 // Handlebar helper
Handlebars.registerHelper('activeFirstProuctImg', (productInforObject) => {
  const productImgList = productInforObject.data.root.productInfor.productImg;
  const productImgsHtml =  productImgList.map((url, index) => {
      if(index === 0 ) {          
        return `<img class="detailProduct__img--item active" data-index=${index} src="${url}" alt="">`
    }
      else {
        return `<img class="detailProduct__img--item" data-index=${index} src="${url}" alt="">`

      }
      // <img class="detailProduct__img--item" src="{{this}}" alt="">

  });

  return productImgsHtml.join("").toString();
    
 });

 app.listen(port, () => {
  console.log('Listen in 127.0.0.1:3000');
});
