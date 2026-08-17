// Shared signal so the Loader can hold its exit until the Hero videos have
// actually started playing, instead of just tracking page load. Module-level
// so it works regardless of which of Loader/Hero mounts or resolves first.
let resolveReady: () => void;

export const heroVideoReady = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

export function markHeroVideoReady() {
  resolveReady();
}
