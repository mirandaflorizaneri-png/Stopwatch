
# StopWatch — Precision Web Stopwatch

Simple stopwatch web app built with HTML, CSS, and JavaScript. This project demonstrates a basic stopwatch UI and simple timing logic without external dependencies.

## Features
- Start, stop, and reset the stopwatch
- Minimal responsive layout
- Clean, well-commented JavaScript logic for easy extension

## Files
- `index.html` — Main HTML markup
- `style.css` — Styling for the stopwatch UI
- `script.js` — Stopwatch logic (start/stop/reset)

## Run Locally
Open `index.html` in any modern browser (Chrome, Edge, Firefox). For a local server, run:

```bash
python -m http.server 8000

```

## Development Notes
- Edit `script.js` to change behaviour or add features (lap recording, persistence)
- Edit `style.css` to update styling and responsiveness
- Consider adding automated tests and a build pipeline for production

## How the stopwatch works

- **Controls:**
	- **Start:** begins timing (resumes from the previous elapsed time if any).
	- **Stop:** stops the timer, saves the current run as a record (including any laps), then clears the display and current laps.
	- **Lap:** while running, records the current cumulative elapsed time as a lap. The lap list shows per-lap durations (differences between consecutive cumulative times); fastest and slowest laps are highlighted.
	- **Reset:** clears the timer, current laps, and all saved records.

- **Rounds & Records:**
	- Each run (start → stop) is saved as a round/record. If you created laps during the run, those are saved with the record. Records can be deleted individually from the Records area.

- **Timing & Format:**
	- Display format is `HH:MM:SS.mmm` (hours:minutes:seconds.milliseconds).
	- The timer updates every 10ms to provide sub-second precision.

- **Behavior notes:**
	- Laps are stored as cumulative times; per-lap durations are computed from those cumulative values.
	- Stopping the stopwatch both saves the round and resets the visible timer to `00:00:00.000`.
	- Reset removes all saved rounds and returns the UI to its initial state.

## Contributing
Contributions are welcome. Open an issue to discuss changes or submit a pull request.


