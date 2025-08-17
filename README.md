  # React Scribble Pad
  
  ### Transparent Overlay for Sketch, Text, and Stickers.

**React Scribble Pad lets you add a fully transparent sketching layer on top of any webpage or React app. Users can freely draw, type notes, and place stickers while still seeing and interacting with the content beneath—perfect for education, presentations, and live annotations.**
  
  
🛠️ Installation
```
npm install --save-dev react-scribble-pad
yarn add react-scribble-pad
```

```
import React from 'react';

import { ScribblePad } from "react-scribble-pad";
import "react-scribble-pad/dist/react-scribble-pad.css";
  
function App(){

  return (
    <div>
      <ScribblePad />
    </div>
  );
}
```

## 🚀 Features
 - Color Palette – Choose colors and sketch freely on the canvas.
 - Eraser Tool – Remove sketches with ease.
 - Customization – Adjust text size and cursor thickness.
 - Notes – Add text notes directly on the overlay.
 - Whiteboard Mode – Switch to a clean screen and use it as a digital whiteboard.
