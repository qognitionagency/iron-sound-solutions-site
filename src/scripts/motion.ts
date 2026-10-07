/**
 * The only GSAP / Lenis entry (ADR §7). Everything sits inside gsap.matchMedia(),
 * so reduced motion gets no Lenis, parallax, pin, split text or scrub, and every
 * initial animation state is set here by JS (content ships visible without it).
 *
 * Hooks (data attributes, set in the section components):
 *   data-split          display line: masked line reveal (desktop), fade-up (mobile)
 *   data-reveal         block fades up once on enter; data-reveal-stagger on a parent staggers its [data-reveal] children
 *   data-parallax="n"   yPercent travel, clamped to 15 desktop / 5 mobile
 *   data-hscroll        pinned horizontal track (desktop only; the one pin)
 *   data-scene          dispatches `scene:progress` {progress 0..1} for the Day→Dusk room
 *   data-magnetic       CTA follows the pointer slightly (fine pointer only)
 *   data-glow           sets --mx/--my for a cursor-follow dusk glow (fine pointer only)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const navOffset = () => -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) * 16 || 72) - 16;

/** Move focus to an in-page target after a scroll, so keyboard and screen reader users land where they went. */
function focusTarget(el: HTMLElement) {
  // form.ts already focused the current step heading for links into the form.
  if (el.contains(document.activeElement) && document.activeElement !== document.body) return;
  const t = el.querySelector<HTMLElement>('[data-focus-target]') ?? el;
  if (!t.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute('tabindex', '-1');
  t.focus({ preventScroll: true });
}

let lenis: Lenis | null = null;

/** Already on screen when motion arrives (it loads after `load`): leave it alone, never flash it out. */
const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92;

// In-page anchors: smooth with Lenis when it exists, native otherwise. Focus follows.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a || a.hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  history.pushState(null, '', a.hash);
  if (lenis) {
    lenis.scrollTo(target, { offset: navOffset(), duration: 1.2, onComplete: () => focusTarget(target) });
  } else {
    target.scrollIntoView({ block: 'start' });
    focusTarget(target);
  }
});

const mm = gsap.matchMedia();

mm.add(
  {
    desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
    fine: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  },
  (ctx) => {
    const { desktop, mobile, reduce, fine } = ctx.conditions as Record<string, boolean>;
    const cleanups: (() => void)[] = [];

    if (reduce) {
      // Scene still responds to the toggle; scroll does not drive it.
      return;
    }

    // ── Lenis smooth scroll ───────────────────────────────────────────
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    });

    // ── Split-text display lines ──────────────────────────────────────
    for (const el of $$('[data-split]')) {
      if (onScreen(el)) continue;
      if (desktop) {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      } else {
        gsap.from(el, { y: 24, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      }
    }

    // ── Block reveals ─────────────────────────────────────────────────
    const lone = $$('[data-reveal]').filter((el) => !el.parentElement?.closest('[data-reveal-stagger]') && !onScreen(el));
    ScrollTrigger.batch(lone, {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true }),
    });
    for (const group of $$('[data-reveal-stagger]')) {
      const kids = $$('[data-reveal]', group).filter((k) => !onScreen(k));
      if (!kids.length) continue;
      gsap.from(kids, { y: 32, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
    }

    // ── Parallax ──────────────────────────────────────────────────────
    for (const el of $$('[data-parallax]')) {
      const raw = Number(el.dataset.parallax) || 8;
      const amt = Math.sign(raw) * Math.min(Math.abs(raw), mobile ? 5 : 15);
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // ── The one pin: horizontal process track (desktop) ───────────────
    if (desktop) {
      for (const sec of $$('[data-hscroll]')) {
        const track = sec.querySelector<HTMLElement>('[data-hscroll-track]');
        if (!track) continue;
        // The pinned layout (a single max-content row) must exist before measuring.
        sec.classList.add('is-pinned');
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        if (distance() < 40) {
          sec.classList.remove('is-pinned');
          continue;
        }
        const progress = sec.querySelector<HTMLElement>('[data-hscroll-progress]');
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (st) => progress?.style.setProperty('--p', st.progress.toFixed(3)),
          },
        });
        cleanups.push(() => sec.classList.remove('is-pinned'));
      }
    }

    // ── Day → Dusk scene progress (scroll-driven; the toggle overrides) ─
    for (const scene of $$('[data-scene]')) {
      ScrollTrigger.create({
        trigger: scene,
        start: 'top 65%',
        end: 'center 35%',
        onUpdate: (st) => scene.dispatchEvent(new CustomEvent('scene:progress', { detail: { progress: st.progress } })),
      });
    }

    // ── Pointer effects ───────────────────────────────────────────────
    if (fine) {
      for (const el of $$('[data-magnetic]')) {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
          gsap.set(el, { x: 0, y: 0 });
        });
      }
      for (const el of $$('[data-glow]')) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - r.left}px`);
          el.style.setProperty('--my', `${e.clientY - r.top}px`);
        };
        el.addEventListener('pointermove', move);
        el.classList.add('has-glow');
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.classList.remove('has-glow');
        });
      }
    }

    // Images and fonts change heights after first paint; re-measure once settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);

    return () => cleanups.forEach((fn) => fn());
  },
);
