const REGEX_XML = /^<div .*"resultaatcontainer">(.*)<\/div>$/s

const formulier = document.querySelector(".alineamaker")
const knoppen = formulier.querySelector(".knoppen")

const kopieerknop = knoppen.children[2]

kopieerknop.addEventListener("click", kopieerActie)

const xmlSerializer = new XMLSerializer()

function kopieerActie(event) {
    //Schakel de formulier-submit-actie uit.
    event.preventDefault()

    const container = document.querySelector("#resultaatcontainer")

    //Maak de container leeg.
    container.textContent = null

    for (const kind of formulier.children) {
        if (kind.classList.contains("alineas")) {
            plaatsAlineas(container, kind)
        }
    }

    const xmlMetNamespace = xmlSerializer.serializeToString(container)
    
    //xmlMetNamespace begint met `<div xmlns="http://www.w3.org/1999/xhtml" id="resultaatcontainer">`
    //en eindigt met `</div>`. Gebruik een regex om wat ertussen zit te verkrijgen.
    const regexResultaat = REGEX_XML.exec(xmlMetNamespace)

    const xml = regexResultaat ? regexResultaat[1] : ""

    navigator.clipboard.writeText(xml)

}

function plaatsAlineas(container, alineas) {
    const alineaTekst = alineas.querySelector("textarea").value

    for (const alinea of alineaTekst.split("\n\n")) {
        const p = document.createElement("p")
        p.append(alinea)
        container.appendChild(p)
    }
}