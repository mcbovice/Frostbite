var cls = require('./class');
var Types = require('../gametypes');
var Logger = require('./logger');
var Messages = {};
module.exports = Messages;

function secondsremaining(fechaFin) {
    return Math.round(Math.abs(Math.round(Date.now() - fechaFin) / 1000));
}
var Message = cls.Class.extend({});

Messages.chatResponse = Message.extend({
    init: function (account, msj, type) {
        this.player = account.player;
        this.msj = msj;
        this.type = type;
    },
    serialize: function () {
        var data = [
            Types.SERVER_OPCODE.chat,
            this.msj
        ];
        if (this.type !== Types.CHAT_TYPE.SYSTEM && this.type !== Types.CHAT_TYPE.LOVE && this.type !== Types.CHAT_TYPE.GOLD && this.type !== Types.CHAT_TYPE.GIFT)
            data.push(this.player.game_id);
        else
            data.push("");

        data.push(this.type);
        if (this.type === Types.CHAT_TYPE.NORMAL || this.type === Types.CHAT_TYPE.GM || this.type === Types.CHAT_TYPE.BUGLE || this.type === Types.CHAT_TYPE.GM_BUGLE || this.type === Types.CHAT_TYPE.BOT || this.type === Types.CHAT_TYPE.NORMAL_TEAM || this.type === Types.CHAT_TYPE.POWER_USER_TEAM || this.type === Types.CHAT_TYPE.POWER_USER)
            data.push(this.player.rank, this.player.guild);
        //Logger.info('Info Chat #2: '+data);
        return data;
    }
});

Messages.roomState = Message.extend({
    init: function (room) {
        this.room = room;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.room_state, [
                this.room.room_type,
                this.room.id,
                this.room.title,
                this.room.password,
                this.room.max_players,
                this.room.game_mode,
                this.room.map,
                this.room.is_avatars_on,
                this.room.max_wind,
                this.room.gp_rate,
                this.room.minimap,
                this.room.is_s1_disabled,
                this.room.is_tele_disabled,
                this.room.is_random_teams,
                this.room.is_dual_plus_disabled,
				this.room.turn_time,
				this.room.room_for_sale,
				this.room.allow_watch,
				this.room.allow_talk
            ],
            1
        ];
    }
});

Messages.changedMobile = Message.extend({
    init: function (account) {
        this.player = account.player;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.changed_mobile,
            this.player.user_id,
            this.player.mobile
        ];
    }
});

Messages.changedReady = Message.extend({
    init: function (account) {
        this.player = account.player;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.changed_ready,
            this.player.user_id,
            this.player.is_ready
        ];
    }
});

Messages.passMaster = Message.extend({
    init: function (account) {
        this.player = account.player;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.pass_master,
            this.player.user_id
        ];
    }
});

Messages.masterTimer = Message.extend({
    init: function (time) {
        this.time = time;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.master_timer,
            this.time
        ];
    }
});

Messages.changedTeam = Message.extend({
    init: function (account, room) {
        this.player = account.player;
        this.room = room;
        this.no_bonus = [];
    },
    serialize: function () {
        var self = this;
        self.room.forPlayers(function (account) {
            if (typeof (self.player.no_win_bonus_accounts[parseInt(account.player.user_id)]) !== 'undefined') {
                if (account.player.user_id === self.player.no_win_bonus_accounts[parseInt(account.player.user_id)].user_id) {
                    self.no_bonus = [self.player.position, account.player.position];
                }
            }
        });
        return [
            Types.SERVER_OPCODE.changed_team,
            3,
            5,
            self.player.user_id,
            self.player.team ? 'B' : 'A',
            self.no_bonus
        ];
    }
});

Messages.playerLeft = Message.extend({
    init: function (account, room) {
        this.player = account.player;
        this.room = room;
        this.no_bonus = [];
    },
    serialize: function () {
        var self = this;
        self.room.forPlayers(function (account) {
            if (typeof (self.player.no_win_bonus_accounts[parseInt(account.player.user_id)]) !== 'undefined') {
                if (account.player.user_id === self.player.no_win_bonus_accounts[parseInt(account.player.user_id)].user_id) {
                    self.no_bonus = [self.player.position, account.player.position];
                }
            }
        });
        return [
            Types.SERVER_OPCODE.player_left,
            0,
            self.no_bonus,
            self.player.user_id,
            0
        ];
    }
});

Messages.extraRoomInfo = Message.extend({
    init: function (room) {
        this.room = room;
        this.data = [];
    },
    serialize: function () {
        var self = this;
        self.data.push(self.room.id);
        self.room.forPlayers(function (account) {
            self.data.push(account.player.position);
            self.data.push(account.player.rank);
            self.data.push(account.player.game_id);
        });
        return [
            Types.SERVER_OPCODE.extra_room_info,
            self.data
        ];
    }
});
Messages.watcherLeft = Message.extend({
    init: function (user_id) {
        this.user_id = user_id;
    },
    serialize: function () {
        return [
          Types.SERVER_OPCODE.watcher_left,
          this.user_id
        ];
    }
});
Messages.watcherJoined = Message.extend({
    init: function (account) {
        this.account = account;
    },
    serialize: function () {
        return [
          Types.SERVER_OPCODE.watcher_joined,
          this.account.user_id,
          this.account.player.game_id,
          this.account.player.rank,
          this.account.player.guild
        ];
    }
});
Messages.roomPlayers = Message.extend({
    init: function (room) {
        this.room = room;
        this.data = [];
        this.no_bonus = [];
        this.watchers = [];
    },
    serialize: function () {
        var self = this;
        self.room.forPlayerA(function (players_a) {
            self.room.forPlayerB(function (players_b) {
                if (typeof (players_a.player.no_win_bonus_accounts[parseInt(players_b.player.user_id)]) !== 'undefined') {
                    if (players_b.player.user_id === players_a.player.no_win_bonus_accounts[parseInt(players_b.player.user_id)].user_id) {
                        self.no_bonus = [players_a.player.position, players_b.player.position];
                    }
                }
            });
        });
        self.room.forPlayerB(function (players_b) {
            self.room.forPlayerA(function (players_a) {
                if (typeof (players_b.player.no_win_bonus_accounts[parseInt(players_a.player.user_id)]) !== 'undefined') {
                    if (players_a.player.user_id === players_b.player.no_win_bonus_accounts[parseInt(players_a.player.user_id)].user_id) {
                        self.no_bonus = [players_b.player.position, players_a.player.position];
                    }
                }
            });
        });
        self.data = [self.room.team_a_gp, self.room.team_b_gp];
        self.data.push(self.no_bonus);
        self.room.forPlayers(function (account) {
            self.data.push(account.player.position);
            self.data.push(account.user_id);
            self.data.push(account.player.game_id);
            self.data.push(account.player.rank);
            self.data.push(account.player.guild);
            self.data.push(account.player.is_master);
            self.data.push(account.player.is_ready);
            self.data.push(account.player.gender);
            self.data.push(account.player.mobile);
            self.data.push([
                account.player.ahead,
                account.player.abody,
                account.player.aeyes,
                account.player.aflag,
                account.player.abackground,
                account.player.aforeground,
            ]);
            self.data.push(account.player.is_bot);
            self.data.push(account.player.power_user);
            self.data.push(account.player.relationship_status);
            self.data.push(account.player.country);
            self.data.push(account.player.photo_url);
        });
        self.data.push(1);
        var watchers = [];
        for(var user_id in self.room.watchers){
            watchers.push([
              self.room.watchers[user_id].user_id,
              self.room.watchers[user_id].player.game_id,
              self.room.watchers[user_id].player.rank,
              self.room.watchers[user_id].player.guild
            ]);
        }
        return [
            Types.SERVER_OPCODE.room_players,
            self.data,
            watchers
        ];
    }
});

Messages.roomSlotUpdate = Message.extend({
    init: function (account, room) {
        this.player = account.player;
        this.room = room;
        this.no_bonus = [];
        this.data = [];
    },
    serialize: function () {
        var self = this;
        self.room.forPlayers(function (account) {
            if (typeof (self.player.no_win_bonus_accounts[parseInt(account.player.user_id)]) !== 'undefined') {
                if (account.player.user_id === self.player.no_win_bonus_accounts[parseInt(account.player.user_id)].user_id) {
                    self.no_bonus = [self.player.position, account.player.position];
                }
            }
        });
        self.data.push(self.no_bonus);
        self.data.push(self.player.position);
        self.data.push(self.player.user_id);
        self.data.push(self.player.game_id);
        self.data.push(self.player.rank);
        self.data.push(self.player.guild);
        self.data.push(self.player.is_master);
        self.data.push(self.player.is_ready);
        self.data.push(self.player.gender);
        self.data.push(self.player.mobile);
        self.data.push([
            self.player.ahead,
            self.player.abody,
            self.player.aeyes,
            self.player.aflag,
            self.player.abackground,
            self.player.aforeground,
        ]);
        self.data.push(self.player.is_bot);
        self.data.push(self.player.power_user);
        self.data.push(self.player.relationship_status);
        self.data.push(self.player.country);
        self.data.push(self.player.photo_url);
        return [
            Types.SERVER_OPCODE.slot_update,
            self.data
        ];
    }
});

Messages.gameStart = Message.extend({
    init: function (room) {
        var self = this;
        this.room = room;
        this.data = [];
        this.players = [];
        this.room.forPlayers(function (account) {
            let player = account.player;
            let mob_data = Types.MOBILES[account.player.mobile];
            let my_shield_regen = player.shield_regen;
            if (player.check_my_ava === 0) {
                my_shield_regen = 0;
            }
            self.players.push([
                player.position,
                player.user_id,
                player.game_id,
                player.guild,
                player.rank,
                player.x,
                player.y,
                player.hp,
                player.shield,
                player.shield_regen,
                mob_data.minang,
                mob_data.maxang,
                player.lastturn,
                player.mobile, [
                    player.ahead,
                    player.abody,
                    player.aeyes,
                    player.aflag,
                    player.abackground,
                    player.aforeground,
                ],
                mob_data.aim[0][0],//aim_s1_ang aim_s1_len aim_s2_ang aim_s2_len aim_ss_ang aim_ss_len 
                mob_data.aim[0][1],
                mob_data.aim[1][0],
                mob_data.aim[1][1],
                mob_data.aim[2][0],
                mob_data.aim[2][1],
                player.relationship_status,
                player.country
            ]);
        });
        this.players = this.players.sort(function(a,b){
            return a[0]-b[0];
        });

        //players first_turn thor_x thor_y thor_a thor_d weather wind_power wind_angle map 
        //is_s1_disabled event_game game_mode score
        this.data.push(this.players);
        this.data.push(this.room.game.frist_turn);
        this.data.push(this.room.game.thor.x); // thor_x
        this.data.push(this.room.game.thor.y); // thor_y
        this.data.push(this.room.game.thor.angle); //thor_a
        this.data.push(this.room.game.thor.damage); //thor_d
        this.data.push([2, 0, 0, 4, 3, 4, 0, 1, 0, 2, 4, 2, 1, 0, 3, 3, 0, 1, 4, 0, 4, 0, 1, 2, 0, 0, 4, 1, 3, 0, 0, 2, 1, 3, 4, 0, 0, 1, 4, 3, 0, 4, 1, 3, 2, 0, 0, 1, 2, 4, 4, 0, 1, 2, 0, 0, 2, 1, 4, 3, 4, 0, 1, 2, 0, 0, 3, 1, 0, 2, 2, 0, 1, 3, 0, 4, 2, 1, 3, 0, 2, 4, 1, 0, 0, 2, 4, 1, 0, 3, 4, 0, 1, 2, 0, 0, 4, 1, 3, 2, 3, 2, 1, 0, 4, 0, 0, 1, 4, 2, 0, 2, 1, 0, 4, 0, 0, 1, 3, 4, 0, 3, 1, 2, 4, 0, 2, 1, 1, 3]);/*this.data.push([0, 0, 0, 0, 0]);*/ //weather - comienza del octavo - 6to
        this.data.push(this.room.game.wind_power);
        this.data.push(this.room.game.wind_angle + 180);/*this.data.push(this.room.game.wind_angle);*/
        this.data.push(this.room.map);

        this.data.push(this.room.is_s1_disabled); //is_s1_disabled
        this.data.push(this.room.event_game_room = this.room.event_game_room == 1 ? 1 : this.room.event_game_room == 2 ? 0 : this.room.event_game_room == 3 ? 0 : this.room.event_game_room == 4 ? 0 : this.room.event_game_room == 5 ? 0 : this.room.event_game_room == 6 ? 0 : this.room.event_game_room == 7 ? 0 : 0); //event_game
        this.data.push(this.room.game_mode); //game_mode
        this.data.push(0); //score
		this.data.push(this.room.turn_time);
		this.data.push(0); 
        this.data.push(0);
        this.data.push([[4,897,157,8, 660, 89]]);
        this.data.push([[8, 660, 89],[3,897,157]]);
        this.data.push(0);
    },

    serialize: function () {
        return [Types.SERVER_OPCODE.game_start, this.data];
    }
});

Messages.gamePlay = Message.extend({
    init: function (account, data, nextplayer, next_turn_number , chat) {
        this.account = account;
        this.player = account.player;
        this.nextplayer = nextplayer;
        this.next_turn_number = next_turn_number;
        this.data = data;
        this.chat = chat;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.play, [
            this.next_turn_number,
            this.player.game_position,
            this.player.x,
            this.player.y,
            this.player.look,
            this.player.delay,
            this.nextplayer.position,
            this.chat,
            this.account.room.game.thor.x,
            this.account.room.game.thor.y,
            this.account.room.game.thor.angle, //thor_angle
            this.account.room.game.thor.damage, //thor_damage
            [3, 8, 0, 3, 0], //new_weather
            this.account.room.game.wind_power, //wind_power
            (this.account.room.game.wind_angle + 180),/*this.account.room.game.wind_angle,*/ //wind_angle
            this.data,
            this.player.win_gold,
			[[7, 660, 89]],
            [[8, 660, 89],[3,897,157]]
        ]];
    }
});

Messages.gameOver = Message.extend({
    init: function (room, team, player_left_room) {
        var self = this;
        this.room = room;
        this.team = team;
        this.player_left_room = player_left_room;
        this.data = [];
        this.room.forPlayers(function (account) {
            let player = account.player;
            let gp_power = 0;
            let plusgp = 0;
            let relation_status = 0;
            let event_lucky_egg = 0;
            let event_seg_luckyegg = 0;
            if (player.power_user === 1)
                gp_power = parseInt(Math.round(10 * player.win_gp / 100));
            if (player.plus10gp === 1)
                plusgp = parseInt(Math.round(10 * player.win_gp / 100));
            if (player.relationship_status === 'f')
                relation_status = parseInt(Math.round(10 * player.win_gp / 100));
            if (player.relationship_status === 'e')
                relation_status = parseInt(Math.round(20 * player.win_gp / 100));
            if (player.relationship_status === 'm')
                relation_status = parseInt(Math.round(30 * player.win_gp / 100));
            if (player.lucky_egg_seg > 0) {
                event_lucky_egg = player.lucky_egg_item + (60 * 1000 * player.lucky_egg_seg);
                if (event_lucky_egg > Date.now()) {
                    event_seg_luckyegg = player.win_gp;
                    //Logger.crimson("Lucky Egg: "+event_seg_luckyegg);
                }
            }
            let GPsAdicionales = parseInt(Math.round(gp_power + plusgp + relation_status + event_seg_luckyegg));
            self.data.push([
                player.position,
                player.user_id,
                player.game_id,
                player.rank,
                player.is_bot == 1 ? 0 : player.win_gp,
                player.is_bot == 1 ? 0 : player.win_gold,
                player.scores_lose, //1 = Computer,2 = left, 3 = rank up,
                player.is_bot == 1 ? 0 : GPsAdicionales, //bonus Gp
                0 //Bonus Gold
            ]);
        });
		self.data.push(player_left_room);
		self.room.player_left_room = [];
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.game_over, {
            "won": this.team,
            "getfornexgpintheparams": 1,
            "npm":1,
            scores: this.data,
            "chat": []
        }];
    }
}); // ghost

Messages.Ghost = Message.extend({
    init: function (account) {
        this.player = account.player;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.ghost, [
                this.player.position,
                this.player.x,
                this.player.y,
                this.player.look
            ]
        ];
    }
});

Messages.gameUpdate = Message.extend({
    init: function (account) {
        this.player = account.player;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.update, [
                this.player.game_position,
                this.player.x,
                this.player.y,
                this.player.look
            ]
        ];
    }
});

Messages.gamePass = Message.extend({
    init: function (account, nextplayer, room) {
        this.account = account;
        this.player = account.player;
        this.nextplayer = nextplayer;
        this.room = room;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.pass, [
                this.nextplayer.position,
                this.player.position,
                this.player.x,
                this.player.y,
                this.player.look,
                this.player.delay,
                this.nextplayer.position, [],
                this.room.game.thor.x,
                this.room.game.thor.y,
                this.room.game.thor.angle, //thor_angle
                this.room.game.thor.damage, //thor_damage
            [3, 8, 0, 3, 0], //new_weather
                this.room.game.wind_power,
                this.room.game.wind_angle,
                [[7, 660, 89]],
            [[8, 660, 89],[3,897,157]]
            ]
        ];
    }
});

Messages.myAvatars = Message.extend({
    init: function (account, data) {
        this.player = account.player;
        this.data = data;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.my_avatars, this.data,
            this.player.gold,
            this.player.cash
        ];
    }
});

Messages.loginResponse = Message.extend({
    init: function (account) {
        this.account = account;
        this.player = account.player;
    },
    serialize: function () {
        this.player.lucky_egg_sec_left = parseInt(this.player.lucky_egg_seg - secondsremaining(this.player.lucky_egg_item));
        return [
            Types.SERVER_OPCODE.my_player_info, [
                this.account.user_id,
                this.account.location_type,
                this.account.room_number,
                this.player.game_id,
                this.player.rank,
                this.player.gp,
                this.player.gold,
                this.player.cash,
                this.player.gender,
                this.player.unlock,
                this.player.ahead,
                this.player.abody,
                this.player.aeyes,
                this.player.aflag,
                this.player.abackground,
                this.player.aforeground,
                this.player.event1,
                this.player.event2,
                this.player.photo_url,
                this.player.guild,
                this.player.guild_job,
                this.player.name_changes,
                this.player.power_user,
                this.player.tournament,
                this.player.plus10gp,
                this.player.mobile_fox,
                this.player.country,
                this.player.flowers,
                this.player.relationship_status,
                this.player.relationship_with_id,
                this.player.relationship_with_rank,
                this.player.relationship_with_photo,
                this.player.relationship_with_name,
                this.player.relationship_with_gender,
                this.player.maps_pack,
                this.player.guild_score,
                this.player.megaphones,
                this.player.lucky_egg_sec_left,
				this.player.electrico
				
            ]
        ];
    }
});

Messages.alertResponse = Message.extend({
    init: function (title, msj) {
        this.title = title;
        this.msj = msj;
    },
    serialize: function () {
        return [
            Types.SERVER_OPCODE.alert,
            this.title,
            this.msj
        ];
    }
});

Messages.alert2Response = Message.extend({
    init: function (type, arr) {
        this.type = type;
        this.arr = arr;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.alert2, this.type, this.arr];
    }
});

/*Messages.guildResponse = Message.extend({
    init: function (account, members) {
        this.account = account;
        this.members = members;
    },
    serialize: function () {
        var data = [Types.SERVER_OPCODE.guild];
        if (this.account.player.guild !== '' && this.members.length > 0)
            data.push(this.members);
        //Logger.info("Members List #2: "+data);
        return data;
    }
});*/

/*Messages.friendsResponse = Message.extend({
    init: function (account, friends) {
        this.account = account;
        this.friends  = friends;
    },
    serialize: function () {
        var datos2 = [Types.SERVER_OPCODE.friends, this.friends, 1, 1];
        Logger.info("Friend List #2: "+datos2);
        return datos2;
        //return [Types.SERVER_OPCODE.friends, [
            //aburren
        //    [1, 0, "Eber", "", "b26c2"],
        //    [2, 0, "GutixD", "", "b26c2"],
        //    [3, 0, "Jose", "", "b26c2"],
        //    [4, 0, "Danny", "", "b26c2"],
        //    [1640, 0, "OrlandoRG", "", "b26c2"],
        //    [1832, 0, "NELSON RC", "", "b26c2"],
        //    [1980, 0, "Neva Sk!!", "", "b26c2"],
        //    [22, 0, "Marcoz", "", "b27c2"],
        //], 3, 1];
    }
});*/

Messages.gameUseItem = Message.extend({
    init: function (account, item) {
        this.position = account.player.game_position;
        this.item = item;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.game_use_item,
            this.position,
            this.item
        ];
    }
});
Messages.pChatResponse = Message.extend({
    init: function (account, game_id, msj) {
        this.id = account.user_id;
        this.game_id = game_id;
        this.msj = msj;
        this.account = account;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.pchat,
            this.id,
            this.game_id,
            this.msj,
            this.account.rank,
            this.account.guild,
            this.account.country
        ];
    }
});

Messages.InfoResponse = Message.extend({
    init: function (account) {
        this.account = account;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.info, [
            this.account.user_id,
            this.account.player.game_id,
            this.account.player.flowers,
            this.account.player.rank,
            this.account.player.gp,
            this.account.player.gender,
            this.account.player.photo_url,
            this.account.player.damage_average,
            this.account.player.win_rate,
            this.account.player.win,
            this.account.player.loss,
            this.account.player.guild,
            this.account.player.guild_job,
            this.account.player.relationship_status,
            this.account.player.relationship_with_id,
            this.account.player.relationship_with_rank,
            this.account.player.relationship_with_photo,
            this.account.player.relationship_with_name,
            this.account.player.relationship_with_gender,
            this.account.player.is_my_friend,
            this.account.player.is_my_guild_mate
        ]];
    }
});

Messages.GuildreqResponse = Message.extend({
    init: function (account) {
        this.account = account;
    },
    serialize: function () {
        return [Types.SERVER_OPCODE.guildreq, [
            this.account.player.game_id, [
                this.account.player.ahead,
                this.account.player.abody,
                this.account.player.aeyes,
                this.account.player.aflag,
                this.account.player.abackground,
                this.account.player.aforeground,
            ],
            "4964645674545",
            this.account.player.guild_id,
            this.account.player.guild
        ]];
    }
});