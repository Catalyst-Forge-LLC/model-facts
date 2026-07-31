> **Note:** This is the original concept draft for ModelFacts, preserved as-is.
> The normative specification lives in [`SPEC.md`](./SPEC.md).

---

Since **AppFacts** is your established standard for the "Body" of software, **ModelFacts** is the standard for the "Brain."

While AppFacts tells a developer what tools are used to build an application (the "how"), ModelFacts tells a developer exactly what went into the intelligence layer (the "what").

Here is the formal specification for **ModelFacts**.

---

# Specification: Model Facts (ModelFacts.dev)
**Core Directive:** To provide a standardized, machine-parseable, and human-readable summary of an AI model’s architecture, training provenance, capabilities, and safety profile.

## 1. The Core Architecture (The "Base Ingredients")
This section defines the physical existence of the model. It is the "Weight" and "Form" of the intelligence.

| Field | Description | Example Value |
| :--- | :--- | :--- |
| **Model Name** | Official name and versioning. | `Llama-3-70B-Instruct-v1` |
| **Base Architecture** | The structural framework (e.g., Transformer, MoE). | `Mixture of Experts (MoE)` |
| **Parameter Count** | Total number of trainable parameters. | `70 Billion` |
| **Quantization Status** | Whether the model is 16-bit, 8-bit, or quantized (e.g., GGUF, AWQ). | `4-bit (GPTQ)` |
| **Context Window** | Maximum tokens supported in a single inference. | `128k` |

## 2. Training Provenance (The "Data Sourcing")
This is the most critical distinction from a standard README. It moves away from "it was trained on the internet" toward "what specific types of data were weighted."

**The Composition Table:**
| Component | % Contribution | Source Type | Purpose |
| :--- | :--- | :--- | :--- |
| **General Web** | 0% | Scraped/Licensed Text | General knowledge & nuance |
| **Codebase** | 0% | Public Repositories | Logic, syntax, and translation |
| **Academic/Math** | 0% | Journals/Textbooks | Reasoning and technical depth |
| **Synthetic Data** | 0% | LLM-Generated Chains | Chain-of-thought & refinement |
| **Human Feedback** | 0% | RLHF / DPO | Alignment to human intent |

*   **Knowledge Cutoff:** The specific date the training data collection ended.
*   **Training Methodology:** (e.g., Pre-training $\rightarrow$ SFT $\rightarrow$ DPO).

## 3. Capability Matrix (The "Functional Limits")
This defines what the model *can* do out of the box, without external tools or plugins.

| Capability | Level | Nuance |
| :--- | :--- | :--- |
| **Natural Language** | [Full / Limited] | Multilingual support, tone matching |
| **Reasoning/Math** | [High / Med / Low] | Ability to solve multi-step logic problems |
| **Coding** | [High / Med / Low] | Python, JS, Rust, etc. |
| **Vision (Input)** | [Enabled / Disabled] | Ability to process images/OCR |
| **Audio (Input)** | [Enabled / Disabled] | Direct audio processing (not STT) |

## 4. Safety & Guardrail Profile (The "Safety Label")
This determines the "temperature" of the model's safety filters—vital for developers deciding if they need to wrap the model in their own guardrails.

*   **Refusal Sensitivity:** [Low / Med / High] (How aggressively the model refuses prompts it deems harmful).
*   **Instruction Following:** [High / Med / Low] (Adherence to system prompts vs. pre-set weights).
*   **Filter Type:** [Raw / Censored / Hybrid].
*   **Hallucination Score:** (Based on a standardized benchmark like TruthfulQA).

## 5. Benchmarks (The "Nutrition Value")
Standardized metrics to allow for objective comparison between models.

*   **MMLU:** (Massive Multitask Language Understanding)
*   **GSM8K:** (Grade School Math Word Problems)
*   **HumanEval:** (Coding Proficiency)
*   **HumanPreference:** % of times the model's output was preferred over a baseline.

---

### The Implementation Strategy: `MODEL_FACTS.md`

Just as `APP_FACTS.md` sits in a repo to explain the stack, `MODEL_FACTS.md` (or a link/reference within it) defines the intelligence layer.

**The "Golden Rule" of ModelFacts:**
If a piece of information is **subjective** (e.g., *"This model is very creative"*), it does not belong in the ModelFacts. If the information is **objective** (e.g., *"Trained on 3 trillion tokens with a 128k context window"*), it belongs there.

### Why this wins for you:
1.  **Searchability:** You can build a directory of models that are "ModelFacts Certified."
2.  **Trust:** Developers who want to use your model know exactly what they are getting (and what its limits are).
3.  **Ecosystem:** You create the standard for both the **Engine** (Model) and the **Vehicle** (App).

**The Tagline for ModelFacts.dev:**
*"Know the weights behind the words."*
