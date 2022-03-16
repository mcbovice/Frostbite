var mysql = require('mysql');
var config = require('../../Config/config');
var connection = mysql.createConnection({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
	port: config.database.port
});
connection.connect(function(error) {
	if (error) {
		throw error;
		console.log("[MySQL] => Error [OFF]");
	} else {
		console.log('[MySQL] => Status [ON]');
		console.log('[Developer - Eddy Casos]');
	}
});
function nRanking(gp) {
	let nRank = 0;
	for(let i = 0; i < config.autorank.rank.length; i++){
		if( gp > (config.autorank.rank[i]-1) && (config.autorank.rank[(i+1)] - 1)){
			nRank = i;
		}
	}
	return nRank;
}
function changeRank(rank, id) {
	var query = connection.query('UPDATE users SET rank = ? WHERE Id = ? AND rank < 25', [rank, id], function(error, result) {
		if (error) {
			throw error;
		}
	});
};
function a() {
	var query = connection.query('SELECT * FROM users ORDER BY gp ASC', [], function(error, result) {
		if (error) {
			throw error;
		} else {
			let userAllCount = result.length;
			for (let i = 0; i < userAllCount; i++) {
				let rank = result[i].rank;
				let gp = result[i].gp;
				let id = result[i].Id;
				if (gp > config.autorank.limiTop) {
					var query2 = connection.query('SELECT * FROM users where gp > '+config.autorank.limiTop+' ORDER BY gp DESC', [], function(error2, result2) {
						if (error2) {
							throw error2;
						} else {
							let jugadoresTopTotal = result2.length;
							if (jugadoresTopTotal > 21) {
								for (let ob = 0; ob < jugadoresTopTotal; ob++) {
									let Idx = result2[ob].Id;
									let NR_ = 21;
									if (ob == 0) {
										NR_ = 24;
									} else if (ob_ >= 1 && ob_ <= 4) {
										NR_ = 23;
									} else if (ob_ >= 5 && ob_ <= 21) {
										NR_ = 22;
									}
									changeRank(NR_, Idx);
								}
							} else {
								if (jugadoresTopTotal == 21) {
									for (let y = 0; y < jugadoresTopTotal; y++) {
										let id2 = result2[y].Id;
										let NRango = 0;
										if (y == 0) {
											NRango = 24;
										} else if (y >= 1 && y <= 4) {
											NRango = 23;
										} else {
											NRango = 22;
										}
										changeRank(NRango, id2);
									}
								} else if (jugadoresTopTotal >= 1 && jugadoresTopTotal <= 16) {
									for (let y2 = 0; y2 < jugadoresTopTotal; y2++) {
										changeRank(22, result2[y2].Id);
									}
								} else {
									for (let z = 0; z < jugadoresTopTotal; z++) {
										let NNRango = 22;
										if (z >= 0 && z <= (jugadoresTopTotal - 16)) {
											NNRango = 23;
										}
										changeRank(NNRango, result2[z].Id);
									};
								}
							}
						}
					});
				} else {
					let R = nRanking(gp);
					if (R != rank) {
						changeRank(R, id);
					}
				}
			}
		}
	})
	console.log('\x1b[42m', '[ACTUALIZADO] - Time => [' + new Date() + ']');
};
setInterval(a, config.autorank.time);