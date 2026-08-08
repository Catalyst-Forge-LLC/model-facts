# ModelFacts — improvement roadmap (from suite value assessment)

> Derived from x-facts
> [`SUITE-VALUE-AND-NETWORK-EFFECTS.md`](../../x-facts/specs/SUITE-VALUE-AND-NETWORK-EFFECTS.md).
> ModelFacts is the **public proof** and the **catalog pattern** other labels will
> copy when selection pressure appears.

**Status:** planned (read carefully if another agent owns active directory work).  
**Role in the flywheel:** Seeded directory + agent contract (`llms.txt`,
`index.json`, compare) show that xFacts can be *useful on day one*, not an empty
spec. Push + deploy is the critical path.

---

## Where ModelFacts stands

Strong local build: SPEC, schema, generator (HF/Ollama), validator, ~25-model
directory, selection UX, `llms.txt` / `AGENTS.md`. Not the portable `/v` focus
this round (catalog + `facts.json` is the agent path). Remote/deploy still the
main gap for *public* network effects.

## Gaps vs the value thesis

| Gap | Why it matters |
|---|---|
| **Not live** | Cold-start: agents and humans cannot discover what is not deployed. |
| Lab adoption | Official `MODEL_FACTS.md` from a lab beats third-party seed forever. |
| Capability enum honesty | Over-trust in claim enums → trust theater; keep `capability_basis` loud. |
| Optional `/v` later | Share UX for single models; not blocking vs directory. |
| Cross-links from AgentFacts | Composition: agents should point at real ModelFacts URLs once live. |

## Improvements (ordered)

### Near-term (P0 for suite)

1. **Push remote + deploy modelfacts.dev** + DNS — unlock everything else.
2. Confirm `llms.txt` / directory JSON CORS/`_headers` correct in production.
3. Hub + sibling footers: flip ModelFacts from “not live” to live when true.
4. One outbound note: “how agents select models” pointing at `/directory/AGENTS.md`
   and the suite [discovery contract](../../x-facts/specs/DISCOVERY-AND-PUBLICATION.md)
   (directory = cold-start; cards should still link canonical `MODEL_FACTS.md`).

### Mid-term

5. Grow seed with honesty: size ladders only where tradeoffs matter; stamp
   `undisclosed` on closed APIs without inventing params.
6. Court **one** lab or major host for an official label (adoption, not endorsement).
7. Generator polish: fewer TODO drafts in reviewed set; clearer judgment_sources.
8. Deep-link from AgentFacts exemplars to live `MODEL_FACTS` URLs when models are fixed.

### Later

9. Optional portable `/v` (mf1) if share/QR demand appears — see suite viewer spec.
10. Measurement path before any “certified” capability language (benchmark harness).
11. Drift alerts for orgs pinning models (enterprise wedge; CF services, not the
    CC0 standard).

## Roadmap phases

| Phase | Outcome | Exit |
|---|---|---|
| A | Public existence | Site + directory live; hub status updated |
| B | Agent habit | External agents use `index.json` in a real workflow |
| C | Publisher habit | ≥1 official third-party `MODEL_FACTS.md` |
| D | Trust integrity | Measurement plan drafted; still no “certified” in public copy |

## Non-goals

- Competing with Hugging Face as a hosting platform.
- Sponsored placement in the directory (ruled out suite-wide).
- Replacing model cards — complement with a skimable, comparable label.

## Success signals

- modelfacts.dev is the URL agents fetch for model shortlists.
- `undisclosed` columns create social pressure without CF editorializing.
- AgentFacts/ToolFacts cite live ModelFacts links in composition examples.

## Related

- [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md), [`DIRECTORY_SELECTION.md`](./DIRECTORY_SELECTION.md)
- Suite index: [`x-facts/specs/ROADMAPS.md`](../../x-facts/specs/ROADMAPS.md)
