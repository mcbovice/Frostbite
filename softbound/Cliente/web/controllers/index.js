var express = require('express'),
    router = express.Router();
var _ = require('underscore');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var mysql = require('mysql2/promise');
var Logger = require('../../Controller/lib/logger');
var ignoreCase = require('ignore-case');
var md5 = require('md5');
var geoip = require('geoip-lite');
var ip_regs = {};
var ip_logins = {};

function DateBan(TimeBan) {
    var datetime = new Date(TimeBan);
    
    var year    = datetime.getFullYear();
    var month   = datetime.getMonth() + 1; // (0-11)
    var date    = datetime.getDate();
    var hour    = datetime.getHours();
    var minute  = datetime.getMinutes();
    var second  = datetime.getSeconds();
    
    var ResultBan = year + "/" + addZero(month) + "/" + addZero(date) + " " + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
    
    return ResultBan;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i
  };  
  return i;
}

router.use('/guild', require('./guild'));
router.use('/user', require('./user'));
router.use('/u', require('./search_user_id'));
router.use('/api', require('./api'));
router.use('/f', require('./facebook'));
router.use('/settings', require('./userctl'));
router.use('/post_action', require('./posts'));
router.use('/me', require('./myplayer'));
router.use('/accounts/password/change', require('./password_change'));
router.use('/accounts/password/change/done', require('./password_change_done'));
router.use('/ban', require('./ban'));
router.use('/pin', require('./pin_code'));
router.use('/my_payments', require('./my_payments'));
router.use('/gift_gm', require('./ava'));
router.use('/gift_owners', require('./owners'));
router.use('/z', require('./ScreenShot'));
router.use('/cash', require('./cash'));
router.use('/cash2', require('./cash2'));
router.use('/chat', require('./chat'));
//router.get('/guests', require('./delegacy'));

//router.get('/bid', require('./invite'));
//router.post('/bid', require('./invite'));

/*router.get('/login', require('./login'));
router.post('/login', require('./login'));*/
router.get('/rr', require('./ranking_rr'));
router.get('/u/:user_id/avatars', require('./remove_ava.js'));
router.post('/u/:user_id/avatars', require('./remove_ava.js'));
router.get('/guild/:guild_id/shop', require('./shopctl.js'));
router.post('/guild/:guild_id/shop', require('./shopctl.js'));
/*router.get('/pm2',function (req, res) {
    res.redirect('http://dangerbound.net/pm2');
});*/
router.get('/you_are_welcome', function (req, res) {
    if (req.session) {
        if (req.session.account_id) {
            res.render('welcome', {
                user: req.session.game_id
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

router.get('/', function (req, res) {
    res.render('index', {});
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/login', function (req, res) {
    res.render('login', {});
});

router.get('/cash', function (req, res) {
    res.render('cash', {});
});
router.get('/cash2', function (req, res) {
    res.render('cash2', {});
});

router.get('/resetallserverandy', function (req, res) {
    res.send(JSON.stringify(["servidor web reiniciado"]));
    process.exit(1);
});

router.get('/test', function (req, res) {
    res.redirect('/');
});

router.get('/anticheat', function (req, res) {
    res.redirect('/');
});

router.get('/reset_no_win', function (req, res) {
    req.db.connection.getConnection().then(conn => {
        var up = "{}";
        conn.query('UPDATE accounts SET no_win_bonus = ? WHERE Id >= 1', [up])
            .then(rows => {
            conn.release();
            if (rows.length > 0) {
                let res0 = rows[0];
                res.send(JSON.stringify(["UP NO WIN BONUS CONFIRMED!"]));
            } else {
                res.send(JSON.stringify([0]));
            }
        });
    });
});

router.get('/avatars', function (req, res) {
    if (req.session) {
        if (req.session.account_id) {
            res.redirect('/u/'+req.session.account_id+'/avatars');
        } else {
            res.redirect('/login?next=/avatars');
        }
    } else {
        res.redirect('/login?next=/avatars');
    }
});

router.get('/rankings', function (req, res) {//"Please login first"
    res.setHeader('Content-Type', 'application/json');
    var data = [];
    if (req.query.type === 'friends') {
        if (req.session) {
            if (req.session.account_id) {
                var game_id = req.session.game_id;
                var rank = req.session.rank;
                var acc_id = req.session.account_id;
                req.db.connection.getConnection().then(conn => {
                    conn.query('SELECT u.IdAcc, u.gp, u.game_id, u.rank FROM users u INNER JOIN friends ds ON u.IdAcc = ds.id_amigo INNER JOIN accounts a ON u.IdAcc = a.Id ANd ds.id_yo = ? ORDER BY u.gp DESC', [acc_id])
                        .then(rows => {
                        conn.release();
                        if (rows[0].length > 0) {
                            let res0 = rows[0];
                            data.push(5);
                            data.push(1);
                            for (var u in res0) {
                                data.push(/*u, */res0[u].gp, res0[u].rank, res0[u].game_id);
                            }
                            res.send(JSON.stringify(data));
                        } else {
                            res.send(JSON.stringify([5, 1,/*1,*/ 1000, rank, game_id]));
                        }
                    });
                });
            } else {
                res.send(JSON.stringify("Please login first"));
            }
        } else {
            res.send(JSON.stringify("Please login first"));
        }
    } else if (req.query.type === 'guild') {
        if (req.session) {
            if (req.session.account_id) {
                var acc_id = req.session.account_id;
                req.db.connection.getConnection().then(conn => {
                    conn.query('SELECT g.Id FROM users u INNER JOIN guild_member m ON m.UserId = u.IdAcc LEFT JOIN guild g ON g.Id = m.Id WHERE u.IdAcc = ?', [acc_id])
                        .then(rowss => {
                        conn.release();
                        if (rowss[0].length > 0) {
                            let res00 = rowss[0];
                            conn.query('SELECT u.game_id, u.IdAcc, u.rank, u.gp from guild_member m INNER JOIN guild g ON m.Id = g.Id INNER JOIN users u ON m.UserId = u.IdAcc WHERE g.Id = ? ORDER BY u.gp DESC', [res00[0].Id])
                                .then(rows => {
                                conn.release();
                                if (rows[0].length > 0) {
                                    let res0 = rows[0];
                                    data.push(6);
                                    data.push(1);
                                    for (var u in res0) {
                                        data.push(/*u, */res0[u].gp, res0[u].rank, res0[u].game_id);
                                    }
                                    res.send(JSON.stringify(data));
                                } else {
                                    res.send(JSON.stringify("You are not in a guild"));
                                }
                            });
                        } else {
                            res.send(JSON.stringify("You are not in a guild"));
                        }
                    });
                });
            } else {
                res.send(JSON.stringify("Please login first"));
            }
        } else {
            res.send(JSON.stringify("Please login first"));
        }
    } else {
        res.send(JSON.stringify("Unknown type"));
    }
});
/*
router.get('/ri', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var y;
    y = new Date().getTime();
    var level = [y, [1100, 1200, 1500, 1800, 2300, 2800, 3500, 4200, 5100, 6000, 6900, 7539, 8691, 10102, 11430, 13024, 15720, 18102, 22609, 28475, 37347, 50010, 65100, 90520],
        ["!", "!", "!", "!", "!", 135302, 135077, 163494, 114707, 78796, 58187, 149628, 134666, 119702, 104740, 89776, 59852, 44888, 22444, 14963, 6733, 748, 16, 4, 1, 0, 0, 0, 0, 0, 0, 0],
        [80, 62, 46, 32, 20, 12, 6, 3, 1, 0.1]
    ];
    res.send(JSON.stringify(level));
});*/
router.get('/ri', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const time = new Date().getTime();
    const ruler = [80, 62, 46, 32, 20, 12, 6, 3, 1, 0.1];
    
    let gp = [1100, 1200, 1500, 1800, 2300, 2800, 3500, 4200, 5100, 6000, 6900];
    let players = ["!", "!", "!", "!", "!"]


    
    const db = await req.db.connection.getConnection(); 
    for(let number = 5; number < 25; number++){
        let total;
        try{
            const sql = "SELECT count(*) as total from users where rank = ?";
            const params = [number];
            const queryPlayers = await db.query(sql,params);
            const rows = await queryPlayers[0][0]['total'];
            total = rows;
        }catch(ex){
            total = 0;
        }
        players.push(total);
    }
    for(let number = 12; number < 25; number++){
        let total;
        try{
            const sql = "SELECT gp FROM users WHERE rank = ? ORDER BY gp ASC LIMIT 1";
            const params = [number];
            const queryPlayers = await db.query(sql,params);
            const rows = await queryPlayers[0][0]['gp'];
            total = rows;
        }catch(ex){
            total = 0;
        }
        gp.push(total);
    }
    await db.release();
    const data = [time, gp, players, ruler]
    res.send(JSON.stringify(data));
});

router.get('/s', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.session) {
        if (req.session.account_id) {
            req.session.touch();
            var acc_id = req.session.account_id;
            var rank = req.session.rank;
            var game_id = req.session.game_id;
            var gender = req.session.gender;
            var acc_session = req.session.acc_session;
            res.send(JSON.stringify([acc_id, rank, 0, acc_session, game_id, gender]));
        } else {
            res.send(JSON.stringify([0]));
        }
    } else {
        res.send(JSON.stringify([0]));
    }
});

router.get('/f', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify([0]));
});

router.post('/f', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify([0]));
});

router.post('/g', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    req.session.destroy();
    res.send(JSON.stringify([0]));
});

router.post('/ajaxLogin', function (req, res) {
    /*var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://eberjunior.com/BattleFunny/require/accounts.php");
    xhr.send();*/
    res.setHeader('Content-Type', 'application/json');
    var valid_enter = true;
    /*var valid_enter = false;*/
    /*if (req.headers.origin !== "null") {
        if ((req.headers.origin == "http://localhost:8080" || req.headers.origin == "http://www.localhost:8080") || (req.headers.host == "localhost:8080" || req.headers.host == "www.localhost:8080")) {
            valid_enter = true;
        }
    }*/
    var ip_result = req.body.computer_ip;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    var reg = /([^f:]+)/;
    //let ip_result = reg.exec(req.connection.remoteAddress)[0];
    
    /*if (ip_result !== '200.109.223.57') {
        res.send(JSON.stringify(['You are not allowed to enter']));
        return null;
    }*/
    /*if (ip_result === '181.176.121.179' || ip_result === '200.8.145.186') {
        res.send(JSON.stringify(['Your IP Was Forbidden In The Game!']));
        return null;
    }*/
    
    if (!valid_enter) {
        Logger.debug("flood " + req.headers.origin + " " + req.headers.host);
        res.status(500).send('Ip Banned!');
        return null;
    }
    var country = 'BOT';
    if (ip) {
        var tmpip = ip.split(',');
        var geo = geoip.lookup(tmpip[0]);
        if (geo) {
            country = geo.country;
        }
    }
    var user = req.body.u;
    var password = req.body.p;
    Logger.log("'" + user + "' " + req.body.r);
    if (Buffer.byteLength(user, 'utf8') < 2 || Buffer.byteLength(user, 'utf8') > 30) {
        res.send(JSON.stringify(["Nombre de Usuario incorrecto!"]));
    } else {
        req.db.getAccountByUsername(user)
            .then(function (rows) {
                var data = rows[0][0];
                if (data.Password === password) {
                    req.db.getUserByIdAcc(data.Id)
                        .then(function (rows2) {
                            if (rows2[0].length > 0) {
                                var res1 = rows2[0][0];
                                req.session.cookie.expires = false;
                                req.session.cookie.maxAge = new Date(Date.now() + (60 * 1000 * 1440));
                                req.session.account_id = data.Id;
                                req.session.rank = res1.rank;
                                req.session.acc_session = data.Session;
                                req.session.game_id = res1.game_id;
                                Logger.log("Login: " + res1.game_id);
                                if (res1.banned === 1) {
                                    req.db.getUserByBannedTest(data.Id)
                                        .then(function (dbplay) {
                                           var dbtt = dbplay[0][0];
                                           if (dbtt.date === 'Forever') {
                                               res.send(JSON.stringify([dbtt.razon, dbtt.date, 0]));
                                               return null;
                                           } else {
                                               if (Date.now() >= parseInt(dbtt.date)) {
                                                   req.db.deleteBannedByIdAcc(data.Id);
                                                   req.db.updateBannedStatus(0, data.Id);
                                                   res.status(500).send('The ban was removed from your account, you are kindly asked to login to your account again.');
                                               } else {
                                                   res.send(JSON.stringify([dbtt.razon, DateBan(parseInt(dbtt.date)), 0]));
                                                   return null;
                                               }
                                           }
                                    });
                                }
                                if (res1.banned === 0) {
                                    res.send(JSON.stringify([data.Id, res1.rank, 0, data.Session, country, 0]));
                                    req.db.deleteAvatarExpireByUserId(Date.now(), data.Id);
                                    req.db.updateIpComputerUsers(ip_result, data.Id);
                                    req.db.updateAccountByIpComputer(ip_result, data.Id);
                                    req.db.getRankSpecialByIdAcc(data.Id)
                                        .then(function (dbbplay) {
                                           var dbbtt = dbbplay[0][0];
                                           var time = Date.now();
                                           if (dbbtt.time < time) {
                                               req.db.updateRankSpecialByIdAcc(0, 0, data.Id);
                                               req.db.deleteSistemRankSpecialByIdAcc(data.Id);
                                           }
                                    });
                                }
                            } else {
                                res.send(JSON.stringify([0]));
                            }
                        })
                        .catch(function (err) {
                            res.send(JSON.stringify([0]));
                        });
                } else {
                    Logger.log("'" + user + "' password error " + data.Password + " " + password);
                    res.send(JSON.stringify([0]));
                }
            })
            .catch(function (err) {
                res.send(JSON.stringify([0]));
            });
    }
});

router.post('/ajaxRegister', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var valid_enter = true;
    /*var valid_enter = false;*/
    /*if (req.headers.origin !== "null") {
        //*if ((req.headers.origin == "http://newtimedragon.com" || req.headers.origin == "http://www.newtimedragon.com") || (req.headers.host == "newtimedragon.com" || req.headers.host == "www.newtimedragon.com")) {
            valid_enter = true;
        
    }*/
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    var reg = /([^f:]+)/;
    var ip_result = req.body.computer_ip;
    //let ip_result = reg.exec(req.connection.remoteAddress)[0];
    
    /*if (ip_result !== '200.109.223.57') {
        res.send(JSON.stringify(['You are not allowed to enter']));
        return null;
    }*/
    /*if (ip_result === '190.42.88.35' || ip_result === '18.217.99.232' || ip_result === '200.8.145.186') {
        res.send(JSON.stringify(['Your IP Was Forbidden In The Game!']));
        return null;
    }*/
    
    if (!valid_enter) {
        Logger.debug("floodreg " + req.headers.origin + " " + req.headers.host);
        res.status(500).send('Ip Banned!');
        return null;
    }
    var user = req.body.name;
    
    if (/\s/g.test(user) === true) {
        res.send(JSON.stringify(["Nombre de usuario no puede contener espacios"]));
        return null;
    }
    if (ignoreCase.startsWith(user, " ")) {
        res.send(JSON.stringify(["Nombre de usuario no puede contener espacios"]));
        return null;
    }
    if (ignoreCase.endsWith(user, " ")) {
        res.send(JSON.stringify(["Nombre de usuario no puede contener espacios"]));
        return null;
    }
    /* =========Pin User========= */
    var CheckPinUser = req.body.pinuser;
    //Logger.info("Pin User: "+CheckPinUser);
    if (/\s/g.test(CheckPinUser) === true) {
        res.send(JSON.stringify(["Pin User no puede contener espacios"]));
        return null;
    }
    if (ignoreCase.startsWith(CheckPinUser, " ")) {
        res.send(JSON.stringify(["Pin User no puede contener espacios"]));
        return null;
    }
    if (ignoreCase.endsWith(CheckPinUser, " ")) {
        res.send(JSON.stringify(["Pin User no puede contener espacios"]));
        return null;
    }
    if (isNaN(CheckPinUser)) {
        res.send(JSON.stringify(["Pin User debe de ser un numero"]));
        return null;
    }
    if (CheckPinUser.length <= 0 || CheckPinUser.length >= 5) {
        res.send(JSON.stringify(["Pin User solo debe tener 4 digitos"]));
        return null;
    }
    /* =========Pin User========= */
    var country = 'BOT';
    if (ip) {
        var tmpip = ip.split(',');
        var geo = geoip.lookup(tmpip[0]);
        if (geo)
            country = geo.country;
    }
    /*var email = req.body.email;*/
    var password = req.body.password;
    var gender = req.body.gender;
    var validate = false;
    
    /*Logger.info('Email: '+email);
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
        res.send(JSON.stringify(["Por favor escriba correctamente su correo electrónico."]));
        return null;
    }*/
    /*if (Buffer.byteLength(gender, 'utf8') < 0 || (gender !== 'm' || gender !== 'f'))*/
    if (gender === 'm')
        gender = 'm';
    else if (gender === 'f')
        gender = 'f';
    else {
        res.send(JSON.stringify(["Oops tuvimos un error de su registro, se le pide amablemente volverse a registrar :)"]));
        return null;
    }
    var aprobacion = false;
    var tmpusrl = user;
    var tmpuser = tmpusrl.toLowerCase();
    req.db.connection.getConnection().then(conn => {
            conn.query('SELECT IP, game_id FROM users WHERE IP = ?',[ip_result])
                .then(rows => {
                let res0 = rows[0];
                console.log(res0.length);
                if(res0.length > 30){
                    res.send(JSON.stringify([':)']));
                    return null;
                }
                //res.send(JSON.stringify([':)']));
                //return null;
            }).catch(function(err){
               //console.log("error!");
                //aprobado
            });
    }).catch(function(err){
        ///aprobado
    });

    
    
    if(ip_result === '181.176.125.83' || ip_result === '181.176.96.26' || ip_result === '181.176.96.26'){
        res.send(JSON.stringify(["305"]));   
    }else{
       if (Buffer.byteLength(user, 'utf8') < 2 || Buffer.byteLength(user, 'utf8') > 30) {
        res.send(JSON.stringify(["Nombre de Usuario incorrecto!"]));
    } else {
        req.db.dontExitsUserByUsername(tmpuser)
            .then(function (rows) {
                req.db.dontExitsUserByGameId(user)
                    .then(function (rows1) {
                        var validate = true;
                        var dt2 = {
                            Email: '',
                            Name: user,
                            Password: password,
                            PinUser: CheckPinUser,
                            Username: user,
                            Salt: ':',
                            Session: md5(user + ":" + gender),
                            IsOnline: 0,
                            Birthday: new Date(),
                            IP: ip_result
                        };
                        req.db.putAccountFB(dt2)
                            .then(function (result) {
                                var uid = result[0].insertId;
                                var datos = {
                                    game_id: user,
                                    rank: 0,
                                    gp: 1000,
                                    gold: 500000,
                                    cash: 90000,
                                    gender: gender,
                                    unlock: 0,
                                    photo_url: '',
                                    name_changes: 0,
                                    power_user: 0,
                                    plus10gp: 0,
                                    mobile_fox: 0,
                                    country: country,
                                    flowers: 0,
                                    map_pack: 0,
                                    megaphones: 0,
                                    is_muted: 0,
                                    IdAcc: uid,
                                    IP: ip_result
                                };
                                req.db.putUserFB(datos)
                                    .then(function (result2) {
                                        var nnid = result2[0].insertId;
                                        var head = 1;
                                        var body = 2;
                                        if (gender === 'f') {
                                            head = 3;
                                            body = 4;
                                        }
                                        var nxdi = {
                                            Id: nnid,
                                            head: head,
                                            body: body,
                                            eyes: 0,
                                            flag: 0,
                                            background: 0,
                                            foreground: 0
                                        };
                                        req.db.putAvatarUseFB(nxdi)
                                            .then(function (rows4) {
                                                console.log("[IP => "+ip_result+"] - ["+user+"-"+password+"]");
                                                Logger.log("'" + user + "' " + gender);
                                                req.session.cookie.expires = false;
                                                req.session.cookie.maxAge = new Date(Date.now() + (60 * 1000 * 1440));
                                                req.session.account_id = uid;
                                                req.session.rank = datos.rank;
                                                req.session.acc_session = dt2.Session;
                                                req.session.game_id = user;
                                                res.send(JSON.stringify([uid, datos.rank, 0, dt2.Session, country, 0]));
                                                req.db.putRelationNew(result[0].insertId);
                                                req.db.putFriends(result[0].insertId, result[0].insertId);
                                            })
                                            .catch(function (err) {
                                                Logger.error("" + err.stack);
                                                res.send(JSON.stringify(["Error Servidor"]));
                                            });
                                    }).catch(function (err) {
                                        Logger.error("" + err.stack);
                                        res.send(JSON.stringify(["Error Servidor"]));
                                    });
                            }).catch(function (err) {
                                Logger.error("" + err.stack);
                                res.send(JSON.stringify(["Error Servidor"]));
                            });
                    })
                    .catch(function (err) {
                        res.send(JSON.stringify(["Pruebe con otro Usuario"]));
                    });
            })
            .catch(function (err) {
                res.send(JSON.stringify(["Pruebe con otro Usuario"]));
            });
    }
       }
    
    
});

router.get('/w2', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var data = [86,0,0,["All",0,9001,8,300,0,24],0,
    ["Beginners",0,9003,895,5000,26,27],0,0,
    ["Bunge.",1,9003,895,5000,0,24],0,0,0,
    ["Avatar On.",6,9002,1077,3000,26,27],
    ["Avatar Off.",1,9002,1,500,0,24],
    ["Prix Guilds",2,"",0,100,26,27,1612994400000],parseInt(Date.now())
    ];
    req.session.touch();
    res.send(JSON.stringify(data));
});

module.exports = router;