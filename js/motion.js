      (function () {
        if (typeof gsap === "undefined") return;
        gsap.registerPlugin(ScrollTrigger, SplitText);

        function capStagger(base, n) {
          return n > 1 ? Math.min(base, 0.5 / (n - 1)) : base;
        }

        function blurIn(targets, opts) {
          opts = opts || {};
          var y = opts.y !== undefined ? opts.y : 16;
          var blur = opts.blur !== undefined ? opts.blur : 10;
          gsap.fromTo(
            targets,
            { y: y, opacity: 0, filter: "blur(" + blur + "px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: opts.duration || 0.8,
              delay: opts.delay || 0,
              stagger: opts.stagger || 0.06,
              ease: "expo.out",
              clearProps: "filter",
            },
          );
        }

        function splitWords(el, opts) {
          if (!el) return;
          if (el.tagName === "P" && !el.hasAttribute("role")) {
            el.setAttribute("role", "group");
          }
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: function (self) {
              el.style.opacity = 1;
              blurIn(self.words, opts);
            },
          });
        }

        function splitLines(el, opts) {
          if (!el) return;
          if (el.tagName === "P" && !el.hasAttribute("role")) {
            el.setAttribute("role", "group");
          }
          SplitText.create(el, {
            type: "lines",
            autoSplit: true,
            onSplit: function (self) {
              el.style.opacity = 1;
              blurIn(self.lines, opts);
            },
          });
        }

        function runCounters() {
          document.querySelectorAll(".stat-num[data-count]").forEach(function (el) {
            var target = +el.dataset.count;
            var suffix = el.dataset.suffix || "";
            var obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1,
              ease: "power1.out",
              onUpdate: function () {
                el.textContent = Math.floor(obj.val) + suffix;
              },
              onComplete: function () {
                el.textContent = target + suffix;
              },
            });
          });
        }

        function revealCards(sectionSel, cardSel, opts) {
          opts = opts || {};
          var section = document.querySelector(sectionSel);
          var els = section ? section.querySelectorAll(cardSel) : null;
          if (!section || !els || !els.length) return;
          var stagger = capStagger(opts.stagger || 0.07, els.length);
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: function () {
              var blur = opts.blur !== undefined ? opts.blur : 6;
              gsap.fromTo(
                els,
                { y: opts.y !== undefined ? opts.y : 24, opacity: 0, filter: "blur(" + blur + "px)" },
                {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: opts.duration || 0.8,
                  delay: 0.3,
                  stagger: stagger,
                  ease: "expo.out",
                  clearProps: "filter",
                },
              );
            },
          });
        }

        function initHero() {
          gsap.fromTo(".hero-dotgrid", { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power1.out" });
          gsap.fromTo(".header-inner", { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });

          gsap.delayedCall(0.25, function () {
            splitWords(document.querySelector(".hero-h1"), { stagger: 0.06, duration: 0.9 });
          });
          gsap.delayedCall(0.55, function () {
            gsap.fromTo(
              ".hero-subtitle",
              { opacity: 0, filter: "blur(6px)" },
              { opacity: 1, filter: "blur(0px)", duration: 0.6, clearProps: "filter" },
            );
          });
          gsap.delayedCall(0.7, function () {
            splitLines(document.querySelector(".hero-line"), { y: 12, stagger: 0.08, duration: 0.7 });
          });
          gsap.delayedCall(0.9, function () {
            gsap.fromTo(
              ".hero-actions > *",
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
            );
          });
          gsap.delayedCall(1.1, function () {
            gsap.fromTo(".stats-card", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" });
            runCounters();
          });
        }

        function initReveals() {
          ["#about", "#tech", "#experience", "#projects", "#contact"].forEach(function (sel) {
            var section = document.querySelector(sel);
            if (!section) return;
            var eyebrow = section.querySelector(".eyebrow");
            var heading = section.querySelector("h2");
            var line = section.querySelector(".section-line, .about-lead, .contact-line");

            if (eyebrow) {
              ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: function () {
                  gsap.fromTo(eyebrow, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" });
                },
              });
            }
            if (heading) {
              ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: function () {
                  gsap.delayedCall(0.08, function () {
                    splitWords(heading, { stagger: 0.06, duration: 0.8 });
                  });
                },
              });
            }
            if (line) {
              ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: function () {
                  gsap.delayedCall(0.2, function () {
                    splitLines(line, { y: 12, stagger: 0.08, duration: 0.7 });
                  });
                },
              });
            }
          });

          revealCards("#about", ".info-card");
          revealCards("#tech", ".tech-tile", { y: 16, blur: 0, duration: 0.6, stagger: 0.04 });
          revealCards("#projects", ".proj-card");
          revealCards("#contact", ".contact-card");
        }

        function initTimeline() {
          var rail = document.querySelector(".timeline-rail-fill");
          var timelineEl = document.querySelector(".timeline");
          if (rail && timelineEl) {
            gsap.set(rail, { scaleY: 0 });
            gsap.to(rail, {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: timelineEl, start: "top 60%", end: "bottom 60%", scrub: true },
            });
          }

          document.querySelectorAll(".t-marker").forEach(function (marker) {
            ScrollTrigger.create({
              trigger: marker,
              start: "top 65%",
              end: "bottom 65%",
              onEnter: function () {
                marker.classList.add("reached");
              },
              onLeaveBack: function () {
                marker.classList.remove("reached");
              },
            });
          });

          var cards = document.querySelectorAll(".exp-card");
          if (cards.length) {
            ScrollTrigger.create({
              trigger: "#experience",
              start: "top 75%",
              once: true,
              onEnter: function () {
                gsap.fromTo(
                  cards,
                  { x: 24, opacity: 0, filter: "blur(6px)" },
                  {
                    x: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.7,
                    stagger: capStagger(0.1, cards.length),
                    ease: "expo.out",
                    clearProps: "filter",
                  },
                );
              },
            });
          }
        }

        function initReduced() {
          gsap.to(
            [".header-inner", ".hero-dotgrid", ".hero-h1", ".hero-subtitle", ".hero-line", ".hero-actions > *", ".stats-card"],
            { opacity: 1, duration: 0.2 },
          );
          document.querySelectorAll(".stat-num[data-count]").forEach(function (el) {
            el.textContent = (+el.dataset.count) + (el.dataset.suffix || "");
          });
          var rail = document.querySelector(".timeline-rail-fill");
          if (rail) gsap.set(rail, { scaleY: 1 });

          var targets = document.querySelectorAll(
            ".eyebrow, section h2, .section-line, .about-lead, .contact-line, .info-card, .tech-tile, .exp-card, .proj-card, .contact-card",
          );
          targets.forEach(function (el) {
            ScrollTrigger.create({
              trigger: el,
              start: "top 90%",
              once: true,
              onEnter: function () {
                gsap.to(el, { opacity: 1, duration: 0.2 });
              },
            });
          });
        }

        function initMagnetic() {
          document.querySelectorAll(".btn").forEach(function (btn) {
            function move(e) {
              var r = btn.getBoundingClientRect();
              var cx = r.left + r.width / 2;
              var cy = r.top + r.height / 2;
              var dx = e.clientX - cx;
              var dy = e.clientY - cy;
              var dist = Math.hypot(dx, dy);
              var range = Math.max(r.width, r.height) / 2 + 60;
              if (dist < range) {
                var x = Math.max(-10, Math.min(10, dx * 0.3));
                var y = Math.max(-10, Math.min(10, dy * 0.3));
                gsap.to(btn, { x: x, y: y, duration: 0.3, ease: "power2.out" });
              }
            }
            function leave() {
              gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
            }
            document.addEventListener("mousemove", move);
            btn.addEventListener("mouseleave", leave);
          });
        }

        function initCardHover() {
          document.querySelectorAll(".proj-card").forEach(function (card) {
            var state = { rx: 0, ry: 0, trx: 0, try_: 0 };
            var raf = null;
            function loop() {
              state.rx += (state.trx - state.rx) * 0.12;
              state.ry += (state.try_ - state.ry) * 0.12;
              card.style.transform =
                "perspective(900px) rotateX(" + state.rx.toFixed(2) + "deg) rotateY(" + state.ry.toFixed(2) + "deg)";
              if (Math.abs(state.trx - state.rx) > 0.01 || Math.abs(state.try_ - state.ry) > 0.01) {
                raf = requestAnimationFrame(loop);
              } else {
                raf = null;
              }
            }
            function start() {
              if (!raf) raf = requestAnimationFrame(loop);
            }
            card.addEventListener("pointermove", function (e) {
              var r = card.getBoundingClientRect();
              var px = (e.clientX - r.left) / r.width;
              var py = (e.clientY - r.top) / r.height;
              card.style.setProperty("--mx", px * 100 + "%");
              card.style.setProperty("--my", py * 100 + "%");
              state.trx = (0.5 - py) * 4;
              state.try_ = (px - 0.5) * 6;
              start();
            });
            card.addEventListener("pointerleave", function () {
              state.trx = 0;
              state.try_ = 0;
              start();
            });
          });
        }

        function initCursor() {
          var dot = document.createElement("div");
          dot.className = "cursor-dot";
          dot.setAttribute("aria-hidden", "true");
          var ring = document.createElement("div");
          ring.className = "cursor-ring";
          ring.setAttribute("aria-hidden", "true");
          document.body.appendChild(dot);
          document.body.appendChild(ring);
          document.documentElement.classList.add("has-cursor");

          document.querySelectorAll("a.proj-card").forEach(function (a) {
            var label =
              (a.querySelector(".store-pill") &&
                a.querySelector(".store-pill").textContent.trim()) ||
              (a.querySelector(".card-view") &&
                a.querySelector(".card-view").textContent.trim()) ||
              "View project";
            a.dataset.cursor = "view";
            a.dataset.cursorLabel = label;
          });

          var mx = 0,
            my = 0,
            rx = 0,
            ry = 0;
          document.addEventListener("mousemove", function (e) {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + "px";
            dot.style.top = my + "px";
            setCursorState(document.elementFromPoint(mx, my));
          });
          gsap.ticker.add(function () {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + "px";
            ring.style.top = ry + "px";
          });
          document.addEventListener("pointerdown", function () {
            gsap.to(ring, { scale: 0.85, duration: 0.15 });
          });
          document.addEventListener("pointerup", function () {
            gsap.to(ring, { scale: 1, duration: 0.15 });
          });
          document.addEventListener("mouseleave", function () {
            dot.classList.add("is-hidden");
            ring.classList.add("is-hidden");
          });
          document.addEventListener("mouseenter", function () {
            dot.classList.remove("is-hidden");
          });

          function setCursorState(el) {
            ring.className = "cursor-ring";
            dot.classList.remove("is-hidden");
            if (!el) return;
            var viewEl = el.closest('[data-cursor="view"]');
            var isField = el.matches("input, textarea");
            var isButton = el.closest(
              "button, .btn, .theme-toggle, .menu-toggle, .filter-btn",
            );
            var isLink = el.closest("a");
            if (isField) {
              dot.classList.add("is-hidden");
              ring.classList.add("is-hidden");
            } else if (viewEl) {
              ring.classList.add("is-pill");
              ring.textContent = viewEl.dataset.cursorLabel || "View project";
              dot.classList.add("is-hidden");
            } else if (isButton) {
              dot.classList.add("is-hidden");
              ring.classList.add("is-hidden");
            } else if (isLink) {
              ring.classList.add("is-link");
              dot.classList.add("is-hidden");
            }
          }
        }

        function initHeaderCollapse() {
          var header = document.getElementById("siteHeader");
          var hero = document.getElementById("hero");
          if (!header || !hero) return;
          var threshold = hero.offsetHeight * 0.6;
          var lastY = window.scrollY;
          window.addEventListener(
            "scroll",
            function () {
              var y = window.scrollY;
              header.classList.toggle("collapsed", y > threshold);
              if (y > lastY && y > 150) {
                header.classList.add("hide-on-scroll");
              } else {
                header.classList.remove("hide-on-scroll");
              }
              lastY = y;
            },
            { passive: true },
          );
        }

        function initHeroParallax() {
          var hero = document.getElementById("hero");
          var dotgrid = document.querySelector(".hero-dotgrid");
          if (!hero) return;
          gsap.to(".hero-h1, .hero-subtitle, .hero-line", {
            y: -80,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(".stats-card", {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          if (dotgrid) {
            gsap.to(dotgrid, {
              y: 120,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
            var tx = 50,
              ty = 40,
              cx = 50,
              cy = 40;
            hero.addEventListener("mousemove", function (e) {
              var r = hero.getBoundingClientRect();
              var px = ((e.clientX - r.left) / r.width) * 100;
              var py = ((e.clientY - r.top) / r.height) * 100;
              tx = 50 + (px - 50) * 0.4;
              ty = 40 + (py - 50) * 0.4;
            });
            gsap.ticker.add(function () {
              cx += (tx - cx) * 0.08;
              cy += (ty - cy) * 0.08;
              dotgrid.style.setProperty("--hx", cx + "%");
              dotgrid.style.setProperty("--hy", cy + "%");
            });
          }
        }

        var mm = gsap.matchMedia();
        mm.add(
          {
            full: "(pointer: fine) and (prefers-reduced-motion: no-preference)",
            touch: "(pointer: coarse) and (prefers-reduced-motion: no-preference)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          function (ctx) {
            var conditions = ctx.conditions;
            if (conditions.reduce) {
              initReduced();
              return;
            }

            var lenis = null;
            if (typeof Lenis !== "undefined") {
              lenis = new Lenis({ lerp: 0.1, syncTouch: false });
              lenis.on("scroll", ScrollTrigger.update);
              gsap.ticker.add(function (time) {
                lenis.raf(time * 1000);
              });
              gsap.ticker.lagSmoothing(0);

              document.querySelectorAll('a[href^="#"]').forEach(function (a) {
                a.addEventListener("click", function (e) {
                  var id = a.getAttribute("href").slice(1);
                  var target = id ? document.getElementById(id) : null;
                  if (!target) return;
                  e.preventDefault();
                  lenis.scrollTo(target, { offset: -96, duration: 1.2 });
                });
              });
            }

            initHero();
            initReveals();
            initTimeline();
            if (conditions.full) {
              initCursor();
              initMagnetic();
              initCardHover();
              initHeaderCollapse();
              initHeroParallax();
            }

            return function () {
              if (lenis) lenis.destroy();
            };
          },
        );

        document.fonts.ready.then(function () {
          ScrollTrigger.refresh();
        });
      })();
