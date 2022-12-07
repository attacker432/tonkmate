let snowAmount = 1;
let aeff = 1;
let cool = 0;
let counter = 0;
let counter2 = 0;
if (snowAmount) {
  let snowCanvas = document.createElement("canvas");
  snowCanvas.style.position = "absolute";
  snowCanvas.style.top = "0";
  document.body.insertBefore(snowCanvas, document.body.firstChild);

  let ctx = snowCanvas.getContext("2d");
  let snow = [];
  let updateSnow = () => {
    if (snowCanvas.width !== window.innerWidth)
      snowCanvas.width = window.innerWidth;
    if (snowCanvas.height !== window.innerHeight)
      snowCanvas.height = window.innerHeight;
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    for (let p of snow) {
      p.vel2++;
      p.x += p.vel * Math.cos(p.dir);
      p.y += p.vel * Math.sin(p.dir);
      let a = Math.min(1, 1 - p.y / snowCanvas.height) * 2;
      if (a > 0) {
        ctx.globalAlpha = a;
        let s = p.type
        ctx.beginPath();
        ctx.arc(p.x + (-2) * p.vel * Math.cos(p.dir), p.y + (-2) * p.vel * Math.sin(p.dir), p.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = p.r / 5;
        ctx.fill();
      } else if (
        p.x < 20 ||
        p.x > window.innerWidth + 20 ||
        p.y < -25 ||
        a < 0 ||
        global.gameStart
      ) {
        p.gone = true;
      }
    }
    if (snowAmount > Math.random()) {
      if (!global.gameStart) {
        let aeef = -1;
        let aee = snowCanvas.width * (1 - 2 * Math.random());
        if (counter % 43) counter2++;
        counter++;
        cool += aeff;
        if (counter % 1440 == 0) aeff *= -1;
        if (counter % 1 == 0 && Math.random() > 0.9) {
          for (let i = 0; i < 360; i += 360 / 1) {
            let x = snowCanvas.width / 2 + aee;
            let r = 5 + Math.floor(Math.random() * 10);
            let dir =
              Math.PI / 2 +
              (10 * (1 - 2 * Math.random()) * Math.PI) / 180 +
              (30 * Math.sin((0.3 * counter * Math.PI) / 180) * Math.PI) / 180;
            let vel = 5 + 7 * Math.random();
            let color = "#2C03FF";
            snow.push({
              x,
              y: aeef,
              r,
              dir,
              vel,
              color
            });
          }
        }
      }
    }
    if (global.gameStart) snowCanvas.remove();
    else requestAnimationFrame(updateSnow);
  };
  setInterval(() => {
    snow = snow.filter(r => !r.gone);
  }, 2000);
  updateSnow();
}
