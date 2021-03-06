$("document").ready(function () {
  let grafico = null;
  $("#poke-card").hide();
  $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=250",
    type: "GET",
    dataType: "JSON",
    success: function (pokemones) {
      const listado = pokemones.results;
      const listadoNombres = listado.map(function (el) {
        return el.name.toUpperCase();
      });

      listadoNombres.forEach(function (element) {
        $("#selectPoke").append(
          `<option value="${element}">${element}</option>`
        );
      });
    },
  });

  function mostrarHabilidades(habilidades) {
    return habilidades
      .map(function (ability, indice) {
        return `Habilidad ${indice + 1}: ${ability.ability.name}<br/>`;
      })
      .join("");
  }

  function mostrarAtributos(atributos) {
    return atributos
      .map(function (stat) {
        return `${stat.stat.name}: ${stat.base_stat}<br/>`;
      })
      .join("");
  }

  function obtenerValoresAtributos(atributos) {
    return atributos.map(function (stat) {
      return stat.base_stat;
    });
  }

  function obtenerEtiquetasAtributos(atributos) {
    return atributos.map(function (stat) {
      return stat.stat.name.toUpperCase();
    });
  }

  $("#selectPoke").on("change", function (v) {
    $("#poke-card").show();
    const selectedPoke = v.target.value;
    const selectedPokeNormalizado = selectedPoke.toLowerCase();
    if (selectedPoke) {
      $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${selectedPokeNormalizado}`,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
          const nombrePoke = data.name.toUpperCase();
          console.log(data);
          $("#nombrePok").text(nombrePoke);
          const spriteFront = data.sprites.front_default;
          $("#imgPokeFront").attr("src", spriteFront);
          const spriteBack = data.sprites.back_default;
          $("#imgPokeBack").attr("src", spriteBack);
          const info = `N° Pokedex: ${data.id}<br/>
          Tipo: ${data.types.map((type) => type.type.name).join(" / ")}<br/>
          Peso: ${data.weight / 10} kg<br/>
          ${mostrarHabilidades(data.abilities)}`;
          $("#infoPoke").html(info);
          $("#statsPoke").html(mostrarAtributos(data.stats));

          let context = document.getElementById("grafico");
          if (!grafico) {
            grafico = new Chart(context, {
              data: {
                datasets: [
                  {
                    data: [],
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.5)",
                      "rgba(54, 162, 235, 0.5)",
                      "rgba(255, 206, 86, 0.5)",
                      "rgba(75, 192, 192, 0.5)",
                      "rgba(153, 102, 255, 0.5)",
                      "rgba(255, 159, 64, 0.5)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
                labels: obtenerEtiquetasAtributos(data.stats),
              },
              type: "polarArea",
            });
          }

          grafico.data.datasets[0].data = obtenerValoresAtributos(data.stats);
          grafico.update();

          $('.perfil-pokemon').css({ width: '50px' }).animate({
            width: '300px',
          }, 1000)
        },
      });
    } else {
      $("#poke-card").hide();
    }
  });
});
