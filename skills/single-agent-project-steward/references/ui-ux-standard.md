# Mandatory UI/UX and Anti-Slop Standard

Apply this standard to every UI design, redesign, implementation, and visual review. Existing project design rules take precedence when they are documented and accessible. When no design system exists, use the restrained defaults below instead of inventing a generic AI aesthetic.

## 1. Define the experience before styling

- Identify the screen's primary user, job, decision, and success outcome.
- Establish the content hierarchy and main action before choosing decoration.
- Record the exact screens, components, states, and shared tokens allowed to change. Treat everything else as read-only.
- Inspect existing reference screens, components, tokens, assets, copy style, and responsive behavior before proposing a new pattern.
- Preserve familiar interaction and information architecture unless the user explicitly requests structural change.

For redesigns, state the concrete usability problem being fixed. “Make it modern” is not evidence for replacing the product's visual language.

## 2. Use restrained color

- Use existing color tokens. Do not add raw colors when a suitable token exists.
- Without an established palette, default to neutral backgrounds and surfaces, one primary accent, and conventional semantic colors for success, warning, danger, and information.
- Do not assign a different accent color to every section, card, statistic, icon, or action.
- Do not introduce gradients, aurora backgrounds, neon glows, colorful shadows, glassmorphism, or blurred color blobs unless explicitly requested or already central to the brand.
- Reserve the primary accent for actions, selection, focus, or a small number of high-value highlights.
- Never use color as the only carrier of meaning. Pair status color with text, iconography, shape, or another accessible cue.
- Verify text and control contrast against their actual backgrounds.

## 3. Avoid generic AI composition

- Do not wrap every piece of content in a rounded card. A card must express a real group, interactive object, or elevation level.
- Avoid excessive border radii, pill-shaped containers, floating panels, nested cards, ornamental badges, and shadows on every surface.
- Avoid the predictable “large gradient headline + subtitle + two buttons + floating dashboard cards” layout unless the product and task genuinely call for a marketing hero.
- Do not create repetitive icon-title-description grids merely to fill space.
- Do not use oversized headings that displace useful content or force unnecessary scrolling.
- Avoid arbitrary asymmetry and decorative whitespace that weakens scanability.
- Prefer a clear page frame, strong alignment, consistent spacing, and deliberate density appropriate to the product.

## 4. Establish hierarchy systematically

- Build hierarchy first with content order, typography, spacing, alignment, and size.
- Keep the typography scale small and consistent. Use no more font families or weights than the project needs.
- Use spacing tokens and a coherent grid; do not choose new gaps independently for each element.
- Keep borders and shadows quiet and consistent. Elevation must communicate layering, not decoration.
- Make one primary action visually dominant. Secondary and destructive actions must have appropriate lower or cautionary emphasis.
- Use icons from the approved library and only when they improve recognition. Do not mix icon styles or use emoji as product icons.

## 5. Write honest product content

- Reuse real project terminology and content where available.
- Use concise, specific labels based on the user's action. Avoid vague calls to action such as “Explore,” “Unlock,” or “Get Started” when a precise verb exists.
- Do not invent testimonials, user counts, revenue, performance metrics, partner logos, awards, product capabilities, or customer identities.
- Placeholder content must be clearly identified and structurally realistic, not presented as production truth.
- Error and empty-state text must explain what happened and the next useful action without blaming the user.

## 6. Design the complete interaction

- Define default, hover, focus, active, selected, disabled, loading, empty, error, validation, success, and destructive-confirmation states when relevant.
- Preserve user input on recoverable errors and prevent accidental duplicate submissions.
- Use progressive disclosure for secondary complexity, not hidden controls that users must guess exist.
- Animation must communicate state, continuity, or feedback. Keep it subtle, respect reduced-motion preferences, and avoid decorative motion loops.
- Touch targets, pointer targets, scroll behavior, sticky elements, overlays, and keyboard focus order must remain usable at supported sizes.

## 7. Make responsive behavior intentional

- Define target viewport classes from the project's supported devices rather than designing desktop first and merely stacking everything on mobile.
- At smaller widths, preserve task priority, readable line lengths, reachable actions, and data comprehension.
- Avoid horizontal overflow unless the content genuinely requires it and an accessible scrolling pattern is provided.
- Choose deliberate transformations for navigation, tables, forms, toolbars, dialogs, and multi-column layouts.
- Test long labels, localization expansion, validation messages, empty data, dense data, and zoom where relevant.

## 8. Meet accessibility requirements

- Use semantic structure and native controls before custom widgets.
- Every control needs an accessible name; every form field needs a persistent label and associated error or help text.
- All functionality must be keyboard operable with a visible focus indicator and sensible focus movement.
- Maintain adequate contrast, readable sizing, non-color cues, and logical heading order.
- Announce important dynamic feedback appropriately without creating excessive screen-reader noise.
- Do not remove outlines, labels, or semantic elements for visual cleanliness.

## 9. Keep implementation scoped

- Reuse existing components when their behavior and semantics match. Do not duplicate a component solely to change minor styling.
- Do not alter global tokens or shared components for a local screen without reviewing every known consumer and recording the impact.
- A redesign of Register does not authorize a redesign of Login, even when both share an authentication layout. Shared code may be inspected; unrelated visual behavior remains read-only.
- Keep visual cleanup inside the task's edit allowlist. Record and justify every scope expansion before editing.

## 10. Mandatory UI/UX handoff gate

Before declaring completion:

1. Compare the result with the project design contract and reference screens.
2. Review the page for unnecessary colors, gradients, glows, cards, pills, shadows, icons, oversized text, generic copy, and invented content; remove anything without a product purpose.
3. Verify the primary task and action hierarchy are obvious.
4. Inspect relevant viewport sizes and UI states, including loading, empty, error, focus, disabled, and long-content cases.
5. Check keyboard use, accessible names, semantic structure, focus visibility, contrast, and non-color status cues using available tools.
6. Run relevant frontend checks, tests, builds, and visual regression tools already present in the project.
7. Report exactly what was visually and functionally verified, what was not inspected, and any remaining design or accessibility risk.

Do not describe a UI as polished, accessible, responsive, or consistent unless the relevant evidence was actually inspected.
