<div align="center">

# 📊 Attendance Calculator

**Know exactly how many classes you can skip, or need to attend, to hit your attendance target.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](YOUR_DEMO_LINK)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Made with](https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-orange)

[Live Demo](YOUR_DEMO_LINK) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

![Screenshot](assets/screenshot.png)

</div>

---

## 🎯 Why this exists

Most colleges require a minimum attendance (commonly **75%**). Working out
"how many more classes can I miss?" by hand is tedious and easy to get wrong.
This tool does the math instantly, so you can plan your semester instead of
panicking before exams.

## ✨ Features

- ✅ Calculates your **current attendance percentage**
- 🧮 Tells you how many classes you must attend to reach your target
- 🏖️ Tells you how many classes you can safely **skip**
- 🔮 Predicts your final percentage based on planned absences
- 🎚️ Adjustable target percentage (default: 75%)
- 📱 Responsive layout, works on phone and desktop
- ⚡ No install, no backend, no sign-up

## 🖼️ Demo

| Input | Result |
|-------|--------|
| ![Input](assets/input.png) | ![Result](assets/result.png) |

## 🚀 Quick Start

**Use it online:** [YOUR_DEMO_LINK](YOUR_DEMO_LINK)

**Run locally:**

```bash
git clone https://github.com/Aryan-9907/Attendance-Calculator.git
cd Attendance-Calculator
```

Then open `index.html` in your browser. No build step required.

## 🧠 How it works

Let `A` = classes attended, `T` = total classes held, `P` = target (e.g. 0.75).

| Goal | Formula |
|------|---------|
| Current % | `A / T × 100` |
| Classes to attend consecutively to reach target | `ceil((P·T − A) / (1 − P))` |
| Classes you can still skip | `floor(A / P − T)` |

**Example:** attended 30 of 45 classes (66.7%) with a 75% target.
You need `ceil((0.75×45 − 30) / 0.25) = 16` consecutive classes to get back to 75%.

## 🗂️ Project Structure

```
Attendance-Calculator/
├── index.html      # UI
├── style.css       # Styling
├── script.js       # Calculation logic
└── README.md
```

## 🛠️ Built With

- HTML5
- CSS3
- JavaScript (vanilla)

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Multi-subject tracking
- [ ] Save data in local storage
- [ ] Dark mode
- [ ] Export report as PDF

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

## 👤 Author

**Aryan**, [@Aryan-9907](https://github.com/Aryan-9907)

⭐ If this helped you, consider giving the repo a star!
