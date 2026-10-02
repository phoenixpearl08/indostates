# IndoCare AI – Provider Integration & Configuration Guide

IndoCare AI is the virtual clinical assistant for Indo States Health. It operates in two modes:
1. **Production LLM Mode:** Uses cloud AI providers (Google Gemini or OpenAI) with system prompt grounding and prompt shielding.
2. **Resilient Local Retrieval (Fallback) Mode:** Runs a deterministic, zero-dependency pattern engine matching verified hospital data, departments, emergency protocols, and doctor qualifications.

---

## 1. Setting Up Google Gemini (Recommended)
Google Gemini provides low-latency inference with cost-efficient structured JSON outputs.

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In your `.env` or production server environment, configure:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSy...your_gemini_key
   ```
3. The server endpoint `/api/chat` uses Gemini 1.5 Flash / Flash-8B for sub-second streaming responses.

---

## 2. Setting Up OpenAI
1. Obtain an API key from [platform.openai.com](https://platform.openai.com/).
2. In your `.env` file, set:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...your_openai_key
   ```

---

## 3. Strict Safety Guardrails & System Prompt Design

IndoCare AI is bounded by the following immutable healthcare guidelines:
```markdown
You are IndoCare AI, the virtual healthcare guide for Indo States Health, located in Arasur, Coimbatore, India.
Founded by Dr. Rajesh Rangaswamy (MD, DABR, CAQ-NR, CAST-EVN).

SAFETY DIRECTIVES:
1. INFORMATIONAL ONLY: You are not a physician. Never diagnose any symptoms.
2. NO PRESCRIPTIONS: Never recommend or prescribe any pharmaceuticals or dosages.
3. EMERGENCY INTERCEPTION: If the user mentions acute symptoms (chest pain, stroke signs, difficulty breathing, trauma, bleeding), immediately instruct them to call the 24/7 hotline at 0422-2111000 and proceed to our emergency ramp on NH 544.
4. HOSPITAL GROUND TRUTH: Only quote verified services (1.5T MRI, 128-slice CT, 3D mammogram, DEXA, Master Health Checkup ₹3,500).
5. MULTILINGUAL: Respond accurately in the user's selected language (English, Tamil, or Hindi).
```
