let express = require('express');
let path = require('path');
let http = require('http');
const bodyParser = require('body-parser');
const multer = require('multer');
const request = require('request');

const session = require('express-session');
const cookieSecret = 'kibcs1212';

const { login, getMissionList, register, addMissionBoard,deleteMissionBoard,updateMissionBoard , getMissionBoardId, profile_update , getUserProfile} = require('./db/DB');
const { render } = require('ejs');

let app = express();
``
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: cookieSecret
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    if (req.session.flashMsg !== undefined) {
        res.locals.flash = req.session.flashMsg;
        delete req.session.flashMsg;
    }
    if (req.session.user !== undefined) {
        res.locals.user = req.session.user;
    }
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/getLogin',(req,res)=>{
    res.json({user:req.session.user});
})

app.get('/mission', (req, res) => {
    if (req.session.user === undefined) {
        res.render('index');
    } else {
        res.render('missionList');
    }
    // res.json();
});

app.post('/register', (req, res) => {
    register(req, res, req.body);
})

app.post('/login', (req, res) => {
    login(req, res, req.body);
});

app.get('/logout', (req, res) => {
    delete req.session.user;
    req.session.flash = { msg: "로그아웃 성공" };
    res.redirect('/');
});

app.get('/getMissionList', (req, res) => {
    getMissionList(req, res);
});

app.get('/shop', (req, res) => {
    if (req.session.user === undefined) {
        res.render('index');
    } else {
        if (req.query.word !== undefined) {
            const client_id = 'jXo4LFaHBDG9h8eaa8WC';
            const client_secret = 'U9EBh0N_tu';

            let api_url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURI(req.query.word)}&display=60`; // json 결과
            var options = {
                url: api_url,
                headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
            };

            request.get(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let json = JSON.parse(body);
                    //console.log(json.items);

                    res.render('shop', { list: json.items });

                } else {
                    console.log('error = ' + response.statusCode);
                }
            });

        } else {
            res.render('shop');
        }
    }
});


const uploadFolder = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/upload/');
        }, filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + file.originalname);
        }
    }), limits: { fileSize: 5 * 1024 * 1024 }
}); // 5메가 제한으로 upload 폴더에 저장

app.get('/missionWrite', (req, res) => {
    if (req.session.user === undefined) {
        res.render('index');
    } else {
        res.render('mission_write');
    }
});;

//uploadFolder.single('img') = 하나의 폴더를 받는것. 여러개는 array 로 받아오면 됨
//'img'는 내가 준 name
app.post('/missionWrite', uploadFolder.single('files'), (req, res) => {
    addMissionBoard(req, res, req.body, req.file.filename);
});

app.post('/missionParticipation', (req, res) => {
    console.log(req.body);
});

app.get('/getExpBoard', (req, res) => {
    getExpBoards(req, res, req.session.user.level);
});

app.get('/user_update_list', (req, res) => {
    res.render('user_update_list');
});

app.get('/profile_update_list', (req, res) => {
    res.render('profile_update_list');
});

app.post('/deleteMissionBoard',(req,res)=>{
    deleteMissionBoard(req,res,req.body);
});

app.post('/getMissionBoardId',(req,res)=>{
    getMissionBoardId(req,res,req.body);
});

app.post('/updateMissionBoard',(req,res)=>{
    updateMissionBoard(req,res,req.body);
});

app.post('/profile_update',(req,res)=>{
    profile_update(req,res,req.body);
});

app.post('/getUserProfile',(req,res)=>{
    getUserProfile(req,res,req.body);
})

app.listen(56000, () => {
    console.log("56000포트에 정상 작동 중입니다.");
});