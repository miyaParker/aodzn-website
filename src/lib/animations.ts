import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates character-by-character split reveal animation for headings
 */
export function animateSplitText(
  element: HTMLElement | null,
  options?: {
    stagger?: number;
    delay?: number;
    duration?: number;
    scrollTrigger?: boolean | object;
  }
) {
  if (!element) return;

  const text = element.innerText;
  // If not already split
  if (!element.querySelector('.char-span')) {
    element.innerHTML = text
      .split('')
      .map((char) => {
        if (char === ' ') return '&nbsp;';
        return `<span class="char-span inline-block overflow-hidden"><span class="char-inner inline-block transform translate-y-full">${char}</span></span>`;
      })
      .join('');
  }

  const innerChars = element.querySelectorAll('.char-inner');

  const config: gsap.TweenVars = {
    y: '0%',
    rotation: 0,
    duration: options?.duration || 1.1,
    ease: 'back.out(1.4)',
    stagger: options?.stagger || 0.025,
    delay: options?.delay || 0,
  };

  if (options?.scrollTrigger) {
    config.scrollTrigger =
      typeof options.scrollTrigger === 'object'
        ? options.scrollTrigger
        : {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          };
  }

  return gsap.to(innerChars, config);
}

/**
 * Applies magnetic effect on button hover
 */
export function applyMagneticEffect(element: HTMLElement) {
  if (!element) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Creates ripple effect on element click
 */
export function createRipple(e: React.MouseEvent<HTMLElement>) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const circle = document.createElement('span');
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}
