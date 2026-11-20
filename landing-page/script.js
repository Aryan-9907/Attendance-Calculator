/* ============ DOWNLOAD CONFIGURATION ============ */
var CFG = {
  user: "Aryan-9907", // GitHub repository owner
  repo: "Attendance-Calculator", // GitHub repository name
  apk: "attendance-calculator-app.apk", // Exact APK name in the v1.0.0 release
  tag: "v1.0.0", // Release containing the direct APK download
};
/* ==================================================== */

(function () {
  "use strict";
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Direct APK download links ---------- */
  var base = "https://github.com/" + CFG.user + "/" + CFG.repo;
  var apkUrl =
    base + "/releases/download/" + CFG.tag + "/" + encodeURIComponent(CFG.apk);

  // Set each download button to open the exact release APK asset.
  $$("[data-dl]").forEach(function (a) {
    a.href = apkUrl;
    a.setAttribute("download", CFG.apk);
    a.setAttribute("rel", "noopener");
  });
  $$("[data-gh]").forEach(function (a) {
    a.href = base;
  });

  $("#yr").textContent = new Date().getFullYear();

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  $$(".rv").forEach(function (el) {
    io.observe(el);
  });

  /* ---------- Pause infinite animations that are off-screen ---------- */
  var pz = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        e.target.classList.toggle("paused", !e.isIntersecting);
      });
    },
    { rootMargin: "60px" },
  );
  $$(".grad,.marq,.logo-wrap,.float,.halo,.fl,.rot,.btn").forEach(
    function (el) {
      pz.observe(el);
    },
  );

  /* ---------- Feature extras ---------- */
  var dots = $(".dots"),
    frag = document.createDocumentFragment();
  for (var i = 0; i < 16; i++) {
    var s = document.createElement("s");
    s.style.setProperty("--i", i);
    frag.appendChild(s);
  }
  dots.appendChild(frag);
  var mq = $(".marq div");
  mq.innerHTML += mq.innerHTML;

  /* ---------- Lighter on weaker phones (same look, fewer particles) ---------- */
  var lite =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  document.documentElement.classList.toggle("lite", !!lite);
  if (!reduce) {
    var P = $("#particles"),
      pf = document.createDocumentFragment(),
      n = lite ? 6 : 10;
    for (var k = 0; k < n; k++) {
      var p = document.createElement("span"),
        z = 2 + Math.random() * 3;
      p.className = "pt";
      p.style.cssText =
        "left:" +
        Math.random() * 100 +
        "%;width:" +
        z +
        "px;height:" +
        z +
        "px;animation-duration:" +
        (14 + Math.random() * 16) +
        "s;animation-delay:-" +
        Math.random() * 20 +
        "s;--x:" +
        (Math.random() * 80 - 40) +
        "px";
      pf.appendChild(p);
    }
    P.appendChild(pf);
  }

  /* ---------- Pointer effects (desktop only, throttled to 1 write per frame) ---------- */
  if (matchMedia("(hover:hover)").matches) {
    var stage = $(".stage"),
      tilt = $("#heroTilt"),
      sr,
      sq = 0,
      sx = 0,
      sy = 0;
    if (!reduce) {
      stage.addEventListener("pointerenter", function () {
        sr = stage.getBoundingClientRect();
      });
      stage.addEventListener("pointermove", function (e) {
        if (!sr) sr = stage.getBoundingClientRect();
        sx = (e.clientX - sr.left) / sr.width;
        sy = (e.clientY - sr.top) / sr.height;
        if (!sq)
          sq = requestAnimationFrame(function () {
            sq = 0;
            tilt.style.setProperty("--ry", (sx - 0.5) * 14 + "deg");
            tilt.style.setProperty("--rx", (0.5 - sy) * 10 + "deg");
          });
      });
      stage.addEventListener("pointerleave", function () {
        tilt.style.setProperty("--ry", "0deg");
        tilt.style.setProperty("--rx", "0deg");
      });
    }
    $$(".card").forEach(function (c) {
      var r,
        q = 0,
        x = 0,
        y = 0;
      c.addEventListener("pointerenter", function () {
        r = c.getBoundingClientRect();
      });
      c.addEventListener("pointermove", function (e) {
        if (!r) r = c.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        if (!q)
          q = requestAnimationFrame(function () {
            q = 0;
            c.style.setProperty("--mx", x + "px");
            c.style.setProperty("--my", y + "px");
          });
      });
    });
  }

  /* ---------- One shared count-up loop (instead of one loop per number) ---------- */
  var act = [],
    raf = 0;
  function loop(now) {
    for (var i = act.length - 1; i >= 0; i--) {
      var o = act[i],
        k = o.d ? Math.max(0, Math.min(1, (now - o.t0) / o.d)) : 1,
        v = o.f + (o.to - o.f) * (1 - Math.pow(1 - k, 3)),
        el = o.el,
        txt = o.dec ? v.toFixed(1).replace(/\.0$/, "") : "" + Math.round(v);
      el._v = v;
      if (el._t !== txt) {
        el.textContent = txt;
        el._t = txt;
      }
      if (k >= 1) {
        el._v = o.to;
        act.splice(i, 1);
        el._o = null;
      }
    }
    raf = act.length ? requestAnimationFrame(loop) : 0;
  }
  function tween(el, to, dec) {
    if (el._o) act.splice(act.indexOf(el._o), 1);
    var from = el._v || 0;
    el._o = {
      el: el,
      f: from,
      to: to,
      dec: dec,
      t0: performance.now(),
      d: reduce ? 0 : Math.min(900, 300 + Math.abs(to - from) * 8),
    };
    act.push(el._o);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function setText(el, t) {
    if (el._t !== t) {
      el.textContent = t;
      el._t = t;
    }
  }

  /* ---------- Phone mockup (same maths as the app) ---------- */
  var MS = [75, 80, 85, 90];
  function phone(root) {
    root.innerHTML =
      '<div class="phone"><div class="scr"><div class="ph-t">Attendance Calculator</div>' +
      '<div class="ph-in"><div><b class="a">0</b><small>attended</small></div><em>of</em><div><b class="t">0</b><small>total</small></div></div>' +
      '<div class="ph-ring"><svg viewBox="0 0 108 108"><circle class="tr" cx="54" cy="54" r="46"/><circle class="fg" cx="54" cy="54" r="46"/></svg><span class="p">0</span></div>' +
      '<div class="ph-v"><span class="vl"></span> <b class="vn">0</b> <span class="vu"></span></div><div class="ph-rows">' +
      MS.map(function (m) {
        return '<div class="r"><i>' + m + "%</i><span></span><b>0</b></div>";
      }).join("") +
      "</div></div></div>";
    var ph = $(".phone", root),
      fg = $(".fg", root),
      rows = $$(".r", root),
      A = $(".a", root),
      T = $(".t", root),
      Pc = $(".p", root),
      VL = $(".vl", root),
      VU = $(".vu", root),
      VN = $(".vn", root);
    return function show(a, t) {
      var p = (a / t) * 100,
        ok = p >= 75;
      ph.style.setProperty(
        "--c",
        ok ? "var(--g)" : p >= 65 ? "var(--warn)" : "var(--bad)",
      );
      fg.style.strokeDashoffset = 289 * (1 - p / 100);
      tween(A, a);
      tween(T, t);
      tween(Pc, p, 1);
      var n = ok
        ? Math.max(0, Math.floor((a * 100) / 75 - t + 1e-9))
        : Math.ceil((75 * t - 100 * a) / 25 - 1e-9);
      setText(VL, ok ? "You can skip" : "Attend the next");
      setText(VU, ok ? "classes" : "classes to hit 75%");
      tween(VN, n);
      rows.forEach(function (r, i) {
        var m = MS[i],
          good = p >= m,
          c = good
            ? Math.max(0, Math.floor((a * 100) / m - t + 1e-9))
            : Math.ceil((m * t - 100 * a) / (100 - m) - 1e-9),
          cls = "r " + (good ? "skip" : "need");
        if (r.className !== cls) r.className = cls;
        setText($("span", r), good ? "Can skip" : "Need to attend");
        tween($("b", r), c);
      });
    };
  }

  // Hero phone: cycles scenarios, but only while it is on screen
  var heroShow = phone($("#heroPhone")),
    SC = [
      [34, 50],
      [42, 50],
      [27, 40],
      [58, 60],
    ],
    si = 0,
    timer = 0,
    heroVis = false,
    started = false;
  function cycle() {
    heroShow(SC[si][0], SC[si][1]);
    si = (si + 1) % SC.length;
  }
  function sync() {
    clearInterval(timer);
    timer = 0;
    if (heroVis && !document.hidden && !reduce)
      timer = setInterval(cycle, 3800);
  }
  new IntersectionObserver(function (es) {
    heroVis = es[0].isIntersecting;
    if (heroVis && !started) {
      started = true;
      setTimeout(cycle, 500);
    }
    sync();
  }).observe($("#heroPhone"));
  document.addEventListener("visibilitychange", sync);

  // Screens: each phone animates in when scrolled into view
  var SH = [
    [31, 48],
    [66, 75],
    [92, 100],
  ];
  $$(".shot").forEach(function (el, i) {
    var show = phone(el);
    var o = new IntersectionObserver(
      function (es) {
        if (es[0].isIntersecting) {
          setTimeout(
            function () {
              show(SH[i][0], SH[i][1]);
            },
            250 + i * 150,
          );
          o.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    o.observe(el);
  });
})();
