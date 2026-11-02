const formulier = document.querySelector(".alineamaker")
const knoppen = formulier.querySelector(".knoppen")

const kopieerknop = knoppen.children[2]

kopieerknop.addEventListener("click", kopieerActie)

function kopieerActie(event) {
    event.preventDefault()

    const container = document.querySelector("#resultaatcontainer")

    //Maak de container leeg.
    container.textContent = null;

    for (const kind of formulier.children) {
        if (kind.classList.contains("alineas")) {
            plaatsAlineas(container, kind)
        }
    }

}

function plaatsAlineas(container, alineas) {
    const alineaTekst = alineas.querySelector("textarea").value;

    console.log("waarde: " + alineaTekst)

    for (const alinea of alineaTekst.split("\n\n")) {
        const p = document.createElement("p")
        p.append(alinea)
        container.appendChild(p)
    }

}