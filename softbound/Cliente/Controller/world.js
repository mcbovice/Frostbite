//Player fall and die
var Types = require('./gametypes');
var Logger = require('./lib/logger');
var Message = require('./lib/message');
/*============[BUNGE]*============*/
/*============[BUNGE]*============*/


/*============[BUNGE]*============*/
var Box = require('./lib/box');
var Vector = require('./lib/vect');
/*============[BUNGE]*============*/
require('setimmediate');

// World
module.exports = class World {
    constructor(game, gameserver) {
        var self = this;
        let my_gold = 0;
        gameserver.forEachAccount(function (account) {
            if (account !== null) {
                if (account.player.check_my_ava === 1)
                    my_gold = account.player.ava_gold;
            }
        });
        this.game = game;
        this.gameserver = gameserver;

        this.work = false;
        this.shoots = {};
        this.shoots_count = 0;
        this.shoots_complete = 0;
        this.shoots_data = [];
        this.map = game.map;
        this.chat = [];
        this.shoot_complete = null;

        this.chat_complete = false;

        this.gp_kill = 2;
        this.gold_kill = 2300;
        
        this.gold_good = 50;
        this.gold_excellent = 100;

        this.gp_lose = 3;
        this.gold_lose = 250;
           
        this.gold_penalty = -250;
        this.gp_penalty = -1;
        
        this.gp_bunge_bonus = 2;
        this.gold_bunge_bonus = 2300;
        
        this.gp_bunge_penalty = -2;
        this.gold_bunge_penalty = -250;
        
            
        
        
        /*this.team_a_gp = 10;
        this.team_a_count = 1000;
        this.team_b_gp = 12;
        this.team_b_count = 1200;
        this.team_bots_count = 13;*/
        
        if (gameserver.evento200 === true) {
            this.gp_kill = 10;//10
            this.gold_kill = 4600;
            
            this.gold_good = 100;
            this.gold_excellent = 200;
        
            this.gp_lose = 6;
            this.gold_lose = 500;
       
            this.gold_penalty = -500;
            this.gp_penalty = -2;
        
            this.gp_bunge_bonus = 7;
            this.gold_bunge_bonus = 4600;
        
            this.gp_bunge_penalty = -4;
            this.gold_bunge_penalty = -500;
            //============[BUNGE]============*/
        }

        if (this.game.room.game_mode === Types.GAME_MODE.BOSS && gameserver.evento200 === false) {
            this.gp_kill = 6;
            this.gold_kill = 2300;
            
            this.gold_good = 50;
            this.gold_excellent = 100;

            this.gp_lose = 3;
            this.gold_lose = 250;
           
            this.gold_penalty = -250;
            this.gp_penalty = -3;
        
            this.gp_bunge_bonus = 7;
            this.gold_bunge_bonus = 2300;
        
            this.gp_bunge_penalty = -3;
            this.gold_bunge_penalty = -220;
            //============[BUNGE]============*/
        }
        
        if (this.game.room.game_mode === Types.GAME_MODE.BOSS && gameserver.evento200 === true) {
            this.gp_kill = 10;
            this.gold_kill = 2300;
            
            this.gold_good = 50;
            this.gold_excellent = 100;

            this.gp_lose = 3;
            this.gold_lose = 250;
          
            this.gold_penalty = -250;
            this.gp_penalty = -3;
        
            this.gp_bunge_bonus = 7;
            this.gold_bunge_bonus = 2300;
        
            this.gp_bunge_penalty = -3;
            this.gold_bunge_penalty = -220;
            //============[BUNGE]============*/
        }
        //===========================================/
        if (gameserver.evento500 === true) {
            this.gp_kill = 25;
            this.gold_kill = 12500;


            this.gold_good = 250;
            this.gold_excellent = 500;

            this.gp_lose = 25;
            this.gold_lose = 100;
          
            this.gold_penalty = -250;
            this.gp_penalty = -5;
        
            this.gp_bunge_bonus = 25;
            this.gold_bunge_bonus = 5000;
        
            this.gp_bunge_penalty = -75;
           this.gold_bunge_penalty = -25000;
            //============[BUNGE]============*/
            
        }

        if (this.game.room.game_mode === Types.GAME_MODE.BOSS && gameserver.evento500 === true) {
            this.gp_kill = 25;
            this.gold_kill = 11500;


            this.gold_good = 250;
            this.gold_excellent = 500;

            this.gp_lose = 15;
            this.gold_lose = 50;
          
            this.gold_penalty = -250;
            this.gp_penalty = -5;
        
            this.gp_bunge_bonus = 75;
            this.gold_bunge_bonus = 4000;
        
            this.gp_bunge_penalty = -75;
            this.gold_bunge_penalty = -25000;
            //============[BUNGE]============*/
        }
    }

    start() {
        this.work = true;
        this.run();
    }

    shoot(noholea = false) {
        this.chat_complete = false;
        this.nohole = noholea;
        for (var id in this.shoots) {
            this.shoots_data.push({
                s: [],
                tele: [],
                exp: null,
                thor: null,
                img: null,
                time: null,
                /*tr: null,*/
                change: null,
                hole: [],
                damages: [],
                wave: [],
                orbit:[],
                is_lightning: [],
                no_rotate: null,
                camera: null,
                /*start : {
                    t: [30],
                    ang: [302],
                    x: [30],
                    y: [30]
                },*/
                ss: null
            });
        }
    }

    run() {
        var self = this;
        setImmediate(function () {
            self.update();
        });
    }

    update() {
        var self = this;
        var ddba = 0;
        //console.log(Object.keys(this.shoots));
        if (this.shoots_count > 0) {
            var good_shot_message = false;
            for (var id in this.shoots) {
                var shoot = this.shoots[id];
                if (shoot && !shoot.isComplete) {
                    shoot.update();
                    var a = shoot.getPosAtTime();
                    //console.log(self.shoots[id]);
                    if (shoot.account.player.mobile == Types.MOBILE.ADUKA && self.shoots[id + 1] != undefined) {
                        //console.log("cal1");
                        if (self.shoots[id + 1].thor) {
                             //console.log("cal2");
                            var thor_angle = Math.atan2((self.shoots[id + 1].y0 - a.y), (self.shoots[id + 1].x0 - a.x)) * 180 / Math.PI;
                            if (thor_angle < 0)
                                thor_angle += 360;
                            self.shoots[id + 1].ang = thor_angle;
                        }
                    }
                    var maxys = false;
                    var maxtim = false;
                    //var ang = shoot.GetAngleAtTime();
                    
                    /* |<-========================= [Stats Avatars] ===========================->| */
                    var scratch_my_ava = shoot.account.player.ava_scratch;
                    if (shoot.account.player.check_my_ava === 0)
                        scratch_my_ava = 0;
                    var bunge_jc = parseInt(Math.round(parseInt(scratch_my_ava / 5) + shoot.pala_bunge));
                    /* |<-========================= [Stats Avatars] ===========================->| */
                    /* ============================-----------------============================== */
                    if (shoot.ss > 0) {
                        if (shoot.account.player.mobile == Types.MOBILE.ARMOR) {
                            bunge_jc = parseInt(bunge_jc + 10);
                        }
                    }
                    /* ============================-----------------============================== */
                    shoot.move(a.x, a.y, 0);
                    if (a.y <= 0)
                        maxys = true;
                    //shoot.isComplete = true;
                    //if(shoot.account.player.mobile != Types.MOBILE.ADUKA||(shoot.account.player.mobile == Types.MOBILE.ADUKA&&shoot.thor)){
                       if (self.map.IsPixel(a.x, a.y) && !shoot.groundCollide) {
                           shoot.isComplete = true;
                           this.shoots_data[this.shoots_complete].hole.push(a.x);
                           this.shoots_data[this.shoots_complete].hole.push(a.y);
                           this.shoots_data[this.shoots_complete].hole.push(this.nohole ? 0 : bunge_jc);
                           this.shoots_data[this.shoots_complete].hole.push(this.nohole ? 0 : bunge_jc);
                           if (this.nohole)
                               self.map.AddGroundHole(a.x, a.y, 0, 0);
                           else
                               self.map.AddGroundHole(a.x, a.y, bunge_jc, bunge_jc);
                           shoot.groundCollide = true;
                       } else if (self.map.w < a.x || self.map.h < a.y) {
                           shoot.isComplete = true;
                           this.shoots_data[this.shoots_complete].hole.push(a.x);
                           this.shoots_data[this.shoots_complete].hole.push(a.y);
                           this.shoots_data[this.shoots_complete].hole.push(this.nohole ? 0 : bunge_jc);
                           this.shoots_data[this.shoots_complete].hole.push(this.nohole ? 0 : bunge_jc);
                           shoot.groundCollide = true;
                       }
                  //  } 
                   // shoot.isComplete = true;
                    
                    if (!shoot.damageComplete) {
                        //console.log(self.game.room.turn_list);
                        self.game.room.forPlayers(function (account) {
                            let player = account.player;
                           // console.log({id:player.user_id,position:player.position,alive:player.is_alive});
                            account.update();
                            if (player.is_alive === 1) {
                                if (!shoot.canCollide) {
                                    var p2 = (20 * 20);
                                    var xxdx = shoot.x0 - a.x;
                                    var xxdy = shoot.y0 - a.y;
                                    var p3 = ((xxdx * xxdx) + (xxdy * xxdy));
                                    if (p2 < p3) {
                                        shoot.canCollide = true;
                                        //Logger.log('canCollide ' + shoot.canCollide);
                                    }
                                } else if (shoot.isComplete) {
                                    shoot.canCollide = true;
                                }
                                var penalty = false;
                               
                                var timxx = shoot.time * 2;
                                var fullcollide = false;
                                var areacollide = false;
                                var x11 = player.box.isColliding(shoot.box);
                                var distf = Math.sqrt(Math.pow(player.x - a.x, 2) + Math.pow(player.y - a.y, 2));
                                var dm = 0;
                                var shdm = 0;
                                if (shoot.canCollide && x11 === 0)
                                    fullcollide = true;

                                if (shoot.groundCollide || fullcollide) {
                                    if (shoot.account.player.team === player.team && self.game.room.event_game_room === 0) {
                                        penalty = true;
                                    }
                                    
                                    if (self.game.room.no_bonus_user)
                                        self.gp_kill = 0;
                                    
                                    if (fullcollide)
                                        dm = shoot.damageshot;
                                    
                                    if (distf <= 60) { //distancia
                                        dm = shoot.damageshot - distf;
                                        areacollide = true;
                                    }
                                    if (fullcollide || areacollide) {
                                        if (player.shield > 0) {
                                            //Logger.cyan("#1 Shield: "+player.shield+" - DameShot: "+dm+" - User: "+player.game_id);
                                            shdm = player.shield - dm;
                                            //Logger.data("#1 Daño en total: "+shdm);
                                            if (shdm === 0) {
                                                player.setShield(0);
                                                if (shoot.img === Types.BULLETS.JD2) {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        movex: a.x,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    });
                                                } else {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    }); 
                                                }
                                                if (penalty) {
                                                    shoot.account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                                } else {
                                                    self.chat.push(Types.GAMEMSG.good_shot);
                                                    var bbp_randomnum = Math.floor(Math.random() * 3) + 1;
                                                    if (bbp_randomnum === 1) {
                                                        shoot.account.gameserver.pushBroadcastChat(new Message.chatResponse(shoot, shoot.account.player.game_id+ ": (party) [Buen Tiro] (confeti)", Types.CHAT_TYPE.SYSTEM), shoot.account.room);
                                                        self.chat.push(Types.GAMEMSG.bbp_yes);
                                                    } else if (bbp_randomnum === 2) {
                                                        shoot.account.gameserver.pushBroadcastChat(new Message.chatResponse(shoot, shoot.account.player.game_id+ ": (party) [Buen Tiro] (confeti)", Types.CHAT_TYPE.SYSTEM), shoot.account.room);
                                                        self.chat.push(Types.GAMEMSG.bbp_ohyes);
                                                    }
                                                    shoot.account.player.addWinGoldWinGp(self.gold_good, 0);
                                                }

                                            } else if (shdm < 0) {
                                                player.setShield(0);
                                                player.disHpShield(Math.floor(Math.abs(shdm)), 0);
                                                if (player.hp <= 0) {
                                                    player.setAlive(0);
                                                    
                                                    if (penalty) {
                                                        self.chat.push(Types.GAMEMSG.team_damage_penalty);
                                                        account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                                    } else {
                                                        if (shoot.chat_complete === false) {
                                                            self.chat.push(Types.GAMEMSG.bbp_great_shot);
                                                            self.chat.push(Types.GAMEMSG.x_killed_y);
                                                            self.chat.push(player.game_position);
                                                            shoot.account.player.addWinGoldWinGp(self.gold_kill, self.gp_kill);
                                                            shoot.chat_complete = true;
                                                        }
                                                    }
                                                }
                                                if (shoot.img === Types.BULLETS.JD2) {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        movex: a.x,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    });
                                                } else {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    }); 
                                                }
                                                
                                                if (penalty) {
                                                    self.chat.push(Types.GAMEMSG.team_damage_penalty);
                                                    shoot.account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                                } else {
                                                    self.chat.push(Types.GAMEMSG.excellent_shot);
                                                    self.chat.push(Types.GAMEMSG.bbp_shuper_shot);
                                                    shoot.account.player.addWinGoldWinGp(self.gold_excellent, 0);
                                                        
                                                }
                                            } else {
                                                player.setShield(Math.floor(Math.abs(shdm)));
                                                if (shoot.img === Types.BULLETS.JD2) {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        movex: a.x,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    });
                                                } else {
                                                    self.shoots_data[self.shoots_complete].damages.push({
                                                        n: player.game_position,
                                                        hp: player.hp,
                                                        shield: player.shield
                                                    }); 
                                                }
                                                
                                                if (penalty) {
                                                    self.chat.push(Types.GAMEMSG.team_damage_penalty);
                                                    shoot.account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                                }
                                            }
                                        } else {
                                            player.disHpShield(Math.floor(Math.abs(dm)), 0);
                                            if (player.hp <= 0) {
                                                player.setAlive(0);
                                                
                                                if (penalty) {
                                                    self.chat.push(Types.GAMEMSG.team_damage_penalty);
                                                    shoot.account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                                } else {
                                                    if (shoot.chat_complete === false) {
                                                        self.chat.push(Types.GAMEMSG.bbp_great_shot);
                                                        self.chat.push(Types.GAMEMSG.x_killed_y);
                                                        self.chat.push(player.game_position);
                                                        shoot.account.player.addWinGoldWinGp(self.gold_kill, self.gp_kill);
                                                        
                                                        shoot.chat_complete = true;
                                                    }
                                                }
                                            }
                                            if (shoot.img === Types.BULLETS.JD2) {
                                                self.shoots_data[self.shoots_complete].damages.push({
                                                    n: player.game_position,
                                                    movex: a.x,
                                                    hp: player.hp,
                                                    shield: player.shield
                                                });
                                            } else {
                                                self.shoots_data[self.shoots_complete].damages.push({
                                                    n: player.game_position,
                                                    hp: player.hp
                                                }); 
                                            }
                                            
                                            if (penalty) {
                                                self.chat.push(Types.GAMEMSG.team_damage_penalty);
                                                shoot.account.player.addWinGoldWinGp(self.gold_penalty, self.gp_penalty);
                                            } else {
                                                self.chat.push(Types.GAMEMSG.good_shot);
                                                var bbp_randomnum = Math.floor(Math.random() * 3) + 1;
                                                if (bbp_randomnum === 1) {
                                                    shoot.account.gameserver.pushBroadcastChat(new Message.chatResponse(shoot, shoot.account.player.game_id+ ": (party) [Buen Tiro] (confeti)", Types.CHAT_TYPE.SYSTEM), shoot.account.room);
                                                    self.chat.push(Types.GAMEMSG.bbp_yes);
                                                } else if (bbp_randomnum === 2) {
                                                    shoot.account.gameserver.pushBroadcastChat(new Message.chatResponse(shoot, shoot.account.player.game_id+ ": (party) [Buen Tiro] (confeti)", Types.CHAT_TYPE.SYSTEM), shoot.account.room);
                                                    self.chat.push(Types.GAMEMSG.bbp_ohyes);
                                                }
                                                shoot.account.player.addWinGoldWinGp(self.gold_good, 0);
                                            }
                                        }
                                        shoot.isComplete = true;
                                        shoot.damageComplete = true;
                                        if (!shoot.groundCollide) {
                                            self.shoots_data[self.shoots_complete].hole.push(a.x);
                                            self.shoots_data[self.shoots_complete].hole.push(a.y);
                                            self.shoots_data[self.shoots_complete].hole.push(self.nohole ? 0 : bunge_jc);
                                            self.shoots_data[self.shoots_complete].hole.push(self.nohole ? 0 : bunge_jc);
                                            if (self.nohole)
                                                self.map.AddGroundHole(a.x, a.y, 0, 0);
                                            else
                                                self.map.AddGroundHole(a.x, a.y, bunge_jc, bunge_jc);
                                            shoot.groundCollide = true;
                                            account.update();
                                        }
                                    }
                                    /*============[BUNGE]*============*/
                                    if (player.is_alive) {
                                        player.falling = false;
                                        if (typeof (player.y) === 'undefined' || player.y === 2000) {
                                            //Logger.info("BUNGE CODE #1");
                                            //Logger.info("Player ["+player.game_id+"] fall and die");
                                            player.falling = true;
                                            shoot.chat_complete = true;
                                            player.is_alive = 0;
                                            player.setAlive(0);
                                            player.cause_by = shoot.account.player.game_id;
                                            self.chat.push(Types.GAMEMSG.bunge_bonus);
                                            self.chat.push(Types.GAMEMSG.x_bunge_y);
                                            self.chat.push(player.game_position);
                                            shoot.account.player.addWinGoldWinGp(self.gold_bunge_bonus, self.gp_bunge_bonus);
                                            self.chat.push(Types.GAMEMSG.bbp_fantastic_shot);
                                            if (penalty) {
                                                //Logger.data("BUNGE CODE #1.1");
                                                self.chat.push(Types.GAMEMSG.suicide_penalty_bunge);
                                                shoot.account.player.addWinGoldWinGp(self.gold_bunge_penalty, self.gp_bunge_penalty);
                                            }
                                            //Logger.log("Status: "+player.is_alive+" -  Player: "+player.game_id);
                                            account.update();
                                        } else {
                                            //Logger.info("BUNGE CODE #2");
                                            //Logger.debug("Player ["+player.game_id+"] fall and not die");
                                            var yf = self.map.GetUnder(player.x, player.y,0);
                                            if (yf === 0 && player.is_alive) {
                                                //Logger.data("BUNGE CODE #2.1");
                                                var tmp_y = 0;
                                                var tmp_c = 1;
                                                var tmp_under = 0;
                                                do {
                                                    //Logger.data("BUNGE CODE #2.2");
                                                    tmp_y = self.map.GetUnder(player.x, player.y + tmp_c);
                                                    if ((player.y + tmp_c) > self.map.h) {
                                                        //Logger.data("BUNGE CODE #2.3");
                                                        player.falling = true;
                                                        player.y = self.map.h;
                                                        tmp_y = -1;
                                                        self.chat.push(Types.GAMEMSG.bbp_fantastic_shot);
                                                        //Logger.debug("World player falling 1");
                                                        self.chat.push(Types.GAMEMSG.x_bunge_y);
                                                        self.chat.push(shoot.account.player.game_position);
                                                        //Logger.data("BUNGE CODE #2.4");
                                                    }
                                                    tmp_c++;
                                                } while (tmp_y == 0);
                                                if (tmp_y !== 0){
                                                    //Logger.data("BUNGE CODE #2.5");
                                                    player.y = tmp_y;
                                                    if (player.box === null) {
                                                        //Logger.data("BUNGE CODE #2.6");
                                                        player.box = new Box(new Vector(player.x, player.y), 36, 40, 0);
                                                    } else {
                                                        //Logger.data("BUNGE CODE #2.7");
                                                        player.box.setp(new Vector(player.x, player.y));
                                                    }
                                                    //Logger.data("BUNGE CODE #2.8");
                                                }
                                                //Logger.data("BUNGE CODE #2.9");
                                            } else  {
                                                //Logger.data("BUNGE CODE #2.10");
                                                player.y = yf;
                                                if (player.box === null) {
                                                    //Logger.data("BUNGE CODE #2.11");
                                                    player.box = new Box(new Vector(player.x, player.y), 36, 40, 0);//36, 40
                                                } else {
                                                    //Logger.data("BUNGE CODE #2.12");
                                                    player.box.setp(new Vector(player.x, player.y));
                                                    //Logger.cyan("Mis Datos ["+player.game_id+"] de posicion: x: "+player.x+" - y: "+player.y);
                                                }
                                                //Logger.data("BUNGE CODE #2.13");
                                            }
                                            //Logger.data("BUNGE CODE #2.14");
                                        }
                                    }
                                    /*============[BUNGE]*============*/
                                }
                            }
                        });
                    }
                    if (shoot.isComplete) {
                        this.shoots_data[this.shoots_complete].s.push(shoot.x0);
                        this.shoots_data[this.shoots_complete].s.push(shoot.y0);
                        this.shoots_data[this.shoots_complete].s.push(shoot.ang);
                        this.shoots_data[this.shoots_complete].s.push(shoot.power);
                        this.shoots_data[this.shoots_complete].s.push(shoot.ax);
                        this.shoots_data[this.shoots_complete].s.push(shoot.ay);
                        this.shoots_data[this.shoots_complete].s.push(shoot.stime);
                        this.shoots_data[this.shoots_complete].exp = shoot.account.player.TELEPORT == 1 ? 7 :shoot.exp;//EXPLODE
                        this.shoots_data[this.shoots_complete].thor = shoot.thor;
                        this.shoots_data[this.shoots_complete].img = shoot.account.player.TELEPORT == 1 ? 10 :shoot.img;//BULLETS
                        if (shoot.account.player.TELEPORT == 1) {
                            this.shoots_data[this.shoots_complete].tele.push(shoot.account.player.game_position);
                            this.shoots_data[this.shoots_complete].tele.push(a.x);
                            this.shoots_data[this.shoots_complete].tele.push(a.y);
                            this.shoots_data[this.shoots_complete].tele.push(a.x);
                            this.shoots_data[this.shoots_complete].tele.push(a.y);
                            shoot.account.player.TELEPORT = 0;
                        }
                        this.shoots_data[ this.shoots_complete ].orbit = shoot.orbit;
                        this.shoots_data[ this.shoots_complete ].wave = shoot.wave;
                        /*this.shoots_data[ this.shoots_complete ].change.at = shoot.at;
                        this.shoots_data[ this.shoots_complete ].change.exp = shoot.expC;
                        this.shoots_data[ this.shoots_complete ].change.img = shoot.imgC;*/
                        this.shoots_data[ this.shoots_complete ].is_lightning = shoot.is_lightning;
                        this.shoots_data[ this.shoots_complete ].no_rotate = shoot.no_rotate;
                        this.shoots_data[ this.shoots_complete ].camera = shoot.camera;
                        this.shoots_data[this.shoots_complete].s.push(shoot.img);
                        this.shoots_data[this.shoots_complete].time = shoot.thor ? 0 : shoot.time * 2;
                        //Logger.info("time: "+shoot.time);
                        var fx = shoot.ss > 0 ? shoot.ss : 0;
                        if (shoot.ss > 0) {
                            var changee_exp = null;
                            var changee_img = null;
                            /* numero de la bala del mobil cambiado en el transcurso */
                            if (shoot.account.player.mobile == Types.MOBILE.ARMOR) {
                                changee_img = 3;
                            } else if (shoot.account.player.mobile == Types.MOBILE.TURTLE) {
                                changee_img = 49;
                            } else if (shoot.account.player.mobile == Types.MOBILE.BOOMER) {
                                changee_exp = 40;
                                changee_img = 51;
                            } else {}
                            /* numero de la bala del mobil cambiado en el transcurso */
                            //Logger.info("Test Cahngee_img: "+changee_img);
                            this.shoots_data[this.shoots_complete].change = {
                                at: 1540,
                                exp: changee_exp,
                                img: changee_img
                            };
                        }
                        /*
                        change: {
                            at: [ null ],
                            exp: [ null ],
                            img: [ null ]
                        }*/
                        //Logger.info("Info SS: [Shot SS: "+shoot.ss+" - Fx SS: "+fx+"]");
                        this.shoots_data[this.shoots_complete].ss = fx;
                        this.shoots_complete++;ddba++;
                    }
                }
            }
            if (this.shoots_count <= this.shoots_complete) {
                this.shoots_count = 0;
                this.shoots_complete = 0;
                this.shoot_complete(this.shoots[0].account, this.shoots_data.slice(0), this.chat);
                this.chat = [];
                this.shoots_data = [];
            }
            setImmediate(function () {
                self.update();
            });
        }
    }
    onShootComplete(callback) {
        this.shoot_complete = callback;
    }
};