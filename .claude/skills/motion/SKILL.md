---
name: motion
description: Animations and motion design for Habitta. CSS-only animations for Astro pages, Motion library (formerly Framer Motion) for React Islands in website, and subtle transitions for the Next.js dashboard. Use when adding entrance animations, hover effects, scroll-triggered reveals, page transitions, or micro-interactions.
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# Motion & Animaciones — Habitta

Guía de animaciones para el monorepo Habitta. Principio clave: **CSS-first para Astro, Motion library para React Islands**.

---

## Reglas por contexto

| Contexto                      | Herramienta            | Razón                            |
| ----------------------------- | ---------------------- | -------------------------------- |
| Páginas `.astro` (website)    | CSS `@keyframes`       | Cero JS, máximo rendimiento, SEO |
| React Islands (`client:load`) | Motion (Framer)        | Animaciones complejas con estado |
| Dashboard Next.js             | Tailwind + CSS         | Sutileza sobre espectáculo       |
| Transiciones de ruta          | Astro View Transitions | Nativo, sin JS extra             |

---

## CSS Animations (Astro — preferido)

### Patrones base del proyecto

```css
/* Fade + slide up — entrance estándar Habitta */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade simple */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scroll indicator */
@keyframes scrollDown {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(350%);
    opacity: 0;
  }
}

/* Float — para elementos de fondo (orbes, blobs) */
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(20px, -30px) scale(1.04);
  }
  66% {
    transform: translate(-15px, 20px) scale(0.97);
  }
}
```

### Staggered entrance (varias líneas)

```css
/* Patrón usado en Hero.astro */
.element {
  opacity: 0;
  animation: fadeUp 0.9s ease forwards;
}
.element:nth-child(1) {
  animation-delay: 0.1s;
}
.element:nth-child(2) {
  animation-delay: 0.25s;
}
.element:nth-child(3) {
  animation-delay: 0.4s;
}
.element:nth-child(4) {
  animation-delay: 0.55s;
}
```

### Hover transitions (CSS puro)

```css
/* CTA button fill — slide in desde izquierda */
.button {
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
}
.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #f5f0ea;
  transform: translateX(-101%);
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.18, 1);
}
.button:hover::before {
  transform: translateX(0);
}

/* Arrow slide on hover */
.arrow {
  transition: transform 0.3s ease;
}
.button:hover .arrow {
  transform: translateX(4px);
}
```

### Scroll-triggered (Intersection Observer)

```astro
---
// ScrollReveal.astro
---

<div class="reveal">
  <slot />
</div>

<style>
  .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition:
      opacity 0.7s ease,
      transform 0.7s ease;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

---

## Astro View Transitions (transiciones de ruta)

```astro
---
// layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>
```

Nombres de transición para elementos persistentes:

```astro
<!-- En la página de listado -->
<img src={img} transition:name={`project-${slug}-img`} />

<!-- En la página de detalle — Astro lo anima automáticamente -->
<img src={img} transition:name={`project-${slug}-img`} />
```

```astro
<!-- Fade personalizado -->
<div transition:animate="fade">...</div>

<!-- Slide -->
<div transition:animate="slide">...</div>

<!-- Custom keyframe -->
<div transition:animate={{ duration: '0.4s', easing: 'ease-out' }}>...</div>
```

---

## Motion Library (React Islands)

Instalar en `apps/website` (solo si hay Islands complejas):

```bash
pnpm --filter website add motion
```

### Patrón básico — entrance

```tsx
// components/ProjectCard.tsx
'use client'; // Solo en dashboard Next.js
import { motion } from 'motion/react';

const ProjectCard = ({ project }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* contenido */}
  </motion.div>
);
```

### Stagger desde el padre

```tsx
import { motion } from 'motion/react';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ProjectGrid = ({ projects }: Props) => (
  <motion.ul variants={container} initial="hidden" animate="show">
    {projects.map((p) => (
      <motion.li key={p.id} variants={item}>
        <ProjectCard project={p} />
      </motion.li>
    ))}
  </motion.ul>
);
```

### Scroll-triggered con Motion

```tsx
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
```

### Hover con Motion (cards de proyecto)

```tsx
<motion.article
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  {/* ProjectCard */}
</motion.article>
```

---

## Tailwind Animations (dashboard)

El dashboard prioriza sutileza. Usar clases de Tailwind:

```tsx
// Fade in
<div className="animate-in fade-in duration-300">...</div>

// Slide up
<div className="animate-in slide-in-from-bottom-4 duration-300">...</div>

// Hover en cards
<div className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
  ...
</div>

// Loading skeleton
<div className="animate-pulse bg-gray-100 rounded h-6 w-full" />
```

---

## Paleta de easing — Habitta

```css
/* Suave y natural */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Snappy — para hovers */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Elegante — para transiciones largas */
--ease-elegant: cubic-bezier(0.77, 0, 0.18, 1);

/* Standard CSS */
ease-in-out  /* Para elementos que entran y salen */
ease-out     /* Para elementos que entran */
ease-in      /* Para elementos que salen */
```

---

## Principios de animación Habitta

1. **Duración** — 200–400ms para hovers, 500–900ms para entrances de página
2. **Stagger** — 100–150ms entre elementos de una lista
3. **Opacidad + transform** — siempre animar juntos (evitar layout reflow)
4. **`will-change: transform`** — solo en animaciones frecuentes (ej: parallax)
5. **Reducir movimiento** — respetar `prefers-reduced-motion`
6. **Una orquestación principal** — una animación bien hecha al cargar > 10 micro-interacciones dispersas

```css
/* Siempre agregar en animaciones CSS */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
