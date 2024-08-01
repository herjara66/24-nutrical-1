const bcrypt = require("bcrypt");
const mysql = require("mysql");

// Genera el hash de la contraseña
function generarContrasena(contrasena) {
  const numSaltRounds = 10; // Número de rondas de sal (ajústalo según tus necesidades)
  bcrypt.hash(contrasena, numSaltRounds, (err, hash) => {
    if (err) {
      console.error("Error al generar el hash:", err);
    } else {
      console.log("Hash de la contraseña:", hash);
    }
  });
}

var conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "krono",
  database: "nutrikal",
});

conexion.connect(function (err) {
  if (err) {
    console.error("Error conectando a la base de datos:", err.stack);
    return;
  }
  console.log("Conectado a la base de datos");
});

function consultarUsuarios() {
  // Conectar a la base de datos
  const usuario = "SELECT * FROM usuario";
  conexion.query(usuario, function (err, result) {
    if (err) {
      throw err;
    }

    console.log(result);
  });
}

function consultarMedidas() {
  const medida = "SELECT * FROM medida";
  conexion.query(medida, function (err, result) {
    if (err) {
      throw err;
    }

    console.log(result);
  });
}

// INSERT INTO `nutrikal`.`medida` (`id_usuario`, `altura`, `peso`, `objetivo`) VALUES ('2', '180', '147', 'bajar');

async function consultaUsuarios(usuario, contrasena) {
  var sql = "SELECT * FROM usuario WHERE name = ? LIMIT 1";

  return new Promise((success, reject) => {
    const result = conexion.query(sql, [usuario], function (err, result) {
      if (err) {
        reject(err);
      }
      if (result.length) {
        const usuario = result[0];
        bcrypt.compare(
          contrasena,
          usuario.password,
          function (err, comparation) {
            if (comparation) {
              return success(usuario);
            } else {
              reject({ error: true, message: "contraseña invalida" });
            }
          }
        );
      } else {
        reject({ error: true, message: "el usuarion no existe" });
      }
    });
  });
}

function crearUsuarios(usuario, contrasena) {
  var sql = "SELECT * FROM usuario WHERE name = ? LIMIT 1";

  return new Promise((success, reject) => {
    const result = conexion.query(sql, [usuario], async function (err, result) {
      if (err) {
        reject(err);
      } else {
        if (result.length) {
          reject({ error: true, message: "el usuario ya existe" });
        } else {
          const numSaltRounds = 10; // Número de rondas de sal (ajústalo según tus necesidades)
          bcrypt.hash(contrasena, numSaltRounds, (err, password) => {
            if (err) {
              console.error("Error al generar el hash:", err);
            } else {
              success({ usuario, password });

              const sqlUsuario =
                "INSERT INTO usuario (name, password, salt, hash) VALUES (?, ?, '', '')";
              conexion.query(
                sqlUsuario,
                [usuario, password],
                function (err, result) {
                  if (err) {
                    reject(err);
                  } else {
                    success({ user: usuario, password: password });
                  }
                }
              );
            }
          });
        }
      }
    });
  });
}

module.exports = {
  consultaUsuarios,
  consultarUsuarios,
  consultarMedidas,
  crearUsuarios,
};
