# KEA Digi Hub

A static library of 18 classroom learning modules. Open [the library](index.html) or [the component gallery](components.html).

## Run locally

From this directory, run `python -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000/`. The app runs in the browser and has no install or build step.

## Where to edit

| Location | Owns |
| --- | --- |
| `index.html` | Library categories and launch cards |
| `components.html` | Shared component examples |
| Root module HTML files | Public URLs, page markup and loading order |
| `modules/<slug>/module.css` and `module.js` | Styles and behavior for one module |
| `keadigi.css` and `styles/` | Shared components, design tokens and gallery layout |
| `scripts/` | Shared shell, dialog, classroom and activity behavior |
| `decks/` | Reusable activity content |
| `assets/` | Module art, fonts and licenses |

Module HTML remains at the repository root to preserve bookmarks and classroom URLs. Keep the module script after any deck and shared activity engine it depends on. After editing, run `node --check` on the changed JavaScript and open the module from the library to check its main interaction and Help dialog.

## Module index

### Concepts

- [Image Zoom Lab](ImageZoomLab.html) ? [Source](modules/image-zoom-lab/)
- [Layer Explorer](LayerExplorer.html) ? [Source](modules/layer-explorer/)
- [Frame Player](FramePlayer.html) ? [Source](modules/frame-player/)
- [Vector Vs Pixel](VectorVsPixel.html) ? [Source](modules/vector-vs-pixel/)
- [RGB Screen Lab](RGBScreenLab.html) ? [Source](modules/rgb-screen-lab/)
- [Files And Folders Explorer](FilesAndFoldersExplorer.html) ? [Source](modules/files-and-folders/)
- [Transparency Lab](TransparencyLab.html) ? [Source](modules/transparency-lab/)
- [Cursor Mechanics](CursorMechanics.html) ? [Source](modules/cursor-mechanics/)
- [Undo History](UndoHistory.html) ? [Source](modules/undo-history/)

### Tools

- [Pixel Painter](PixelPainter.html) ? [Source](modules/pixel-painter/)
- [Interactive Keyboard](Keyboard.html) ? [Source](modules/keyboard/)

### Practice

- [RGB Color Mixer](ColorMatch.html) ? [Source](modules/rgb-color-mixer/)
- [Icon Detective](IconDetective.html) ? [Source](modules/icon-detective/)
- [Tool Match](ToolMatch.html) ? [Source](modules/tool-match/)
- [File Cabinet](FileCabinet.html) ? [Source](modules/file-cabinet/)
- [Color Sort Studio](ColorSortStudio.html) ? [Source](modules/color-sort-studio/)

### Games

- [Tangram Match](ShapeMatch.html) ? [Source](modules/tangram-match/)

### Guided Activities

- [Layer Stack](LayerStack.html) ? [Source](modules/layer-stack/)
