const DINOSAUR_NAMES = { "achillobator": { "type": "carnivores", "tier": 2 }, "acrocanthosaurus": { "type": "carnivores", "tier": 4 }, "albertaceratops": { "type": "herbivores", "tier": 2 }, "alioramus": { "type": "carnivores", "tier": 2 }, "allosaurus": { "type": "carnivores", "tier": 3 }, "amargasaurus": { "type": "herbivores", "tier": 3 }, "ampelosaurus": { "type": "herbivores", "tier": 4 }, "anodontosaurus": { "type": "herbivores", "tier": 3 }, "apatosaurus": { "type": "herbivores", "tier": 4 }, "argentinosaurus": { "type": "herbivores", "tier": 5 }, "barsboldia": { "type": "herbivores", "tier": 4 }, "camptosaurus": { "type": "herbivores", "tier": 1 }, "carnotaurus": { "type": "carnivores", "tier": 2 }, "ceratosaurus": { "type": "carnivores", "tier": 2 }, "citipati": { "type": "herbivores", "tier": 2 }, "compsognathus": { "type": "carnivores", "tier": 0 }, "concavenator": { "type": "carnivores", "tier": 2 }, "daspletosaurus": { "type": "carnivores", "tier": 3 }, "deinocheirus": { "type": "herbivores", "tier": 4 }, "deinonychus": { "type": "carnivores", "tier": 1 }, "deinosuchus": { "type": "carnivores", "tier": 4 }, "dilophosaurus": { "type": "carnivores", "tier": 2 }, "dimetrodon": { "type": "carnivores", "tier": 3 }, "dracoviper": { "type": "carnivores", "tier": 3 }, "dryosaurus": { "type": "herbivores", "tier": 0 }, "eotriceratops": { "type": "herbivores", "tier": 4 }, "eurhinosaurus": { "type": "carnivores", "tier": 2 }, "giganotosaurus": { "type": "carnivores", "tier": 4 }, "hatzegopteryx": { "type": "carnivores", "tier": 2 }, "iguanodon": { "type": "herbivores", "tier": 3 }, "kaiwhekea": { "type": "carnivores", "tier": 2 }, "kaprosuchus": { "type": "carnivores", "tier": 2 }, "kelenken": { "type": "carnivores", "tier": 2 }, "kentrosaurus": { "type": "herbivores", "tier": 2 }, "kryptops": { "type": "carnivores", "tier": 3 }, "lambeosaurus": { "type": "herbivores", "tier": 2 }, "latenivenatrix": { "type": "carnivores", "tier": 1 }, "maip": { "type": "carnivores", "tier": 3 }, "megalania": { "type": "carnivores", "tier": 2 }, "metriacanthosaurus": { "type": "carnivores", "tier": 2 }, "miragaia": { "type": "herbivores", "tier": 3 }, "moraquile": { "type": "carnivores", "tier": 4 }, "mosasaurus": { "type": "carnivores", "tier": 4 }, "nasutoceratops": { "type": "herbivores", "tier": 3 }, "noviana": { "type": "carnivores", "tier": 3 }, "nyctatyrannus": { "type": "carnivores", "tier": 3 }, "ocepechelon": { "type": "carnivores", "tier": 3 }, "ophis": { "type": "carnivores", "tier": 4 }, "pachycephalosaurus": { "type": "herbivores", "tier": 2 }, "parasaurolophus": { "type": "herbivores", "tier": 4 }, "psittacosaurus": { "type": "herbivores", "tier": 1 }, "pycnonemosaurus": { "type": "carnivores", "tier": 3 }, "quetzalcoatlus": { "type": "carnivores", "tier": 2 }, "rhamphorhynchus": { "type": "carnivores", "tier": 0 }, "sachicasaurus": { "type": "carnivores", "tier": 4 }, "sarcosuchus": { "type": "carnivores", "tier": 3 }, "smilodon": { "type": "carnivores", "tier": 2 }, "spinosaurus": { "type": "carnivores", "tier": 4 }, "stegosaurus": { "type": "herbivores", "tier": 3 }, "struthiomimus": { "type": "herbivores", "tier": 1 }, "styracosaurus": { "type": "herbivores", "tier": 2 }, "suchomimus": { "type": "carnivores", "tier": 3 }, "susecdurus": { "type": "carnivores", "tier": 3 }, "thalassodromeus": { "type": "carnivores", "tier": 1 }, "therizinosaurus": { "type": "herbivores", "tier": 3 }, "tyrannosaurus": { "type": "carnivores", "tier": 4 }, "utahraptor": { "type": "carnivores", "tier": 2 }, "yunnanosaurus": { "type": "herbivores", "tier": 3 }, "yutyrannus": { "type": "carnivores", "tier": 3 } };
const BLACKLISTED_PAGES = ["tags.html"];
const BASE_URL = "/isla-nycta-rules";

document$.subscribe(function () {

  if (BLACKLISTED_PAGES.some(page => document.location.pathname.includes(page))) return;

  const content = document.querySelector('.md-content');
  const dinosaurRegex = new RegExp('\\b(' + Object.keys(DINOSAUR_NAMES).join('|') + ')\\b(?![^<>]*>)', 'gi');

  content.innerHTML = content.innerHTML.replace(dinosaurRegex, (match) => {
    const name = match.toLowerCase();
    const tier = DINOSAUR_NAMES[match.toLowerCase()].tier;
    const type = DINOSAUR_NAMES[match.toLowerCase()].type;
    return `
      <span class="tier-wrapper">
        <span class="tier-name">
          <a href="${BASE_URL}/pot/${type}/${tier}/${name}.html">
            ${match}
          </a>
        </span>
        <span class="tier-badge tier-${tier}">
          ${tier}
        </span>
      </span>
    `;
  });
});
