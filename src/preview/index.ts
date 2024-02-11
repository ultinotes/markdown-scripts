// Gets executed on each preview reload / focus / rerender
// TODO: trigger when document is updated in split panel

console.log("abc");
console.log("cde");

const scripts = document.querySelectorAll<HTMLDivElement>(".js-exec");

scripts.forEach((script) => {
  const executableScript = document.createElement("script");
  executableScript.innerText = script.innerText;
  executableScript.setAttribute("unsafe-inline", "");

  document.body.appendChild(script);
});
