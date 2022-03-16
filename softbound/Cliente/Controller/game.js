var Types = require('./gametypes');
var Logger = require('./lib/logger');
var Message = require('./lib/message');
var World = require('./world');
var Shoot = require('./lib/shoot');
var events = require('events');

// Game
module.exports = class Game {
    constructor(id, room, gameserver) {
        var self = this;
        this.id = id;
        this.room = room;
        this.gameserver = gameserver;
        this.wind_power = 0;//Reloj de viento
        this.wind_angle = 60;
        this.tmp_wind_power = 0;
        this.tmp_wind_angle = 60;
        this.frist_turn = 0;
        this.time_played = 0;
        this.turn_player = 0;
        this.turns_pass = 0;
        this.turns_pass_sudden = 0;
        this.sudden = 20;
        this.lastturn = 1;
        this.change_wind_angle = 0;
        this.change_wind_power = 0;
        this.game_endx = false;
        this.gameEnd_callback = null;
        this.eventEmitter = new events.EventEmitter();
        this.queue = [];
        this.historical = [];
        this.new_weather = [];// this.weather = [];
        var thor_x = [ '', 708, 613, 676, 806, 573, 687, 1079, 575, 669, 707, 1024, 974, 726, 1060, 876, 898, 795, 546, 644, 964, 962, 1031, 791, 1144, 1046 ],
            thor_y = [ '', -448, -452, -421, -424, -494, -446, -444, -426, -450, -419, -374, -376, -387, -387, -402, -395, -376, -388, -366, -441, -496, -484, -387, -399, -398 ],
            r_ = Math.floor((Math.random() * 25) + 1);
        
        this.gamePrixEnd_callback = null;
        this.thor = {
            x: 500,
            y: -200,
            angle: 260,
            damage: 100
        };
        this.map = self.gameserver.mapControl.getMap(room.map);
        this.world = new World(self, self.gameserver);
        this.world.onShootComplete(function (acc, shoot, chat) {
            try {
                /*console.log(shoot);
                if(shoot[0].tele!=undefined){
                    acc.player.x = shoot[0].tele[1];
                    acc.player.y = shoot[0].tele[2];
                }*/
                var actual_turn = self.getActualTurn();
                acc.player.lastturn = actual_turn;
                self.UpdateUserLastTurn(acc.user_id,actual_turn);
               // console.log(self.lastturn);
                self.getNextTurn(function (player) {
                    if (typeof player != 'undefined') {
						self.turn_player = player.position;
                        var shoot_message = new Message.gamePlay(acc, shoot, player, self.lastturn, chat);
                        self.gameserver.pushToRoom(self.room.id, shoot_message);
                        self.historical.push(shoot_message);
                        if(shoot[0].tele.length > 0){
                          //console.log(acc.player.user_id);
                           acc.player.x = shoot[0].tele[1];
                           acc.player.y = shoot[0].tele[2];
                           acc.player.move();
                        }
                        if (self.room.game_mode === Types.GAME_MODE.BOSS) {
                            self.room.forBots(function (bot) {
                                if (bot.player.position === self.turn_player) {
                                    bot.turn();
                                }
                            });
                        }
                        self.checkDead();
                    } else {
                        self.getNextTurn(function (player2) {
                            self.turn_player = player2.position;
                            if (typeof (player2.position) !== 'undefined') {
                                var shoot_message = new Message.gamePlay(acc, shoot, player2, self.lastturn,  chat);
                                self.gameserver.pushToRoom(self.room.id, shoot_message);
                                self.historical.push(shoot_message);
                                if (self.room.game_mode === Types.GAME_MODE.BOSS) {
                                    self.room.forBots(function (bot) {
                                        if (bot.player.position === self.turn_player) {
                                            bot.turn();
                                        }
                                    });
                                }
                                self.checkDead();
                            }
                        });
                    }
                });
            } catch (e) {
                console.log(e);
                /*self.getNextTurn(function (player) {
                    self.turn_player = player.position;
                    self.gameserver.pushToRoom(self.room.id, new Message.gamePlay(acc, shoot, player, chat));
                    if (self.room.game_mode === Types.GAME_MODE.BOSS) {
                        self.room.forBots(function (bot) {
                            if (bot.player.position === self.turn_player) {
                                self.gameEnd_callback;
                            }
                        });
                    }*/
                    self.checkDead();
                /*});*/
            }
        });
    }

    start(callback) {
        var self = this;
        self.room.status = Types.ROOM_STATUS.PLAYING;
        self.room.forPlayers(function (account) {
            if (account !== null) {
                let player = account.player;
                var n = Types.MOBILE_R.length;
                //console.log("Numero de Mobil: ",player.mob_random);
                var rd = self.RandomMob(0 ,n);
                if (rd === 7){
                    rd = self.RandomMob(0 ,n);
                }
                //console.log(rd);
                if (player.mob_random)
                    player.mobile = rd;
                  //  console.log("esto es:",player.mob_random);
                var point = self.map.GetPoint();
                //Logger.debug("point: " + point.x + " " + point.y);
                if(typeof (point) !== 'undefined' && typeof (point.x) !== 'undefined') {
                    player.x = point.x;
                    player.y = point.y;
                }
                player.reloadHp();
                if (player.is_bot === 1) {
                    account.init();
                }
            }
        });
        callback();
    }

    RandomMob(min, max) {
        return Math.floor(Math.random() * (min + max) + min);
    }

    checkDead() {
        var self = this;
        if (self.game_endx) return null;
        var team_a_alive = 0;
        var team_b_alive = 0;
        var end = false;
        self.room.forPlayers(function (account) {
            let player = account.player;
            //Logger.info("Player: "+player.game_id+" - Team: "+player.team+" - Is_alive: "+player.is_alive);
            if (player.is_alive === 1) {
                if (player.team == 1) {
                    team_a_alive++;
                } else {
                    team_b_alive++;
                }
            }
        });
        var win_gp = this.room.team;
        if (team_a_alive === 0) {
            //enviar win team a
            if (self.room.event_game_room === 1) {
                self.room.forPlayerB(function(account) {
                    if (self.room.free_kill)
                        self.room.win_team_gp = 0;
                    account.player.addWinGoldWinGp(0,self.room.win_team_gp);
                    account.player.addWinGoldWinGp(0,self.room.win_team_gpb);
					/* ================================================= */
                    var increase = 1;
                    self.room.forPlayerA(function (account_win) {
                        if (typeof (account_win) !== 'undefined') {
                            if (typeof (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)]) !== 'undefined') {
                                if (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss >= 1) {
                                    increase = parseInt(account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss + 1);
                                }
                            }
                        }
                    });
                    self.room.no_win_bonus_players_room[account.player.user_id] = {
                        user_id: account.player.user_id,
                        loss: increase,
                        expiry: 0
                    };
                    /* ================================================= */
					
                });
                self.room.forPlayerA(function(account) {
                    account.player.addWinGoldWinGp(0,self.world.gp_lose);
                });
            } else {
                self.room.forPlayerA(function(account) {
					if (self.room.free_kill)
                        self.room.win_team_gp = 0;
                    account.player.addWinGoldWinGp(0,self.room.win_team_gp);
					account.player.addWinGoldWinGp(0,self.room.win_team_gpb);
                });
                self.room.forPlayerB(function(account) {
                    account.player.addWinGoldWinGp(0,self.world.gp_lose);
                    var increase = 1;
                    self.room.forPlayerA(function (account_win) {
                        if (typeof (account_win) !== 'undefined') {
                            if (typeof (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)]) !== 'undefined') {
                                if (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss >= 1) {
                                    increase = parseInt(account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss + 1);
                                }
                            }
                        }
                    });
                    self.room.no_win_bonus_players_room[account.player.user_id] = {
                        user_id: account.player.user_id,
                        loss: increase,
                        expiry: 0
                    };
                });
            }
            self.gameserver.pushToRoom(self.room.id, new Message.gameOver(self.room, 0, self.room.player_left_room));
            //Logger.log("win: team a");
            end = true;
            self.gameEnd_callback(0);
            self.game_endx = true;
        } else if (team_b_alive === 0) {
            //enviar win team b
            if (self.room.event_game_room === 1) {
                self.room.forPlayerA(function(account) {
					if (self.room.free_kill)
                        self.room.win_team_gp = 0;
                    account.player.addWinGoldWinGp(0,self.room.win_team_gp);
					account.player.addWinGoldWinGp(0,self.room.win_team_gpb);
					/* ================================================= */
                    var increase = 1;
                    self.room.forPlayerB(function (account_win) {
                        if (typeof (account_win) !== 'undefined') {
                            if (typeof (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)]) !== 'undefined') {
                                if (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss >= 1) {
                                    increase = parseInt(account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss + 1);
                                }
                            }
                        }
                    });
                    self.room.no_win_bonus_players_room[account.player.user_id] = {
                        user_id: account.player.user_id,
                        loss: increase,
                        expiry: 0
                    };
                    /* ================================================= */
                });
                self.room.forPlayerB(function(account) {
                    account.player.addWinGoldWinGp(0,self.world.gp_lose);
                });
            } else {
                self.room.forPlayerB(function(account) {
					if (self.room.free_kill)
                        self.room.win_team_gp = 0;
                    account.player.addWinGoldWinGp(0,self.room.win_team_gp);
					account.player.addWinGoldWinGp(0,self.room.win_team_gpb);
                });
                self.room.forPlayerA(function(account) {
                    account.player.addWinGoldWinGp(0,self.world.gp_lose);
					var increase = 1;
                    self.room.forPlayerB(function (account_win) {
                        if (typeof (account_win) !== 'undefined') {
                            if (typeof (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)]) !== 'undefined') {
                                if (account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss >= 1) {
                                    increase = parseInt(account_win.player.no_win_bonus_players[parseInt(account.player.user_id)].loss + 1);
                                }
                            }
                        }
                    });
                    self.room.no_win_bonus_players_room[account.player.user_id] = {
                        user_id: account.player.user_id,
                        loss: increase,
                        expiry: 0
                    };
                });
            }
            self.gameserver.pushToRoom(self.room.id, new Message.gameOver(self.room, 1, self.room.player_left_room));
            //Logger.log("win: team b");
            end = true;
            self.gameEnd_callback(1);
            self.game_endx = true;
        }
        if (end) {
            self.world = null;
            self.map = null;
        }
    }

    gameShoot(x, y, body, look, ang, power, time, type, account) {
        var self = this;
        //Logger.debug("x: " + x + " y: " + y + " body: " + body + " look: " + look + " ang: " + ang + " power: " + power);
        power = parseInt(power * 234 / 100);
        var mobile_data = Types.MOBILES[account.player.mobile];
        
        var b0 = Math.round(parseInt(Math.cos(self.wind_angle * Math.PI / 180) * self.wind_power * mobile_data.by)) / 100;
        var b1 = Math.round(parseInt(Math.sin(self.wind_angle * Math.PI / 180) * self.wind_power * mobile_data.by - mobile_data.bx)) / 100;
        var ax = Math.round(0 - b0);
        var ay = Math.round(mobile_data.by - b1);
        if (self.wind_power === 0) {
            ax = 0;
            ay = mobile_data.by;
        }
        
        /*var ax = mobile_data.bx;
        var ay = mobile_data.by;*/
        var dis = 0;
        if (look === 0) {
            ang = 180 - ang;
            if (account.player.mobile === Types.MOBILE.ADUKA) {
                dis = 26;
            } else {
                dis = -11;
            }
        } else {
            if (account.player.mobile === Types.MOBILE.ADUKA) {
                dis = -26;
            } else {
                dis = 11;
            }
        }
        ang -= body;
        var point = {
            x: x + dis,
            y: account.player.mobil === Types.MOBILE.ADUKA ? y - 31 : y - 28
        };
        var point_thor = {
            x:this.thor.x,
            y:this.thor.y,
        }
       // if () {}
        var pfinal = self.rotatePoint(point, {
            x: x,
            y: y
        }, body);
        var pfinal_thor = self.rotatePoint(point_thor, {
            x: x,
            y: y
        }, body);
        /*var calc_thor_angle = Math.round((Math.atan2((this.thor.y-pfinal.y),(this.thor.x-pfinal.x)) * 180 / Math.PI));
        if(calc_thor_angle<0)
            calc_thor_angle = 360 - calc_thor_angle;*/
        /*this.thor.angle = Math.round(calc_thor_angle);*/

        //Logger.debug("x: " + rx + " y: " + ry + " body: " + body + " look: " + _mlook + " ang: " + ang + " power: " + power);
        //Logger.info('User: '+account.player.game_id+' - Player Delay: '+account.player.ava_delay_one+' - Dalay#2: '+account.player.ava_delay_two);
        var one_ava_delay = account.player.ava_delay_one;
        var two_ava_delay = account.player.ava_delay_two;
        if (account.player.check_my_ava === 0) {
            one_ava_delay = 0;
            two_ava_delay = 0;
        }
        if (account.player.DUAL != 1 || account.player.TELEPORT != 1) {
            if (type === 0) {
                account.player.addDelay(parseInt(100 - one_ava_delay));
            } else if (type == 1) {
                account.player.addDelay(parseInt(150 - one_ava_delay));
            } else if (type == 2) {
                account.player.addDelay(parseInt(250 - two_ava_delay));
            }
        } else {
            if (type === 0) {
                account.player.addDelay(parseInt(220 - two_ava_delay));
            } else if (type == 1) {
                account.player.addDelay(parseInt(320 - two_ava_delay));
            } else if (type == 2) {
                account.player.addDelay(parseInt(520 - two_ava_delay));
            }
        }
        if (account.player.DUAL == 1 && type === 2) {
            account.player.DUAL = 0;
        }
        if (account.player.TELEPORT == 1) {
            this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
            this.world.shoot(true);
            this.world.shoots_count = 1;
        } else {
            if (Types.MOBILE.ARMOR === account.player.mobile && type === 0) {
                var x2 = look ? pfinal.x + power : pfinal.x - power;
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.ARMOR === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.ARMOR === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.ICE === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.ICE === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.ICE === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.ADUKA === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 6;
                    this.world.shoots[1].img = 8;
            
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[2].exp = 6;
                    this.world.shoots[2].img = 8;
            
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[3].exp = 6;
                    this.world.shoots[3].img = 8;
            
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].thor = 1;
                    this.world.shoots[4].exp = 6;
            
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5].thor = 1;
                    this.world.shoots[5].exp = 6;
            
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[6].thor = 1;
                    this.world.shoots[6].exp = 6;
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 7;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.ADUKA === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 6;
                this.world.shoots[0].img = 8;
            
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[1].exp = 6;
                this.world.shoots[1].img = 8;
            
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[2].exp = 6;
                this.world.shoots[2].img = 8;
            
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3].thor = 1;
                this.world.shoots[3].exp = 6;
            
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[4].thor = 1;
                this.world.shoots[4].exp = 6;
            
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[5].thor = 1;
                this.world.shoots[5].exp = 6;
                
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6].exp = 6;
                    this.world.shoots[6].img = 8;
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7].exp = 6;
                    this.world.shoots[7].img = 8;
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[8].exp = 6;
                    this.world.shoots[8].img = 8;
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                    this.world.shoots[9].thor = 1;
            
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                    this.world.shoots[10].thor = 1;
            
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                    this.world.shoots[11].thor = 1;
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 7;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.ADUKA === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.LIGHTNING === account.player.mobile && type === 0) {
                //Logger.info("Game x: "+pfinal.x);
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].img = 11;
                this.world.shoots[0].camera = 1;
                if (look == 1) {
                    if (power === 2) {
                        var x2 = pfinal.x + power;
                    } else {
                        var x2 = pfinal.x + power - 40;
                    }
                } else {
                    if (power === 2) {
                        var x2 = pfinal.x - power;
                    } else {
                        var x2 = pfinal.x - power + 40;
                    }
                }
                //Logger.info("Edit Game x: "+x2);
                this.world.shoots[1] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[1].exp = 8;
                this.world.shoots[1].img = 11;
                this.world.shoots[1].is_lightning = 1;
                if (account.player.DUAL == 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].img = 11;
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {
                        if (power === 2) {
                            var x2 = pfinal.x - power;
                        } else {
                            var x2 = pfinal.x - power + 40;
                        }
                    }
                    this.world.shoots[3] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[3].exp = 8;
                    this.world.shoots[3].img = 11;
                    this.world.shoots[3].is_lightning = 1;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].img = 11;
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {if (power === 2) {
                        var x2 = pfinal.x - power;
                    } else {
                        var x2 = pfinal.x - power + 40;
                    }
                           }
                    this.world.shoots[3] = new Shoot(x2 - 15, pfinal.y, 225, power, 1, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[3].exp = 8;
                    this.world.shoots[3].img = 11;
                    this.world.shoots[3].is_lightning = 1;
                    this.world.shoots[4] = new Shoot(x2 - 15, pfinal.y, 315, power, 1, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[4].exp = 8;
                    this.world.shoots[4].img = 11;
                    this.world.shoots[4].is_lightning = 1;
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 4;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 2;
                }
            } else if (Types.MOBILE.LIGHTNING === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].img = 11;
                this.world.shoots[0].camera = 1;
                if (look == 1) {
                    if (power === 2) {
                        var x2 = pfinal.x + power;
                    } else {
                        var x2 = pfinal.x + power - 40;
                    }
                } else {
                    if (power === 2) {
                        var x2 = pfinal.x - power;
                    } else {
                        var x2 = pfinal.x - power + 40;
                    }
                }
                this.world.shoots[1] = new Shoot(x2 - 15, pfinal.y, 225, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[1].exp = 8;
                this.world.shoots[1].img = 11;
                this.world.shoots[1].is_lightning = 1;
                this.world.shoots[2] = new Shoot(x2 - 15, pfinal.y, 315, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[2].exp = 8;
                this.world.shoots[2].img = 11;
                this.world.shoots[2].is_lightning = 1;
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[3].img = 11;
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {
                        if (power === 2) {
                            var x2 = pfinal.x - power;
                        } else {
                            var x2 = pfinal.x - power + 40;
                        }
                    }
                    this.world.shoots[4] = new Shoot(x2 - 15, pfinal.y, 225, power, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[4].exp = 8;
                    this.world.shoots[4].img = 11;
                    this.world.shoots[4].is_lightning = 1;
                    this.world.shoots[5] = new Shoot(x2 - 15, pfinal.y, 315, power, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[5].exp = 8;
                    this.world.shoots[5].img = 11;
                    this.world.shoots[5].is_lightning = 1;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[ 3 ] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[ 3 ].img = 11;
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {
                        if (power === 2) {
                            var x2 = pfinal.x - power;
                        } else {
                            var x2 = pfinal.x - power + 40;
                        }
                    }
                    this.world.shoots[ 4 ] = new Shoot(x2, pfinal.y - 1000, 270, 10000, 0, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[ 4 ].exp = 8;
                    this.world.shoots[ 4 ].img = 11;
                    this.world.shoots[ 4 ].is_lightning = 1;
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.LIGHTNING === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].img = 12;
                this.world.shoots[0].camera = 1;
                if (look == 1) {
                    if (power === 2) {
                        var x2 = pfinal.x + power;
                    } else {
                        var x2 = pfinal.x + power - 40;
                    }
                } else {
                    if (power === 2) {
                        var x2 = pfinal.x - power;
                    } else {
                        var x2 = pfinal.x - power + 40;
                    }
                }
                this.world.shoots[1] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[1].exp = 8;
                this.world.shoots[1].img = 11;
                this.world.shoots[1].is_lightning = 1;
                this.world.shoot();
                this.world.shoots_count = 2;
            } else if (Types.MOBILE.BIGFOOT === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y - 10, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y - 10, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y - 10, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 4;
                }
            } else if (Types.MOBILE.BIGFOOT === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, 0, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, 0, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.BIGFOOT === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 50, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 150, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 1, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 3, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 225, account);
                this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 1, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 350, account);
                this.world.shoot();
                this.world.shoots_count = 8;
            } else if (Types.MOBILE.JD === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.JD === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.JD === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.DRAGON === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y - 10, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y - 10, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y - 10, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 4;
                }
            } else if (Types.MOBILE.DRAGON === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, 0, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, 0, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.DRAGON === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 50, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 150, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 1, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 3, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 225, account);
                this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 1, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 350, account);
                this.world.shoot();
                this.world.shoots_count = 8;
            } else if (Types.MOBILE.NAK === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.NAK === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 2;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.NAK === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.TRICO === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 29;
                this.world.shoots[0].img = 39;
                if (account.player.DUAL == 1 && type !== 2 ) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 29;
                    this.world.shoots[1].img = 39;
                } else if (account.player.DUAL_PLUS === 1 && type !== 2 ) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 29;
                    this.world.shoots[1].img = 39;
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].exp = 29;
                    this.world.shoots[2].img = 39;
                    this.world.shoots[2].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 29;
                    this.world.shoots[3].img = 39;
                    this.world.shoots[3].orbit = [0, -150, 0.5, 45];
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 4;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.TRICO === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 29;
                this.world.shoots[0].img = 39;
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1].exp = 29;
                this.world.shoots[1].img = 39;
                this.world.shoots[1].orbit = [180, -150, 0.5, 45];
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2].exp = 29;
                this.world.shoots[2].img = 39;
                this.world.shoots[2].orbit = [0, -150, 0.5, 45];
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 29;
                    this.world.shoots[3].img = 39;
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].exp = 29;
                    this.world.shoots[4].img = 39;
                    this.world.shoots[4].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5].exp = 29;
                    this.world.shoots[5].img = 39;
                    this.world.shoots[5].orbit = [0, -150, 0.5, 45];
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 29;
                    this.world.shoots[3].img = 39;
                    this.world.shoot();
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 4;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.MAGE === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL === 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 32;
                    this.world.shoots[1].img = 42;
                    this.world.shoots[1].wave = 1;
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].exp = 32;
                    this.world.shoots[2].img = 43;
                    this.world.shoots[2].wave = 2;
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 3;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.MAGE === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 32;
                this.world.shoots[0].img = 42;
                this.world.shoots[0].wave = 1;
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1].exp = 32;
                this.world.shoots[1].img = 43;
                this.world.shoots[1].wave = 2;
                if (account.player.DUAL === 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].exp = 32;
                    this.world.shoots[2].img = 42;
                    this.world.shoots[2].wave = 1;
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 32;
                    this.world.shoots[3].img = 43;
                    this.world.shoots[3].wave = 2;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 4;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 3;
                } else {
                    this.world.shoots_count = 2;
                }
            } else if (Types.MOBILE.TURTLE === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 35;
                    this.world.shoots[1].img = 46;
                    this.world.shoots[1].wave = 3;
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].exp = 35;
                    this.world.shoots[2].img = 47;
                    this.world.shoots[2].wave = 4;
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 3;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.TURTLE === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 35;
                this.world.shoots[0].img = 46;
                this.world.shoots[0].wave = 3;
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1].exp = 35;
                this.world.shoots[1].img = 47;
                this.world.shoots[1].wave = 4;
                if (account.player.DUAL == 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].exp = 35;
                    this.world.shoots[2].img = 46;
                    this.world.shoots[2].wave = 3;
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 35;
                    this.world.shoots[3].img = 47;
                    this.world.shoots[3].wave = 4;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 4;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 3;
                } else {
                    this.world.shoots_count = 2;
                }
            } else if (Types.MOBILE.TURTLE === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 6;
            } else if (Types.MOBILE.BOOMER === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 38;
                this.world.shoots[0].img = 50;
                this.world.shoots[0].no_rotate = 1;
                if (account.player.DUAL == 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 38;
                    this.world.shoots[1].img = 50;
                    this.world.shoots[1].no_rotate = 1;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[1].exp = 38;
                    this.world.shoots[1].img = 50;
                    this.world.shoots[1].no_rotate = 1;
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1050, account);
                    this.world.shoots[2].exp = 38;
                    this.world.shoots[2].img = 50;
                    this.world.shoots[2].no_rotate = 1;
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[3].exp = 38;
                    this.world.shoots[3].img = 50;
                    this.world.shoots[3].no_rotate = 1;
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1150, account);
                    this.world.shoots[4].exp = 38;
                    this.world.shoots[4].img = 50;
                    this.world.shoots[4].no_rotate = 1;
                    this.world.shoot();
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.BOOMER === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].no_rotate = 1;
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 50, account);
                this.world.shoots[1].no_rotate = 1;
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2].no_rotate = 1;
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 150, account);
                this.world.shoots[3].no_rotate = 1;
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].no_rotate = 1;
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1050, account);
                    this.world.shoots[5].no_rotate = 1;
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[6].no_rotate = 1;
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1150, account);
                    this.world.shoots[7].no_rotate = 1;
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].exp = 38;
                    this.world.shoots[4].img = 50;
                    this.world.shoots[4].no_rotate = 1;
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 4;
                }
            } else if (Types.MOBILE.BOOMER === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 38;
                this.world.shoots[0].img = 50;
                this.world.shoots[0].no_rotate = 1;
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.ELECTRICO === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power - 5, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power - 15, type, ax, ay, this.wind_angle, this.wind_power, 600, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power - 5, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power - 15, type, ax, ay, this.wind_angle, this.wind_power, 1600, account);
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].exp = 8;
                    this.world.shoots[3].img = 11;
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].exp = 8;
                    this.world.shoots[4].img = 11;
                    this.world.shoots[4].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5].exp = 8;
                    this.world.shoots[5].img = 11;
                    this.world.shoots[5].orbit = [0, -150, 0.5, 45];
                    this.world.shoot();
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {
                        if (power === 2) {
                            var x2 = pfinal.x - power;
                        } else {
                            var x2 = pfinal.x - power + 40;
                        }
                    }
                    this.world.shoots[6] = new Shoot(x2, pfinal.y - 1000, 270, 10000, 1, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[6].exp = 8;
                    this.world.shoots[6].img = 11;
                    this.world.shoots[6].is_lightning = 1;
                    this.world.shoots[7] = new Shoot(x2, pfinal.y - 1000, 270, 10000, 1, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[7].exp = 8;
                    this.world.shoots[7].img = 11;
                    this.world.shoots[7].is_lightning = 1;
                    this.world.shoots[8] = new Shoot(x2, pfinal.y - 1000, 270, 10000, 1, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[8].exp = 8;
                    this.world.shoots[8].img = 11;
                    this.world.shoots[8].is_lightning = 1;
                    this.world.shoot();
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 9;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.ELECTRICO === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[0].exp = 8;
                this.world.shoots[0].img = 11;
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1].exp = 8;
                this.world.shoots[1].img = 11;
                this.world.shoots[1].orbit = [180, -150, 0.5, 45];
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2].exp = 8;
                this.world.shoots[2].img = 11;
                this.world.shoots[2].orbit = [0, -150, 0.5, 45];
                if (look == 1) {
                    if (power === 2) {
                        var x2 = pfinal.x + power;
                    } else {
                        var x2 = pfinal.x + power - 40;
                    }
                } else {
                    if (power === 2) {
                        var x2 = pfinal.x - power;
                    } else {
                        var x2 = pfinal.x - power + 40;
                    }
                }
                this.world.shoots[3] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[3].exp = 8;
                this.world.shoots[3].img = 11;
                this.world.shoots[3].is_lightning = 1;
                this.world.shoots[4] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                this.world.shoots[4].exp = 8;
                this.world.shoots[4].img = 11;
                this.world.shoots[4].is_lightning = 1;
                this.world.shoots[5] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                this.world.shoots[5].exp = 8;
                this.world.shoots[5].img = 11;
                this.world.shoots[5].is_lightning = 1;
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6].exp = 8;
                    this.world.shoots[6].img = 11;
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7].exp = 8;
                    this.world.shoots[7].img = 11;
                    this.world.shoots[7].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8].exp = 8;
                    this.world.shoots[8].img = 11;
                    this.world.shoots[8].orbit = [0, -150, 0.5, 45];
                    this.world.shoot();
                    if (look == 1) {
                        if (power === 2) {
                            var x2 = pfinal.x + power;
                        } else {
                            var x2 = pfinal.x + power - 40;
                        }
                    } else {
                        if (power === 2) {
                            var x2 = pfinal.x - power;
                        } else {
                            var x2 = pfinal.x - power + 40;
                        }
                    }
                    this.world.shoots[9] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[9].exp = 8;
                    this.world.shoots[9].img = 11;
                    this.world.shoots[9].is_lightning = 1;
                    this.world.shoots[10] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[10].exp = 8;
                    this.world.shoots[10].img = 11;
                    this.world.shoots[10].is_lightning = 1;
                    this.world.shoots[11] = new Shoot(x2, pfinal.y - 1000, 270, 10000, type, ax, ay, this.wind_angle, this.wind_power, 2000, account);
                    this.world.shoots[11].exp = 8;
                    this.world.shoots[11].img = 11;
                    this.world.shoots[11].is_lightning = 1;
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power - 5, 0, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang, power - 15, 0, ax, ay, this.wind_angle, this.wind_power, 1600, account);
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 9;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.GRUB === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.GRUB === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 5;
                } else {
                    this.world.shoots_count = 4;
                }
            } else if (Types.MOBILE.KALSIDDON === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y - 10, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y - 10, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y - 10, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.KALSIDDON === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, 0, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, 0, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.KALSIDDON === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 50, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 150, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 1, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 3, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 225, account);
                this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 1, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 350, account);
                this.world.shoot();
                this.world.shoots_count = 8;
            } else if (Types.MOBILE.MAYA === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1 && type !== 2 ) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2 ) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3].orbit = [0, -150, 0.5, 45];
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 4;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.MAYA === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1].orbit = [180, -150, 0.5, 45];
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2].orbit = [0, -150, 0.5, 45];
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4].orbit = [180, -150, 0.5, 45];
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5].orbit = [0, -150, 0.5, 45];
                    this.world.shoot();
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoot();
                }
                this.world.shoot();
                if (account.player.DUAL == 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 4;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.TIBURON === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 2;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 7;
                } else {
                    this.world.shoots_count = 1;
                }
            } else if (Types.MOBILE.TIBURON === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
            
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3].thor = 1;
                this.world.shoots[3].exp = 6;
            
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[4].thor = 1;
                this.world.shoots[4].exp = 6;
            
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[5].thor = 1;
                this.world.shoots[5].exp = 6;
                
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                    this.world.shoots[9].thor = 1;
            
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                    this.world.shoots[10].thor = 1;
            
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                    this.world.shoots[11].thor = 1;
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 7;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.TIBURON === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoot();
                this.world.shoots_count = 1;
            } else if (Types.MOBILE.EASTER === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y - 10, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y - 10, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y - 10, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, 1, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 8;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.EASTER === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 15, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 30, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, 0, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, 0, ax, ay, this.wind_angle, this.wind_power, 1300, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 12;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 10;
                } else {
                    this.world.shoots_count = 6;
                }
            } else if (Types.MOBILE.EASTER === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 50, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 150, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 1, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 3, power + 10, type, ax, ay, this.wind_angle, this.wind_power, 225, account);
                this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang - 1, power - 10, type, ax, ay, this.wind_angle, this.wind_power, 300, account);
                this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 20, type, ax, ay, this.wind_angle, this.wind_power, 350, account);
                this.world.shoot();
                this.world.shoots_count = 8;
            } else if (Types.MOBILE.PHOENIX === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 6;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.PHOENIX === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 6;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.PHOENIX === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 600, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 800, account);
                this.world.shoot();
                this.world.shoots_count = 5;
            } else if (Types.MOBILE.HALLOWEEN === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 1, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 6;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.HALLOWEEN === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                } else if (account.player.DUAL_PLUS === 1 && type !== 2) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, 0, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                }
                this.world.shoot();
                if (account.player.DUAL === 1) {
                    this.world.shoots_count = 6;
                } else if (account.player.DUAL_PLUS === 1) {
                    this.world.shoots_count = 6;
                } else {
                    this.world.shoots_count = 3;
                }
            } else if (Types.MOBILE.COPYLOID === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                }
                this.world.shoot();
                this.world.shoots_count = 2;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 4;
            } else if (Types.MOBILE.RAON === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 12, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 14, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[12] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[13] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[14] = new Shoot(pfinal.x, pfinal.y, ang + 12, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[15] = new Shoot(pfinal.x, pfinal.y, ang + 14, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                this.world.shoots_count = 8;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 16;
            } else if (Types.MOBILE.RAON === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                this.world.shoots_count = 5;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 10;
            } else if (Types.MOBILE.DRAGON2 === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 100, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1100, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1200, account); 
                }
                this.world.shoot();
                this.world.shoots_count = 3;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 6;
            } else if (Types.MOBILE.RANDOMIZER === account.player.mobile && type === 0) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang + 10, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 7, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 9, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[10] = new Shoot(pfinal.x, pfinal.y, ang + 11, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[11] = new Shoot(pfinal.x, pfinal.y, ang + 13, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                this.world.shoots_count = 6;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 12;
            } else if (Types.MOBILE.RANDOMIZER === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang + 2, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang + 6, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang + 8, power + 5, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 5, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang + 7, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[8] = new Shoot(pfinal.x, pfinal.y, ang + 9, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[9] = new Shoot(pfinal.x, pfinal.y, ang + 11, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1000, account); 
                }
                this.world.shoot();
                this.world.shoots_count = 5;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 10;
            } else if (Types.MOBILE.BEE === account.player.mobile && type === 1) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang - 6, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 600, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang - 6, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 1600, account);
                }
                this.world.shoot();
                this.world.shoots_count = 4;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 8;
            } else if (Types.MOBILE.BEE === account.player.mobile && type === 2) {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 200, account);
                this.world.shoots[2] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 400, account);
                this.world.shoots[3] = new Shoot(pfinal.x, pfinal.y, ang - 6, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 600, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[4] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                    this.world.shoots[5] = new Shoot(pfinal.x, pfinal.y, ang - 2, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 1200, account);
                    this.world.shoots[6] = new Shoot(pfinal.x, pfinal.y, ang + 4, power + 8, type, ax, ay, this.wind_angle, this.wind_power, 1400, account);
                    this.world.shoots[7] = new Shoot(pfinal.x, pfinal.y, ang - 6, power - 8, type, ax, ay, this.wind_angle, this.wind_power, 1600, account);
                }
                this.world.shoot();
                this.world.shoots_count = 4;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 8;
            } else {
                this.world.shoots[0] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 0, account);
                if (account.player.DUAL == 1) {
                    this.world.shoots[1] = new Shoot(pfinal.x, pfinal.y, ang, power, type, ax, ay, this.wind_angle, this.wind_power, 1000, account);
                }
                this.world.shoot();
                this.world.shoots_count = 1;
                if (account.player.DUAL == 1)
                    this.world.shoots_count = 2;
            }
        }
        this.world.run();
        this.nohole = !1;
        account.player.DUAL = 0;
        account.player.DUAL_PLUS = 0;
        
        this.tmp_wind_angle = this.wind_angle;
        this.tmp_wind_power = this.wind_power;
    }

    getActualTurn(){
        return this.lastturn++;
    }

    getNextTurn(callback) {
        var self = this;
        if (self.game_endx) return null;
        var xf = 0;
        if(!self.room.turn_list.length>0){
           self.room.forPlayers(function (account) {
               if (typeof (account) !== 'undefined') {
                 self.room.turn_list.push({
                     user_id: account.player.user_id,
                     team: account.player.team,
                     delay: account.player.delay,
                     lastturn: account.player.lastturn,
                     position: account.player.position
                 });
                 account.player.game_position = account.player.position;
               }
           });
           self.room.turn_list.sort(function(a,b){
               return a.position-b.position;
           });
        }
        this.room.forPlayers(function (account) {
            if (typeof (account) !== 'undefined') {
                var player = account.player;
                //console.log({id:player.user_id,alive:player.is_alive});
                if (account !== null && player.is_alive === 1) {
                    for(var i in self.room.turn_list){
                        var turn_data = self.room.turn_list[i];
                        if(turn_data.user_id==account.user_id)
                            self.room.turn_list[i].delay = player.delay;
                    }
                    xf++;
                } else {
                    //console.log("eliminando del array");
                    for(var i in self.room.turn_list){
                        var turn_data = self.room.turn_list[i];
                        if(turn_data.user_id==account.user_id)
                            self.room.turn_list.splice(i,1);
                    }
                }
            }
        });

        if (xf <= 0)
            self.checkDead();
        //console.log(this.room.turn_list);
        this.room.turn_list.sort(function (a, b) {
            return a.delay == b.delay ? a.lastturn - b.lastturn : a.delay - b.delay;
        });
        //console.log(this.room.turn_list);
        //console.log(this.room.turn_list);
        self.turns_pass++;
        /*self.turns_pass_sudden++;
        if (self.turns_pass_sudden === self.sudden - 20 ) {
            self.gameserver.pushBroadcastChat(new Message.chatResponse(self, "activar codigo sudden en 20 turnos" ,Types.CHAT_TYPE.SYSTEM), self);
        } else if (self.turns_pass_sudden === self.sudden - 10) {
            self.gameserver.pushBroadcastChat(new Message.chatResponse(self, "activar codigo sudden en 10 turnos" ,Types.CHAT_TYPE.SYSTEM),self);
        } else if (self.turns_pass_sudden === self.sudden - 5) {
            self.gameserver.pushBroadcastChat(new Message.chatResponse(self, "activar codigo sudden en 5 turnos" ,Types.CHAT_TYPE.SYSTEM), self);
        } else if (self.turns_pass_sudden === self.sudden) {
            self.gameserver.pushBroadcastChat(new Message.chatResponse(self, "codigo de muerte subita activado" ,Types.CHAT_TYPE.SYSTEM),self);
            this.room.forPlayers(function (account) {
                if (typeof (account) !== 'undefined') {
                    var player = account.player;
                    player.DUAL = 1;
                    self.gameserver.pushBroadcastChat(new Message.chatResponse(self, "Dual activado" ,Types.CHAT_TYPE.SYSTEM),self);
                }
            });
        }*/
        //Logger.cyan("Tardo " + Math.round( Math.abs( Math.round( Date.now() - Math.round( Date.now() + (1000 * 20) ) ) / 1000 ) ) + " segundos en tirar");
		var tiempo1 = self.turns_pass;
		var berny = false;
        if (self.room.max_wind >= 12  && self.room.max_wind <= 12  ) {
                            berny = true;
                            var data = [tiempo1,1,tiempo1,2,tiempo1,3,tiempo1,4,tiempo1,5,tiempo1,6,tiempo1,7,tiempo1,8,tiempo1,9,tiempo1,10,tiempo1,11,tiempo1,12,tiempo1];
                            var berny1 = data.length;
                                var julio1 = self.room.RandomInt(0,data.length);
                                self.wind_power = data[julio1];
                            
                            //self.wind_power = data.length;
                        }
                        if  (self.room.max_wind >= 0  && self.room.max_wind <= 0 ) {
                            berny = true;
                            var data = [0,0,0];
                            var berny12 = data.length;
                                var julio12 = self.room.RandomInt(0, berny12  );
                                
                                self.wind_power = data[julio12];
                            //self.wind_power = 0;
                        }
                        if  (self.room.max_wind >= 26  && self.room.max_wind <= 26) {
                            berny = true;
                            var data = [tiempo1,1,tiempo1,2,tiempo1,3,tiempo1,4,tiempo1,5,tiempo1,6,tiempo1,7,tiempo1,8,tiempo1,9,tiempo1,10,tiempo1,11,tiempo1,tiempo1,12,tiempo1,tiempo1,13,tiempo1,tiempo1,14,tiempo1,tiempo1,15,tiempo1,tiempo1,16,tiempo1,tiempo1,17,tiempo1,tiempo1,18,tiempo1,tiempo1,19,tiempo1,20,tiempo1,21,tiempo1,22,tiempo1,23,tiempo1,24,tiempo1,25,tiempo1,26,tiempo1];
                            var berny122 = data.length;
                                var steven122 = self.room.RandomInt(0, berny122  );
                                
                                self.wind_power = data[steven122];

                            //self.wind_power = 26;
                        }
                        if  (self.room.max_wind >= 50  && self.room.max_wind <= 50 ) {
                            berny = true;
                            var data = [tiempo1,1,tiempo1,tiempo1,tiempo1,2,tiempo1,tiempo1,3,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,tiempo1,4,tiempo1,tiempo1,5,tiempo1,tiempo1,6,tiempo1,tiempo1,tiempo1,7,tiempo1,tiempo1,8,tiempo1,tiempo1,tiempo1,9,tiempo1,tiempo1,tiempo1,10,tiempo1,tiempo1,tiempo1,11,tiempo1,tiempo1,12,tiempo1,tiempo1,13,tiempo1,14,tiempo1,15,tiempo1,16,tiempo1,17,tiempo1,18,tiempo1,19,tiempo1,20,tiempo1,21,tiempo1,22,tiempo1,23,tiempo1,24,tiempo1,25,tiempo1,26,tiempo1,27,tiempo1,27,tiempo1,27,tiempo1,27,tiempo1,27,tiempo1,27,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,28,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,29,tiempo1,30,tiempo1,30,tiempo1,30,tiempo1,30,tiempo1,30,tiempo1,30,tiempo1,30, tiempo1,30,tiempo1,31,tiempo1,32,tiempo1,33,tiempo1,34,tiempo1,35,tiempo1,36,tiempo1,37,tiempo1,38,tiempo1,39,tiempo1,40,tiempo1,42,tiempo1,43,tiempo1,44,tiempo1,45,tiempo1,46,tiempo1,47,tiempo1,48,tiempo1,49,tiempo1,50,tiempo1];
                            var berny1223 = data.length;
                                var steven1223 = self.room.RandomInt(0, berny1223 );
                                
                                self.wind_power = data[steven1223];
                            //self.wind_power = 50;
                        }
		
        if (self.change_wind_angle > 3) {
            self.change_wind_angle = 0;
            self.wind_angle = self.getRandomInt(0, 360);
        }
        if (self.change_wind_power > 4) {
            self.change_wind_power = 0;
            if (self.room.max_wind > 0) {
                self.wind_power = self.getRandomInt(0, self.room.max_wind);
                //Logger.info("Viento Change: "+self.wind_power);
            }
        }
        self.change_wind_angle++;
        self.change_wind_power++;
        //Logger.info("Viento Change Wind: "+self.change_wind_power);
        callback(this.room.turn_list[0] !== null ? this.room.turn_list[0] : this.room.turn_list[1]);
    }
    UpdateUserLastTurn(user_id,lastturn){
         for(var i in this.room.turn_list){
             var turn_data = this.room.turn_list[i];
             if(turn_data.user_id==user_id)
                 this.room.turn_list[i].lastturn = lastturn;
         }
    }
    gamePass(account) {
        var self = this;
            if (typeof (account) !== 'undefined') {
                if (account.player !== null)
                    account.player.addDelay(100);
                self.turns_pass++;
            } else {
                account = null;
            }
            var actual_turn = self.getActualTurn();
            account.player.lastturn = actual_turn;
            self.UpdateUserLastTurn(account.user_id,actual_turn);
            //console.log(self.lastturn);
        self.getNextTurn(function (player) {
            if (typeof (player) !== 'undefined') {
                self.turn_player = player.position;
				self.turns_pass++;
                if (self.room.game_mode === Types.GAME_MODE.BOSS) {
                    self.room.forBots(function (bot) {
                        if (bot.player.position === self.turn_player) {
                            bot.turn();
                        }
                    });
                }
                var pass_message = new Message.gamePass(account, player, self.room);
                self.gameserver.pushToRoom(self.room.id, pass_message);
                self.historical.push(pass_message);
				self.turns_pass++;
            } else {}
        });
    }

    onGameEnd(callback) {
        this.gameEnd_callback = callback;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    RadToAngle(a) {
        return 180 * a / Math.PI;
    }

    AngleToRad(p) {
        return p * Math.PI / 180;
    }

    vector(a, b) {
        var data = {};
        data.x = Math.cos(this.RadToAngle(a)) * b;
        data.y = -Math.sin(this.RadToAngle(a)) * b;
        return data;
    }

    rotatePoint(point, center, angle) {
        var px = {};
        angle = (angle) * (Math.PI / 180); // Convert to radians
        px.x = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y - center.y) + center.x;
        px.y = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;
        px.x = Math.floor(px.x);
        px.y = Math.floor(px.y);
        return px;
    }
};