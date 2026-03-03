# Duke-UNC Rivalry Tenting Test

**Tagline:** Study Duke vs UNC player stats with an interactive dashboard, build a personalized “study cart,” then quiz yourself so you don’t sell your team on tenting test day.

---

## Project Description

**Rivalry Tenting Test** is a small, interactive study system built for Duke/UNC “tenting test” prep. Instead of passively reading a roster, you actively **explore player stats**, **see minutes-per-game visualizations**, and **curate a custom set of players** to study. The system then turns your selections into a **quiz mode** to reinforce memory through retrieval practice.

### Key Features
- **Dashboard explorer:** Choose a team + player and view core stats (PPG/RPG/APG/MPG)
- **Minutes visualization:** Bar chart (Chart.js) from the player’s game log
- **Study cart:** Check players as “studied” and build a personalized set
- **Quiz page:** Tests you on the players you selected (retrieval practice loop)
- **Local dataset:** Uses `src/lib/data/players.json` (no database required)

---

## Target Audience

**Who it’s for:** Duke students (or any sports fan) who need to quickly memorize roster knowledge for a trivia-style test.

**Context of use:** Short “study sessions” on a laptop/phone before tenting checks, in line, or the night before a test—especially useful when you only need to focus on a subset of players.

---

## Motivation

I built this because tenting-test studying is usually *static* (spreadsheets, screenshots, random notes). This project explores:  
- How can interactive visualization + selection tools reduce cognitive load?  
- Can a lightweight feedback loop (study → commit → quiz → revise) improve confidence and retention?

The goal is not just displaying data, but creating a **behavior-shaping interface** that nudges the user toward effective studying.

---

## Human-Centered Design Analysis

### Affordances
- **Dropdowns** afford selecting a team/player
- **Checkbox/Add-to-cart** affords committing a player to the study set
- **Chart** affords quick pattern recognition (“who plays the most?”)
- **Buttons (“Start Studying”, “Take the Quiz”)** afford mode switching

### Anti-affordances (intentional)
- The user **can’t quiz “everything” by accident**—quiz focuses on the players in the study cart  
- The system avoids overwhelming the user by **scoping attention** to one player at a time

### Constraints / Restrictions
- Quiz content is constrained to the user’s chosen study set (cart)
- Data is constrained to a local JSON dataset (fast, reliable, no setup burden)

### Signifiers (how actions are communicated)
- Labels (“Team”, “Select a player”) clearly signal what to do next
- The chart title updates with the selected player’s name
- Cart area signals state: what has been “committed” for study/quiz

### Cues (visual + spatial + interactive)
- Two-panel layout: **Controls** left, **Visualization** right
- Emphasis styling (cards, badges) guides attention to “current selection”
- Chart visual feedback provides immediate “meaning” after selection

### System Response + Feedback
- Selecting a player updates:
  - stats cards (instant numeric feedback)
  - chart rendering (visual feedback)
- Checking a player updates:
  - the study cart (state feedback)
  - quiz pool (system behavior feedback)
- In quiz mode:
  - correctness feedback shapes what the user studies next

### Feedback Loops and Behavior
This project’s core loop is:
1) explore player → 2) commit to cart → 3) quiz yourself → 4) return to dashboard to patch gaps  
That loop is cybernetic: output (quiz results) modifies future input (what you choose to study next).

---

## Installation

### Prerequisites
- Node.js (recommended: **18+**)
- npm

### Setup
```bash
# install dependencies
npm install

# run dev server
npm run dev
