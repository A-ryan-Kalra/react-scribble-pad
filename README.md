# React Scribble Pad

### Transparent Overlay for Sketch, Text, and Stickers.

<div align="center">
 
<table>
  <tr>
    <td>
      Alert: Launched New Features 🚀<br>
      <a href="https://github.com/A-ryan-Kalra/react-scribble-pad/releases/tag/v1.4.1">Check out →</a>
    </td>
  </tr>
</table>

</div>

<br/>

<div align="center">
<table align="center"> 
  <tr>
    <td><img width="250" alt="image5" src="https://github.com/user-attachments/assets/fe066753-edbd-4355-a1cb-5a37fc5ad78e" /></td>
   <td><img  alt="image3" width="250" src="https://github.com/user-attachments/assets/8d44288c-3336-4a37-b89b-9ef88932ee72" /></td>
   <td><img width="250" alt="img" src="https://github.com/user-attachments/assets/d5a2e993-5b9d-451e-bafc-9d647f5f10d5" /></td>
  </tr>
  <tr>
    <td><img  alt="image1" width="250" src="https://github.com/user-attachments/assets/2ba5a1a8-5794-4dc0-9f9b-38dd7c74ea89" /></td>
    <td><img  width="250" alt="image2" src="https://github.com/user-attachments/assets/8a8dd17d-c275-41ec-81ee-84868df01244" /></td>
    <td><img src="https://github.com/user-attachments/assets/284f1767-91c6-4894-b38f-e2c30938b655" alt="image4" width="250"/></td>
  </tr>
</table>

<hr/>

<video src="https://github.com/user-attachments/assets/7eae3444-74df-4b99-a1b7-54ed070b319b"/>
</div>

<br/>
 
## 📢 New Update!

**Extension available on both [chrome](https://chromewebstore.google.com/detail/mjikafmehojamcedemookbjjnhpciehm?utm_source=item-share-cb) and [firefox](https://addons.mozilla.org/en-US/firefox/addon/scribble-pad/) !! 🎁🥳**

<br/>

## 🛠️ Installation

```
npm install --save-dev react-scribble-pad
yarn add react-scribble-pad
```

**React**

```
import React,{ useState } from 'react';

import { ScribblePad } from "react-scribble-pad";
import "react-scribble-pad/dist/react-scribble-pad.css";   // Must include the css file

function App() {
 const [open, setOpen] = useState<boolean>(false);
 function handleScribblePad() {
    setOpen(true);
 }

  return (
    <div>
      <button onClick={handleScribblePad}>Open Scribble Pad</button>
      <ScribblePad openPad={open} setOpenPad={setOpen} />
    </div>
  );
}

export default App;
```

**Next.js (App Router)**

```
"use client";
import React,{ useState } from 'react';

import { ScribblePad } from "react-scribble-pad";
import "react-scribble-pad/dist/react-scribble-pad.css";   // Must include the css file

function App() {
 const [open, setOpen] = useState<boolean>(false);
 function handleScribblePad() {
    setOpen(true);
 }

  return (
    <div>
      <button onClick={handleScribblePad}>Open Scribble Pad</button>
      <ScribblePad openPad={open} setOpenPad={setOpen} />
    </div>
  );
}

export default App;
```

<br>

## 🚀 Features

**React Scribble Pad lets you add a fully transparent sketching layer on top of any webpage. Users can freely draw, type notes, place stickers and use as a whiteboard while still seeing and interacting with the content beneath.**

- Color Palette – Choose colors and sketch freely on the canvas.
- Eraser Tool – Remove sketches with ease.
- Customization – Adjust text size and cursor thickness.
- Notes – Add text notes directly on the overlay.
- Whiteboard Mode – Switch to a clean screen and use it as a digital whiteboard.
- Motive - perfect for education, presentations, and live annotations.

<br>

## 🎹 Keyboard Shortcuts & Toolpad

| Key   | Action                                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| `🔒`  | Enabling screen lock for touch users, prevents scrolling and lets them sketch directly on the canvas                 |
| `⛶`   | Switch Full-Screen/Window Mode (Newly launched 🤩)                                                                   |
| `📸`  | Take Screenshot of a webpage                                                                                         |
| `1`   | 🎨 Open the Palette – choose colors and adjust stroke size                                                           |
| `2`   | 🩹 Open the Eraser – erase parts of your sketch                                                                      |
| `3`   | 🖱️ Open Cursor Tools – change cursor size or appearance                                                              |
| `4`   | ✏️ Add Texts – insert text anywhere on the canvas                                                                    |
| `5`   | 📝 Make Draggable Notes – create sticky-style notes you can move around                                              |
| `6`   | 🖥️ Switch to Whiteboard Mode – expand into fullscreen whiteboard                                                     |
| `7`   | 🎨 Open the Palette - choose background colors for Whiteboard Mode                                                   |
| `8`   | 🔄 Reset Everything – clear the canvas                                                                               |
| `Esc` | 🔄 Reset Configured Tools                                                                                            |
| `Del` | 🚮 Pressing Delete key on draggable notes or backspacing every character until the last one, will simply delete them |

<br>

## 🗿 Demo

**[A demo is more powerful than storytelling.](https://scribble-pad-psi.vercel.app/)**

<br/>

## 🎁 Donate

[<img width="1090" height="306" alt="image" src="https://github.com/user-attachments/assets/ad84946b-d4b9-472f-b4e6-daea70872927" />](https://buymeacoffee.com/aryansmartb)

<br/>

---

<details>
  <summary>You know what's absolutely free?</summary>

- Leaving a ⭐ star
- 🍴Forking the repository
- No hidden fees, no subscriptions - just pure open-source love 🥰!

</details>

---

<div align="center">

<br>
Powered by ☕️ & 🎧 <br>
Aryan Kalra

</div>
