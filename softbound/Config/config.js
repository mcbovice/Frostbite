var config = {
    game: {
      name: "SoftBound"
    },
    database:{
      host: "localhost",
      database: "softboundv1",
      user: "root",
      password: "Rawdog906!",
      port: 3306
    },
    autorank: {
      time: 5 * 60 * 1000,
      rank: [
        -1000000,
        1100,
        1200,
        1500,
        1800,
        2300,
        2800,
        3500,
        4200,
        5100,
        6000,
        6900,
        7539,
        8691,
        10102,
        11430,
        13024,
        15720,
        18102,
        22609,
        28475,
        37347,
		50010,
		65100,
		90520,
        150908],
        limiTop: 150906,
    }

  };
module.exports = config;