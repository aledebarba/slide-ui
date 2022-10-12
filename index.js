const scrolling = {
    enabled: true,
    events: "scroll,wheel,touchmove,pointermove".split(","),
    prevent: e => e.preventDefault(),
    disable() {
      if (scrolling.enabled) {
        scrolling.enabled = false;
        window.addEventListener("scroll", gsap.ticker.tick, {passive: true});
        scrolling.events.forEach((e, i) => (i ? document : window).addEventListener(e, scrolling.prevent, {passive: false}));
      }
    },
    enable() {
      if (!scrolling.enabled) {
        scrolling.enabled = true;
        window.removeEventListener("scroll", gsap.ticker.tick);
        scrolling.events.forEach((e, i) => (i ? document : window).removeEventListener(e, scrolling.prevent));
      }
    }
  };

createSnappingSections()
renderDots();
ScrollTrigger.normalizeScroll(true);

function createSnappingSections(){
    const sections = document.querySelectorAll("[dot='true'");
    sections.forEach((section, i) => {
        const inAnim = gsap.from(section.querySelector(".row"), {scale: 0.8, duration: 2, paused: true});
        const outAnim = gsap.fromTo(section.querySelector(".row"), {scale: 0.8}, {scale: 1, duration: 2, paused: true});
        const starter = i === 0 ? "top+=2 top" : "top bottom-=1"; 
    
        ScrollTrigger.create({
        trigger: section,
        start: starter,
        end: "bottom top+=1",   
        // preventOverlaps: true, 
        markers: true,
        onEnter: () => { 
            const nextSection = i === 0 ? sections[i+1] : sections[i]
            goToSection(nextSection, inAnim)
        },
        onEnterBack: () => { 
            goToSection(section, outAnim ) 
        }
        });
    
    });
}



function goToSection(section, anim, i) {
    if (scrolling.enabled) { // skip if a scroll tween is in progress
      scrolling.disable();
      gsap.to(window, {
        scrollTo: {y: section, autoKill: false},
        onComplete: scrolling.enable(),
        duration: 1
      });
  
      anim && anim.restart();
    }
  }

/*
 * renderDots and attach scrolling to it
 */
function renderDots() {
    let dotsSections = document.querySelectorAll("[dot='true']");
    let dotsContainer = document.querySelector("#dots");
  
    dotsSections.forEach((section, index) => {
      let dot = document.createElement("div");
      dot.className = "dot";
      dotsContainer.appendChild(dot);
      dot.innerHTML = index + 1;
      dot.setAttribute("label", section.getAttribute("label") || "");
      const sectionRef = section.getBoundingClientRect();
      const yFactor = sectionRef.top;
  
      dot.addEventListener("click", () => {
          scrolling.disable()
          let timer = null;
          gsap.to(
            window, {
                scrollTo: yFactor,
                duration: 2,
            },
          )
          window.addEventListener('scroll', function() {
              if(timer !== null) {
                  clearTimeout(timer);        
              }
              timer = setTimeout(function() {
                  scrolling.enable()
              }, 150);
          }, false);
      });
   

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top-=15px",
        onEnter: ()=>{
            gsap.to( dot, {
                scale: 1.5,
                duration: 0.1
            })
        },
        onLeave: ()=>{
            gsap.to( dot, {
                scale: 1,
                duration: 0.1
            })
        },
        onEnterBack: ()=>{
            gsap.to(
                dot, {
                    scale: 1.5,
                    duration: 0.1
                }
            )
        },
        onLeaveBack: ()=>{
            gsap.to( dot, {
                scale: 1,
                duration: 0.1
            })
        },
    });

    });
  }