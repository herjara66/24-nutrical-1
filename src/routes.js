module.exports = (calculadoraNutriCalc) => {
  const ddbb = require("./ddbb");

  calculadoraNutriCalc.get("/", (req, res) => {
    // res.send("TODO hacer cositas")
    res.redirect("/login.html");
  });

  calculadoraNutriCalc.get("/pruebas-bbdd", (req, res) => {
    const usuario = Number(req.query.usuario);
    const medida = Number(req.query.medida);
    const nutrikalString = `${usuario}-${medida}`;

    console.log(usuario);
    console.log(medida);

    if (usuario == 1) {
      ddbb.consultarUsuarios();
    }

    if (medida == 1) {
      ddbb.consultarMedidas();
    }

    res.send(`--> ${nutrikalString} <--`);
  });

  calculadoraNutriCalc.post("/login", (req, res) => {
    const usuario = req.body.name;
    const password = req.body.password;

    console.log({ usuario, password });

    ddbb
      .consultaUsuarios(usuario, password)
      .then((usuario) => {
        console.log("jajaja");
        res.redirect("/calculadora-peso.html");
      })
      .catch((error) => {
        console.error(error, "error");
        res.send(error);
      });
  });

  calculadoraNutriCalc.post("/create", (req, res) => {
    const usuario = req.body.name;
    const password = req.body.password;

    ddbb
      .crearUsuarios(usuario, password)
      .then((usuario) => {
        console.log("jajaja");
        res.redirect("/login.html");
      })
      .catch((error) => {
        console.error(error, "error");
        res.send(error);
      });
  });
};
