var express = require('express'),
    router = express.Router();

var mysql = require('mysql');
var Logger = require('../../Controller/lib/logger');
var ignoreCase = require('ignore-case');
var md5 = require('md5');
var constants = require('constants');
var auth = require('../middlewares/auth');
var csrf = require('csurf');
var csrfProtection = csrf({
    cookie: true
});
var fs = require('fs');

router.get('/', function (req, res) {
    res.redirect('/');
});

router.post('/', function (req, res) {
    var cont = true;
    var id_page = req.body.UserPage;
    var texto = req.body.text;
    var date = Math.round(Date.now() / 1000);
    var acc_id = req.session.account_id;
    Logger.info(req.body.action);
    if (req.body.action === 'post') {
        req.db.getUserByIdAcc(parseInt(id_page))
            .then(function (resb) {
            var rows = resb[0];

            var findme = "<";

            if(texto.indexOf(findme) > -1){
                res.send(JSON.stringify('VIVO TE CREES RECONCHA DE TU MADRE, CHUPA PINGA DE MRD'));
            }else{
                req.db.putPosts(acc_id, id_page, texto, date)
                .then(function (resb) {
                res.redirect(req.header('Referer'));
            }).catch(function (err) {
                res.redirect('/');
            });
            }
        }).catch(function (err) {
            res.redirect('/');
        });
    }else if (req.body.action === 'delete') {
        req.db.connection.getConnection().then(conn => {
            var acc_id = req.session.account_id;
            var post_id = parseInt(req.body.PostID);
            Logger.info('Post ID: '+post_id+' - UserID: '+acc_id);
            conn.query('SELECT post_id, user_de, user_para, texto, fecha FROM user_post WHERE post_id = ?', [post_id])
                .then(rows4 => {
                conn.release();
                if (rows4[0].length > 0) {
                    var rows_x2 = rows4[0];
                    if (rows_x2[0].user_de == parseInt(acc_id) || rows_x2[0].user_para == parseInt(acc_id) || req.session.rank === 31) {
                        req.db.deletePostsByID(req.body.PostID)
                            .then(function () {
                            res.redirect(req.header('Referer'));
                        }).catch(function (err) {
                            res.redirect('/');
                        });
                    } else {
                        res.send("not your page or your post");
                    }
                } else {
                    res.send("No publication found.");
                }
            });
        });
    } else if (req.body.action === 'comment') {
        texto = texto.replace('<div', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<a', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<h1', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<h2', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<h3', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<h4', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<p', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<image', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<video', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<audio', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<i', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<u', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<meta', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<link', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<script', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<style', 'ATTACK_POST_JC_2020');
            texto = texto.replace('function(', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<input', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<span', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<body', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<head', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<html', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<br', 'ATTACK_POST_JC_2020');
            texto = texto.replace('</br', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<tr', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<select', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<label', 'ATTACK_POST_JC_2020');
            texto = texto.replace('button', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<table', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<td', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<textarea', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<img', 'ATTACK_POST_JC_2020');
            texto = texto.replace('id=', 'ATTACK_POST_JC_2020');
            texto = texto.replace('class=', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<canvas', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<title', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<svg', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<g', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<path', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<form', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<!doctype', 'ATTACK_POST_JC_2020');
            texto = texto.replace('{{', 'ATTACK_POST_JC_2020');
            texto = texto.replace('{{{', 'ATTACK_POST_JC_2020');
            texto = texto.replace('.backgroundImage', 'ATTACK_POST_JC_2020');
            texto = texto.replace('document.', 'ATTACK_POST_JC_2020');
            texto = texto.replace('</form', 'ATTACK_POST_JC_2020');
            texto = texto.replace('<form', 'ATTACK_POST_JC_2020');
            texto = texto.replace('boxTitle', 'ATTACK_POST_JC_2020');
            texto = texto.replace('boxBodyPost', 'ATTACK_POST_JC_2020');
            texto = texto.replace('cabro', 'ATTACK_POST_JC_2020');
            texto = texto.replace('hdpt', 'ATTACK_POST_JC_2020');/*Tu te encargas de poner eso :/ */
            if(texto.includes('ATTACK_POST_JC_2020')) {
                Logger.debug('El usuario: '+req.session.game_id+" esta intentanto hacer una inyecion SQL");
                res.redirect(req.header('Referer'));
                return null;
            }
            req.db.connection.getConnection().then(conn => {
                conn.query('INSERT INTO comment_post SET comment_user_de = ?, comment_user_para = ?, message_for = ?, time_comment = ?', [req.session.account_id, req.body.PostID, req.body.text, date])
                    .then(rows4 => {
                    conn.release();
                    if (rows4[0].affectedRows > 0 || rows4[0].changedRows > 0) {
                        res.redirect(req.header('Referer'));
                    } else {
                        res.redirect(req.header('Referer'));
                    }
                }).catch(function (err) {
                    res.redirect('/');
                });
            });
    } else if (req.body.action === 'deleteComment') {
        req.db.connection.getConnection().then(conn => {
            conn.query('SELECT comment_id, comment_user_de, comment_user_para, message_for, time_comment FROM comment_post WHERE comment_id = ?', [parseInt(req.body.CommentID)])
                .then(rows => {
                conn.release();
                if (rows[0].length > 0) {
                    var answer = rows[0][0];
                    if (answer.comment_user_de == parseInt(req.session.account_id) || req.session.rank === 31) {
                        conn.query('DELETE FROM comment_post WHERE comment_id = ?', [parseInt(req.body.CommentID)])
                            .then(rows2 => {
                            conn.release();
                            if (rows2[0].affectedRows > 0 || rows2[0].changedRows > 0) {
                                res.redirect(req.header('Referer'));
                            } else {
                                res.redirect(req.header('Referer'));
                            }
                        });
                    }
                } else {
                    res.redirect(req.header('Referer'));
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;