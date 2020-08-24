const mysql = require('mysql');
const session = require('express-session');
const { Session } = require('selenium-webdriver');

const connectinfo = {
    user: 'kibcs1212' ,
    password: '12345678',
    host: 'gondr.asuscomm.com'
};

const con = mysql.createConnection(connectinfo);
con.query('USE kibcs1212');

function query(sql,data){
    return new Promise((res,rej)=>{
        con.query(sql,data,(err,result)=>{
            if(err) rej(err)
            else res(result)
        });
    });
}

async function register(req,res,{id,name,password,passwordc}){
    if(id.trim() === ''){
        res.json({success:false,msg:'id칸이 공백입니다.',target:'id'});
        return;
    }
    if(name.trim() === ''){
        res.json({success:false,msg:'이름칸이 공백입니다.',target:'name'});
        return;
    }
    if(password.trim() === ''){
        res.json({success:false,msg:'비밀번호칸이 공백입니다.',target:'password'});
        return;
    }
    if(passwordc.trim() === ''){
        res.json({success:false,msg:'비밀번호 확인 칸이 공백입니다.',target:'passwordc'});
        return;
    }
    if(id.length > 10){
        res.json({success:false,msg:'아이디는 10글자 이내로 작성해주세요'});
        return;
    }
    if(name.length > 10){
        res.json({success:false,msg:'이름은 10글자 이내로 작성해주세요'});
        return;
    }

    if(password !== passwordc){
        res.json({success:false,msg:'비밀번호와 비밀번호 확인이 일치하지 않습니다.',target:'password/passwordc'});
        return;    
    }

    let sql = "INSERT INTO todo_users (id,name,password,level,exp,profile,point) VALUES (?,?,PASSWORD(?),?,?,?,?)";
    try {
        let result = await query(sql,[id,name,password,1,0,'/levelimg/lv1.jpg',1000]);
        req.session.flashMsg = '첫 가입 성공! 혜택 1000point 지급!';
        
        res.json({success:true,msg:'첫 가입 성공! 혜택 1000point 지급!'});
        
    } catch (error) {
        console.log(error);
        res.render('error',{title:'DB ERROR', msg:err.code});
        return;
    }

}

async function login(req,res,{id,password}){
    if(id.trim() === '' || password.trim() === ''){
        res.json({success:false,msg:"아이디와 패스워드가 입력되지 않았습니다."});
        return;
    }
    try {
        let sql = "SELECT * FROM todo_users WHERE id=? AND password=PASSWORD(?)";
        let result = await query(sql,[id,password]);
        if(result.length == 1){
            req.session.user = result[0];
            req.session.flashMsg = {msg:"로그인 성공"};
            console.log(req.session.user);
            res.json({success:true, user:req.session.user});
        }else{
            req.session.flashMsg = {msg:'존재하지 않는 회원입니다. 아이디나 비밀번호를 다시 한번 확인해주세요'};
            res.json({success:false,msg:"존재하지 않는 회원입니다.아이디나 비밀번호를 다시 한번 확인해주세요"});
        }
    } catch (error) {
        console.log(error);
        res.render('error',{title:'DB ERROR', msg:err.code});
        return;
    }
}

async function getUserList(req,res,{id}){
    try {
        let sql = "SELECT * FROM todo_users WHERE id = ?";
        let result = await query(sql,[id]);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.render('error',{title:'DB ERROR', msg:err.code});
        return;
    }
}

async function getMissionList(req,res){
    try {
        let sql = "SELECT m.id,m.writer,t.name,m.title,m.content,m.date,m.file FROM missions_board m , todo_users t WHERE m.writer = t.id ORDER BY m.id DESC";
        let list = await query(sql,[]);
        res.json(list);
    } catch (err) {
        console.log(err);
        res.render('error',{title:'DB ERROR', msg:err.code});
        return;
    }
}

async function addMissionBoard(req,res,{title,content},file=''){
    if(title.trim() === '' || content.trim() === ''){
        res.json({success:false,msg:"공백칸이 있습니다. 확인해주세요"});
        return;
    }
    try {
        let sql1 = "UPDATE todo_users SET point=point+500,exp=exp+50 WHERE id=?";
        await query(sql1,[req.session.user.id]); 

        let user = "SELECT * FROM todo_users WHERE id=?";
        let result = await query(user,[req.session.user.id]);
        req.session.user = result[0];
         
        sql = "INSERT INTO missions_board (date,title,content,file,writer) VALUES (NOW(),?,?,?,?)";
        let filelocal = `/upload/${file}`;
        await query(sql,[title,content,filelocal,req.session.user.id]);
        res.redirect('/mission');
    }catch (err) {
        console.log(err);
        return;
    }
}

async function deleteMissionBoard(req,res,{id}){
    let sql = "DELETE FROM missions_board WHERE id=?";
    try {
        let result = await query(sql,[id]);
        res.json({msg:'성공적으로 글이 삭제되었습니다.',success:true});
    } catch (err) {
        console.log(err);
        return;
    }
}

async function updateMissionBoard(req,res,{id,title,content}){
    let sql = "UPDATE missions_board SET title=?,content=? WHERE id=?";
    try {
        let result = await query(sql,[title,content,id]);
        res.json({msg:'성공적으로 글이 수정되었습니다.',success:true});
    }catch (err) {
        console.log(err);
        return;
    }
}

async function getMissionBoardId(req,res,{id}){
    let sql = "SELECT * FROM missions_board WHERE id=?";
    try {
        let result = await query(sql,[id]);
        res.json({msg:'성공적으로 글을 불러왔습니다.',board:result,success:true});
        
    } catch (err) {
        console.log(err);
        return;
    }
}

async function profile_update(req,res,{id,file}){
    let sql = "UPDATE todo_users SET profile=? WHERE id=?";
    try {
        await query(sql,[file,id]);
        sql = "SELECT * FROM todo_users WHERE id=?";
        let result = query(sql,[id]);
        req.session.user = result[0];
        res.json({msg:'성공적으로 프로필을 변경하였습니다.',success:true});
    } catch (err) {
        console.log(err);
        return;
    }
}

async function getUserProfile(req,res,{id}){
    let sql = "SELECT t.profile,t.id,t.name FROM todo_users t , missions_board m WHERE t.id = m.writer AND m.id = ?";
    try {
        let result = await query(sql,[id]);
        res.json({success:true,user:result});
    }catch (err) {
        console.log(err);
        return;
    }
}

module.exports.getUserProfile = getUserProfile;
module.exports.profile_update = profile_update;
module.exports.getMissionBoardId = getMissionBoardId;
module.exports.updateMissionBoard = updateMissionBoard;
module.exports.deleteMissionBoard = deleteMissionBoard;
module.exports.addMissionBoard = addMissionBoard;
module.exports.register = register;
module.exports.login =login;
module.exports.con = con;
module.exports.query = query;
module.exports.getMissionList = getMissionList;