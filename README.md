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


## Usage

### Home Page

When you first open the site, you’ll see the **Rivalry Tenting Test** landing page.

- Click **Start Studying** to open the player dashboard.
- Click **Take the Quiz** to test yourself on the players currently in your study cart.

The home page functions as a mission briefing: it sets the goal (memorize roster knowledge) and directs you into either study mode or quiz mode.

---

### Dashboard (Study Mode)

The dashboard is the core interactive exploration interface.

1. **Select a Team**
   - Choose Duke or UNC from the dropdown.
   - This filters the available roster.

2. **Select a Player**
   - Choose a player from the team roster dropdown.
   - The system immediately updates:
     - Stats cards (PPG, RPG, APG, MPG)
     - Minutes-per-game visualization (bar chart)

3. **Review Visual Feedback**
   - The chart shows minutes played across recent games.
   - The stat cards reinforce numeric performance data.
   - This dual representation (numbers + chart) supports recognition and comparison.

4. **Add to Study Cart**
   - Use the checkbox or add-to-cart interaction to mark a player for quiz inclusion.
   - The study cart dynamically updates to reflect your selected players.

The dashboard supports focused, one-player-at-a-time study to reduce cognitive overload.

---

### Quiz Page

The quiz page pulls only from the players currently in your **Study Cart**.

- Questions are generated from player data in `players.json`.
- The quiz tests recognition and recall of player stats and attributes.
- Immediate feedback is given for answers.
- Results influence what the user chooses to restudy next.

If no players are in the study cart, the quiz will prompt the user to return to the dashboard and select players.

---

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file in this repository for full details.

MIT License allows reuse, modification, and distribution with attribution.

---

## Acknowledgments

This project was built using:

- **SvelteKit** (framework)
- **Vite** (build tool)
- **Chart.js** (data visualization)
- **JavaScript (ES Modules)**
- **Local JSON dataset** (`src/lib/data/players.json`)

Conceptual influences include:

- Retrieval practice learning theory
- Dashboard-style analytics interfaces
- Sports roster visualization tools

---

## Roadmap

Planned future improvements include:

- Figure out a way to incorporate Machine Learning (Teachable Machine?) to perhaps make an interactive scavenger hunt
- Add difficulty modes:
  - Multiple choice
  - Free response
- Add a “missed questions” review mode
- Add comparison view (compare two players side-by-side)
- Add more advanced visualizations (trend lines, shot distribution, efficiency metrics)
- Integrate persistent storage (localStorage or database) to save quiz history
- Improve mobile responsiveness
- Add subtle animations to reinforce feedback loops

The long-term goal is to transform this from a static study aid into a dynamic, adaptive memorization tool.
