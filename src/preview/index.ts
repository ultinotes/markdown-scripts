// Gets executed on each preview reload / focus / rerender
// TODO: trigger when document is updated in split panel

console.log("abc");
console.log("cde");

const scripts = document.querySelectorAll<HTMLDivElement>(".mdscripts-src");
console.log("Scripts to be loaded: ", scripts);

scripts.forEach((script) => {
  const executableScript = document.createElement("script");
  const blob = new Blob([script.innerText], { type: "application/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  const scriptElement = document.createElement("script");
  scriptElement.src = blobUrl;
  document.body.appendChild(scriptElement);
  console.log("Appended: ", executableScript.innerText);

  eval(script.innerText);
  console.log("evaluated: ", script.innerText);
});
