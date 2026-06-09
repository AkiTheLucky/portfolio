
// index.js

/**

 * index.js

 * ---------------------------------------------------------

 * Owns all runtime behavior for the homepage.

 * No inline JS. No side effects without intent.

 */

(function () {

  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {

  initHeroFlowField();

  initProjectModals();

  }

  function initHeroFlowField() {

    const canvas = document.getElementById("hero-flow");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(

      "(prefers-reduced-motion: reduce)"

    ).matches;

    if (prefersReducedMotion) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;

    let height = 0;

    let time = 0;

    let animationFrameId;

    /*

      Changed:

      Reduced particle count slightly because we are now drawing lines,

      not just tiny dots. Lines make the flow field much more visible.

    */

    const PARTICLE_COUNT = 100;

    const particles = [];

    /*

      Changed:

      These colors are intentionally stronger.

      Canvas does not inherit these from CSS.

      If you want to change the animation colors, change them here.

    */

    const COLORS = [

      "#00a6d6", // bright cyan

      "#ff6b6b", // coral

      "#2ec4b6", // teal

      "#6c63ff"  // soft violet

    ];

    /*

      Changed:

      The previous fade color matched the page background and made

      the trails disappear too quickly.

      Lower alpha = longer trails.

      Higher alpha = faster fade.

      This is still based on your beige background.

    */

    const FADE_COLOR = "rgba(247, 244, 239, 0.045)";

    function createParticle(index) {

      return {

        x: Math.random() * width,

        y: Math.random() * height,

        /*

          Added:

          Previous position lets us draw a small line segment.

          This makes motion visible instead of relying on tiny dots.

        */

        previousX: Math.random() * width,

        previousY: Math.random() * height,

        life: Math.random() * 0.8 + 0.2,

        color: COLORS[index % COLORS.length]

      };

    }

    function resetParticle(p) {

      p.x = Math.random() * width;

      p.y = Math.random() * height;

      p.previousX = p.x;

      p.previousY = p.y;

      p.life = Math.random() * 0.8 + 0.2;

    }

    function resize() {

      const parent = canvas.parentElement;

      if (!parent) return;

      width = parent.clientWidth;

      height = parent.clientHeight;

      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);

      canvas.height = Math.floor(height * dpr);

      canvas.style.width = width + "px";

      canvas.style.height = height + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /*

        Changed:

        Paint the canvas with the real background color once after resize.

        This prevents the canvas from starting transparent.

      */

      ctx.fillStyle = "#f7f4ef";

      ctx.fillRect(0, 0, width, height);

      if (particles.length === 0) {

        for (let i = 0; i < PARTICLE_COUNT; i++) {

          particles.push(createParticle(i));

        }

      } else {

        /*

          Added:

          If the screen is resized, reset particles so they do not all

          remain outside the new canvas bounds.

        */

        for (const p of particles) {

          resetParticle(p);

        }

      }

    }

    window.addEventListener("resize", resize);

    resize();

    function animate() {

      animationFrameId = requestAnimationFrame(animate);

      if (width === 0 || height === 0) return;

      /*

        Fade previous frame.

        This creates smooth trails.

      */

      ctx.fillStyle = FADE_COLOR;

      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {

        p.previousX = p.x;

        p.previousY = p.y;

/*

  Changed:

  Replaced the noise-only direction with a spiral vector field.

  Why:

  The previous animation sampled pseudo-random smooth noise,

  which created snake-like motion in many directions.

  This version makes each particle move around the center of the hero,

  creating a controlled spiral.

*/

const centerX = width * 0.5;

const centerY = height * 0.5;

const dx = 2 * p.x - centerX;

const dy = 2 * p.y - centerY;

const distance = Math.sqrt(dx * dx + dy * dy) || 1;

/*

  Base angle from the center to the particle.

*/

const angleFromCenter = Math.atan2(dy, dx);

            /*

            Spiral direction.

            + Math.PI / 2 makes the motion tangential,

            meaning particles orbit around the center.

            The distance term adds spiral curvature instead of a perfect circle.

            */

            const spiralAngle =

            angleFromCenter +

            Math.PI / 2 +

            distance * 0.006;

            /*

            Speed can still vary slightly so the animation feels organic,

            but it is now controlled by the spiral instead of random flow.

            */

            const speed =

            8 ;

            /*

            Radial pull.

            Negative value = inward spiral.

            Positive value = outward spiral.

            Try:

                -0.25 for inward spiral

                0.15 for outward spiral

                0 for circular orbit

            */

            const radialPull = 5;

            const radialX = dx / distance;

            const radialY = dy / distance;

            p.x += Math.cos(spiralAngle) * speed + radialX * radialPull ;

            p.y += Math.sin(spiralAngle) * speed + radialY * radialPull ;

            p.life -= 0.0015;

        if (

          p.life <= 0 ||

          p.x < -20 ||

          p.x > width + 20 ||

          p.y < -20 ||

          p.y > height + 20

        ) {

          resetParticle(p);

          continue;

        }

        /*

          Changed:

          Drawing a line instead of only a dot makes the flow field visible.

        */

        ctx.beginPath();

        ctx.moveTo(p.previousX, p.previousY);

        ctx.lineTo(p.x, p.y);

        /*

          Changed:

          Stronger alpha than before.

          Old value was effectively too low after CSS opacity/filter.

        */

        ctx.globalAlpha = p.life * 0.75;

        ctx.strokeStyle = p.color;

        ctx.lineWidth = 4;

        ctx.lineCap = "round";

        ctx.stroke();

      }

      ctx.globalAlpha = 1;

      time++;

    }

    animate();

    /*

      Optional cleanup if you later turn this into a single-page app.

      Not necessary for a static page, but safe.

    */

    window.addEventListener("beforeunload", function () {

      cancelAnimationFrame(animationFrameId);

    });

  }

function initProjectModals() {
  const shells = document.querySelectorAll('.project-shell');

  shells.forEach(shell => {
    const cardBtn = shell.querySelector('.project-card');
    const modal = shell.querySelector('.project-modal');
    const closeBtn = shell.querySelector('.close-modal-btn');

    // Open modal when card is clicked
    cardBtn.addEventListener('click', () => {
      modal.showModal();
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', () => {
      modal.close();
      document.body.style.overflow = ''; // Restore scrolling
    });

    // Optional: Close when clicking the backdrop outside the modal
    modal.addEventListener('click', (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
        document.body.style.overflow = '';
      }
    });
  });
}

})();

