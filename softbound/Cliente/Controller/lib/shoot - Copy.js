var _ = require("underscore");
var cls = require("./class");
var Types = require("../gametypes");
var Logger = require('./logger');
var Message = require("./message");
var Map = require("./map");
var Box = require('./box');
var Vector = require('./vect');

// Shoot
module.exports = class Shoot {
    constructor(x, y, ang, power, type, ax, ay, wind_ang, wind_power, stime, account,thor=false) {
        var self = this;
        this.x0 = x;
        this.y0 = y;
        this.ax = ax;
        this.ay = ay;
        this.account = account;
        if (thor)
        this.thor = 1;
        this.ang = ang;
        this.power = power;
        this.time = 0;
        this.stime = stime;
        this.exp = 0;
        this.img = 0;
        this.wind_ang = wind_ang;
        this.wind_power = wind_power;
        this.chat_complete = false;
        this.v = new vectr([this.ang, this.power]);
		this.pala_bunge = 38;
        //this.retrase_time = retrase_time;
        this.IsComplete = false;
        this.canCollide = false;
        this.damageComplete = false;
        this.groundCollide = false;

        this.box = new Box(new Vector(x, y), 30, 25, 0);
        this.explodebox = new Box(new Vector(x, y), 40, 40, 0);
        this.ss = 0;


        var mobile = this.account.player.mobile;
        var defmobile = Types.MOBILES[mobile];
        
        var attack_my_ava = this.account.player.ava_attack;
        if (this.account.player.check_my_ava === 0)
            attack_my_ava = 0;
        var total_attack = parseInt(Math.round(parseInt(attack_my_ava / 2.5)));
        if (total_attack > 50) {
            total_attack = 50;
        }
        this.damageshot = 200 + total_attack;
        if (type === 0) {
            this.ss = 0;
            this.damageshot = 200 + total_attack;
            if (this.mobile == Types.MOBILE.ARMOR)
                this.damageshot = 130 + total_attack,
			   this.pala_bunge = 58;
            else if (this.mobile == Types.MOBILE.ICE)
                this.damageshot = 125 + total_attack,
			    this.pala_bunge = 46;
            else if (this.mobile == Types.MOBILE.ADUKA)
                this.damageshot = 160 + total_attack,
			    this.pala_bunge = 40;
            else if (this.mobile == Types.MOBILE.LIGHTNING)
                this.damageshot = 230 + total_attack;
            else if (this.mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 40 + total_attack,
			    this.pala_bunge = 25;
            else if (this.mobile == Types.MOBILE.JD)
                this.damageshot = 160 + total_attack,
			    this.pala_bunge = 40;
            else if (this.mobile == Types.MOBILE.ASATE)
                this.damageshot = 90 + total_attack;
            else if (this.mobile == Types.MOBILE.KNIGHT)
                this.damageshot = 210 + total_attack;
            else if (this.mobile == Types.MOBILE.FOX)
                this.damageshot = 330 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.NAK)
                this.damageshot = 330 + total_attack;
            else if (this.mobile == Types.MOBILE.TRICO)
                this.damageshot = 330 + total_attack;
            else if (this.mobile == Types.MOBILE.MAGE)
                this.damageshot = 324 + total_attack,
			    this.pala_bunge = 50;
            else if (this.mobile == Types.MOBILE.TURTLE)
                this.damageshot = 330 + total_attack,
			    this.pala_bunge = 45;
            else if (this.mobile == Types.MOBILE.BOOMER)
                this.damageshot = 270 + total_attack,
			    this.pala_bunge = 28;
            else if (this.mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 170 + total_attack;
            else if (this.mobile == Types.MOBILE.GRUB)
                this.damageshot = 330 + total_attack;
            else if (this.mobile == Types.MOBILE.RAON)
                this.damageshot = 70 + total_attack,
			   this.pala_bunge = 20;
            else if (this.mobile == Types.MOBILE.DRAG)
                this.damageshot = 170 + total_attack;
            else if (this.mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 120 + total_attack;
            else if (this.mobile == Types.MOBILE.MAYA)
                this.damageshot = 450 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON2)
                this.damageshot = 220 + total_attack;
            else if (this.mobile == Types.MOBILE.RANDOMIZER)
                this.damageshot = 70 + total_attack;
             else if (this.mobile == Types.MOBILE.TIBURON)
                this.damageshot = 200 + total_attack,
			    this.pala_bunge = 30;
            else if (this.mobile == Types.MOBILE.EASTER)
                this.damageshot = 189 + total_attack;
            else if (this.mobile == Types.MOBILE.COPYLOID)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.PHOENIX)
                this.damageshot = 120 + total_attack;
            else if (this.mobile == Types.MOBILE.HALLOWEEN)
                this.damageshot = 700 + total_attack;
            else if (this.mobile == Types.MOBILE.FROG)
                this.damageshot = 330 + total_attack;
            else if (this.mobile == Types.MOBILE.BEE)
                this.damageshot = 400 + total_attack;
        } else if (type == 1) {
            if (this.mobile == Types.MOBILE.ARMOR)
                this.damageshot = 125 + total_attack;
            else if (this.mobile == Types.MOBILE.ICE)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.ADUKA&&this.thor)
                this.damageshot = 70 + total_attack,
			    this.pala_bunge = 30;
                else if (this.mobile == Types.MOBILE.ADUKA)
                this.damageshot = 0,
                this.pala_bunge = 0;
            else if (this.mobile == Types.MOBILE.LIGHTNING)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 43 + total_attack,
			    this.pala_bunge = 14;
            else if (this.mobile == Types.MOBILE.JD)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.ASATE)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.KNIGHT)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.FOX)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON)
                this.damageshot = 134 + total_attack;
            else if (this.mobile == Types.MOBILE.NAK)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.TRICO)
                this.damageshot = 134 + total_attack;
            else if (this.mobile == Types.MOBILE.MAGE)
                this.damageshot = 134 + total_attack;
            else if (this.mobile == Types.MOBILE.TURTLE)
                this.damageshot = 207 + total_attack;
            else if (this.mobile == Types.MOBILE.BOOMER)
                this.damageshot = 100 + total_attack,
			    this.pala_bunge = 32;
            else if (this.mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 207 + total_attack;
            else if (this.mobile == Types.MOBILE.GRUB)
                this.damageshot = 134 + total_attack;
            else if (this.mobile == Types.MOBILE.RAON)
                this.damageshot = 100 + total_attack,
			    this.pala_bunge = 10;
            else if (this.mobile == Types.MOBILE.DRAG)
                this.damageshot = 100 + total_attack;
            else if (this.mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 150 + total_attack;
            else if (this.mobile == Types.MOBILE.MAYA)
                this.damageshot = 180 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON2)
                this.damageshot = 234 + total_attack;
            else if (this.mobile == Types.MOBILE.RANDOMIZER)
                this.damageshot = 85 + total_attack;
            else if (this.mobile == Types.MOBILE.TIBURON)
                this.damageshot = 60 + total_attack,
			    this.pala_bunge = 28;
            else if (this.mobile == Types.MOBILE.EASTER)
                this.damageshot = 158 + total_attack;
            else if (this.mobile == Types.MOBILE.COPYLOID)
                this.damageshot = 375 + total_attack;
            else if (this.mobile == Types.MOBILE.PHOENIX)
                this.damageshot = 200 + total_attack;
            else if (this.mobile == Types.MOBILE.HALLOWEEN)
                this.damageshot = 480 + total_attack;
            else if (this.mobile == Types.MOBILE.FROG)
                this.damageshot = 450 + total_attack;
            else if (this.mobile == Types.MOBILE.BEE)
                this.damageshot = 100 + total_attack;
            this.ss = 0;
        } else if (type == 2) {
            this.ss = 4;
            this.damageshot = 450 + total_attack;
            if (this.mobile == Types.MOBILE.ARMOR)
                this.damageshot = 100 + total_attack;
            else if (this.mobile == Types.MOBILE.ICE)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.ADUKA)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.LIGHTNING)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 50 + total_attack,
			    this.pala_bunge = 30;
            else if (this.mobile == Types.MOBILE.JD)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.ASATE)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.KNIGHT)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.FOX)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.NAK)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.TRICO)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.MAGE)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.TURTLE)
                this.damageshot = 170 + total_attack;
            else if (this.mobile == Types.MOBILE.BOOMER)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.GRUB)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.RAON)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAG)
                this.damageshot = 500 + total_attack;
            else if (this.mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 200 + total_attack;
            else if (this.mobile == Types.MOBILE.MAYA)
                this.damageshot = 900 + total_attack;
            else if (this.mobile == Types.MOBILE.DRAGON2)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.RANDOMIZER)
                this.damageshot = 300 + total_attack;
            else if (this.mobile == Types.MOBILE.TIBURON)
                this.damageshot = 400 + total_attack;
            else if (this.mobile == Types.MOBILE.EASTER)
                this.damageshot = 200 + total_attack;
            else if (this.mobile == Types.MOBILE.COPYLOID)
                this.damageshot = 1100 + total_attack;
            else if (this.mobile == Types.MOBILE.PHOENIX)
                this.damageshot = 250 + total_attack;
            else if (this.mobile == Types.MOBILE.HALLOWEEN)
                this.damageshot = 1200 + total_attack;
            else if (this.mobile == Types.MOBILE.FROG)
                this.damageshot = 850 + total_attack;
            else if (this.mobile == Types.MOBILE.BEE)
                this.damageshot = 180 + total_attack;
        }

        var fimg = defmobile.bullets[type];
        //console.log("bullets ************ "+fimg);
        if(fimg === 1994){
            var aa = Types.RANDOM_B1.length;
            var a = _this.AllM([0 ,aa]);
            var code = Types.RANDOM_B1[a];
            this.img = code;
            //console.log("bullets1 "+code);
        } else if(fimg === 1995){
            var bb = Types.RANDOM_B2.length;
            var b = _this.AllM([0 ,bb]);
            var code = Types.RANDOM_B2[b];
            this.img = code;
            //console.log("bullets2 "+code);
        } else if(fimg === 1996){
            var cc = Types.RANDOM_B3.length;
            var c = _this.AllM([0 ,cc]);
            var code = Types.RANDOM_B3[c];
            this.img = code;
            //console.log("bullets3 "+code);
        } else this.img = fimg;

        var fexp = defmobile.explodes[type];
        //console.log("explodes ******* "+fexp);
        if(fexp === 1994){
            var aa = Types.RANDOM_B1.length;
            var a = _this.AllM([0 ,aa]);
            var code = Types.RANDOM_E1[a];
            this.exp = code;
            //console.log("explodes1 "+code);
        } else if(fexp === 1995){
            var bb = Types.RANDOM_B2.length;
            var b = _this.AllM([0 ,bb]);
            var code = Types.RANDOM_E2[b];
            this.exp = code;
            //console.log("explodes2 "+code);
        } else if(fexp === 1996){
            var cc = Types.RANDOM_B3.length;
            var c = _this.AllM([0 ,cc]);
            var code = Types.RANDOM_E3[c];
            this.exp = code;
            //console.log("explodes3 "+code);
        } else if (typeof (fexp) == 'undefined' || fexp === null) {
            this.exp = 0;
        } else this.exp = fexp;
    }

    move(x, y) {
        if (this.box === null)
            this.box = new Box(new Vector(x, y), 30, 25, 0);
        this.box.setp(new Vector(x, y));
    }

    setExplodebox(x, y) {
        if (this.explodebox === null)
            this.explodebox = new Box(new Vector(x, y), 40, 40, 0);
        this.explodebox.setp(new Vector(x, y));
    }

    AllM(argv) {
        return Math.floor(Math.random() * (argv[0] - argv[1]));
    }

    update() {
        this.time++;
    }

    getPosAtTime() {
        var a = this.time / 485;
        return {
            x: Math.ceil(this.x0 + this.v.x * a + this.ax * a * a / 2),
            y: Math.ceil(this.y0 + this.v.y * a + this.ay * a * a / 2)
        };
    }

    GetAngleAtTime(a) {
        var b = this.getPosAtTime(a - 5);
        a = this.getPosAtTime(a + 5);
        return RadToAngle(Math.atan2(a.y - b.y, a.x - b.x));
    }
};

function vectr(argv) {
    this.ang = argv[0];
    this.size = argv[1];
    this.x = Math.cos(argv[0] * Math.PI / 180) * argv[1];
    this.y = -Math.sin(argv[0] * Math.PI / 180) * argv[1];
}

function RadToAngle(a) {
    return 180 * a / Math.PI;
}

