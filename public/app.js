
window.onload = ()=>{
    var a2 = new Vue({
        el:"#loginForm",
        data:{
            noticeColor:['#fff','#999'],
            pStyle:{
                color:'#999'
            },
            idx:0,
            loginFormClass:{
                forms:true,
                toTopOn:false,
                displayNoneOn:false,
                border_success_green:false
            },
            inputPass:'',
            inputId:'',
            nowUser:[],
            alert:'',
            check:{
                border_alert_red : false,
                border_success_green : false
            }
        },
        mounted(){
            setInterval(() => {
                this.pStyle.color = this.noticeColor[this.idx];
                this.idx = (this.idx+1) %  this.noticeColor.length;
            }, 1400);
        },
        methods:{
            exit_login_popup(value = true){
                this.loginFormClass.toTopOn = value;
                setTimeout(() => {
                    this.loginFormClass.displayNoneOn = value;
                }, 1000);
            },
            login(){
                axios.post('/login',{id:this.inputId, password:this.inputPass}).then( response => {
                    let data = response.data;
                    if(data.success){
                        this.nowUser = data.user;
                        console.log(data.user);
                        this.check.border_success_green = true;
                        
                        setTimeout(() => {
                            this.exit_login_popup(true);
                        }, 400);
                    
                        setTimeout(() => {
                            location.href="/";
                        }, 700);
                        
                    }else{
                        this.alert = data.msg;
                        this.check.border_alert_red = true;
                    }
                    
                });
                
            },registerPage(){
                a3.registerFormClass.displayNoneOn = false;
                setTimeout(() => {
                    a3.registerFormClass.toTopOn = false;
                }, 500);
            }
        }
    });
    var a3 = new Vue({
        el:"#registerForm",
        data:{
            registerFormClass:{
                forms:true,
                toTopOn:true,
                displayNoneOn:true
            },
            registerInputId:'',
            registerInputName:'',
            registerInputPassword:'',
            registerInputPasswordc:'',
            check1:{
                border_alert_red : false,
                border_success_green : false
            },
            check2:{
                border_alert_red : false,
                border_success_green : false
            },
            check3:{
                border_alert_red : false,
                border_success_green : false
            },
            check4:{
                border_alert_red : false,
                border_success_green : false
            },
            id_alert:'',
            name_alert:'',
            pass_alert:'',
            passc_alert:'',
            info:'첫 회원가입시 1000POINT 무료!',
            colorChangeInfo:{
                red:false,
                green:false
            }
        },
        methods:{
            exit_register_popup(){
                this.registerFormClass.toTopOn = true;
                setTimeout(() => {
                    this.registerFormClass.displayNoneOn = true;
                }, 1000);
            },
            register(){
                axios.post('/register',{id:this.registerInputId,name:this.registerInputName,password:this.registerInputPassword,passwordc:this.registerInputPasswordc}).then(response =>{
                    let data = response.data;
                    if(data.success){
                        this.info = data.msg;
                        this.colorChangeInfo.red = false;
                        this.colorChangeInfo.green = true;
                        setTimeout(() => {
                            this.exit_register_popup();
                        }, 400);
                    
                        setTimeout(() => {
                            location.href="/";
                        }, 700);

                    }else{
                        this.colorChangeInfo.red = true;
                        this.colorChangeInfo.green = false;
                        this.info = data.msg;
                    }
                });
            }
        },
        computed:{
            register_ch(){
                if(this.registerInputId.length>10){
                    this.id_alert = '아이디는 10글자 이내로 해야합니다.';
                    this.check1.border_success_green = false;
                    this.check1.border_alert_red = true;
                }else if(this.registerInputId.length <= 10){
                    this.id_alert = '';
                    this.check1.border_alert_red = false;
                    this.check1.border_success_green = true;
                }

                if(this.registerInputName.length>10){
                    this.name_alert = '이름은 10글자 이내로 해야합니다.';
                    this.check2.border_success_green = false;
                    this.check2.border_alert_red = true;
                }else if(this.registerInputId.length <= 10){
                    this.name_alert = '';
                    this.check2.border_alert_red = false;
                    this.check2.border_success_green = true;
                }

                if(this.registerInputPassword !== this.registerInputPasswordc){
                    this.passc_alert = '비밀번호와 비밀번호 확인이 서로 맞지 않습니다.';
                    this.check3.border_success_green = false;
                    this.check4.border_success_green = false;
                    this.check3.border_alert_red = true;
                    this.check4.border_alert_red = true;
                }else if(this.registerInputPassword === this.registerInputPasswordc){
                    this.passc_alert = '';
                    this.check3.border_alert_red = false;
                    this.check3.border_success_green = true;
                    this.check4.border_alert_red = false;
                    this.check4.border_success_green = true;
                }

            }
        }
    });

    var a4 = new Vue({
        el:"#missionList",
        data:{
            list:[],
            loginUser:[],
            logId:'',
            msg:'',
            msgOnClass:{
                msg_on:false
            },
            boardId:'',
            boardTitle:'',
            boardContent:'',
            missionUpdateFormClass:{
                toTopOn:true,
                displayNoneOn:true
            },
            profileFormClass:{
                toTopOn:true,
                displayNoneOn:true
            },
            mission_update_title:'',
            mission_update_content:'',
            update_info:'',
            getUserid:'',
            getUProfile:'',
            getUserName:''
            
        },
        beforeMount(){
            axios.get('/getMissionList').then(res=>{
                this.list = res.data;
            })
        },
        methods:{
            deleteMissionBoard(item_id){
                axios.post('/deleteMissionBoard',{id:item_id}).then(res=>{
                    if(res.data.success){
                        this.msg = res.data.msg;
                        this.msgOnClass.msg_on = true;
                        setTimeout(() => {
                            this.msgOnClass.msg_on = false;
                        }, 1800);
                        setTimeout(() => {
                            location.href='/mission';
                        }, 1900);
                    }
                })
            },
            getMissionBoardId(item_id){
                axios.post('/getMissionBoardId',{id:item_id}).then(res=>{
                    if(res.data.success){
                        this.boardId = res.data.board[0].id;
                        this.boardTitle = res.data.board[0].title;
                        this.boardContent = res.data.board[0].content;
                        this.missionUpdateFormClass.displayNoneOn = false;
                        setTimeout(() => {
                            this.missionUpdateFormClass.toTopOn = false;
                        }, 1000);
                        console.log(`${this.boardTitle},${this.boardContent}`)
                    }
                });
            },
            exit_missionUpdate_popup(){
                this.missionUpdateFormClass.toTopOn = true;
                setTimeout(() => {
                    this.missionUpdateFormClass.displayNoneOn = true;
                }, 1000);
            },
            exit_profile_popup(){
                this.profileFormClass.toTopOn = true;
                setTimeout(() => {
                    this.profileFormClass.displayNoneOn = true;
                }, 1000);
            },
            updateMissionBoard(){
                axios.post('/updateMissionBoard',{id:this.boardId,title:this.boardTitle,content:this.boardContent}).then(res=>{
                    if(res.data.success){
                        this.update_info = res.data.msg;
                        setTimeout(() => {
                            this.exit_missionUpdate_popup();
                            this.update_info = '';
                        }, 1000);
                        setTimeout(() => {
                            location.href='/mission';
                        }, 1200);
                        
                    }
                });
            },getUserProfile(boardId){
                axios.post('/getUserProfile',{id:boardId}).then(res=>{
                    if(res.data.success){
                        this.getUserid = res.data.user[0].id;
                        this.getUserName = res.data.user[0].name;
                        this.getUProfile = res.data.user[0].profile;
                        this.profileFormClass.displayNoneOn = false;
                        setTimeout(() => {
                            this.profileFormClass.toTopOn = false;
                        }, 500);
                        console.log(this.user);

                    }
                });
            }
        },
        mounted(){
            axios.get('/getLogin').then(res=>{
                this.loginUser = res.data.user;
                this.logId =this.loginUser.id;
            });
        }
    });

    var a5 = new Vue({
        el:"#mission_write_page",
        data:{
            period_list : [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
            point_list : [500,1000,2000,3000],
            mission_write_title:'',
            mission_write_content:''
        },
        beforeMount(){
           
        },
        methods:{
           
        }
    });

    var a6 = new Vue({
        el:"#profile_popup",
        data:{
            expList : [],
            imgUrl:'',
            id: '',
            profileFormClass:{
                toTopOn:true,
                displayNoneOn:true,
                border_success_green:false
            },
            loginUser:[],
            logId:''
        },
        methods:{
            exit_profile_popup(){
                this.profileFormClass.toTopOn = true;
                setTimeout(() => {
                    this.profileFormClass.displayNoneOn = true;
                }, 1000);
            },
            profile_update(url){
                axios.post('/profile_update',{id:this.logId,file:url}).then(res=>{
                    if(res.data.success){
                        this.profileFormClass.toTopOn = true;
                        setTimeout(() => {
                            this.profileFormClass.displayNoneOn = true;
                        }, 1000);
                        setTimeout(() => {
                            location.href='/';
                        }, 1200);
                    }
                })
            }
        },
        mounted(){
            axios.get('/getLogin').then(res=>{
                this.loginUser = res.data.user;
                this.logId =this.loginUser.id;
            });
        }
    });
    var a1 = new Vue({
        el:"#mainpage",
        data:{
            
        },
        methods:{  
            openProfilePopup(){
                a6.profileFormClass.displayNoneOn = false;
                setTimeout(() => {
                    a6.profileFormClass.toTopOn = false;
                }, 500);
            }
        }
    });


    
}
