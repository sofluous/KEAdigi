(function () {
  window.KEADigiDecks = window.KEADigiDecks || {};

  window.KEADigiDecks.toolMatch = {
    id: "tool-match",
    type: "multiple-choice",
    readyTitle: "Ready",
    readyBody: "Choose the tool that matches the job.",
    correctTitle: "Correct",
    wrongTitle: "Try another tool next round",
    choicesById: {
      brush: {
        id: "brush",
        label: "Brush",
        use: "Paint lines",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M66 22l12 12"></path><path d="M30 70L70 30l10 10-40 40H20V60z"></path><path d="M24 76c0-8 6-14 14-14"></path></svg>'
      },
      eraser: {
        id: "eraser",
        label: "Eraser",
        use: "Remove marks",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M28 62l22-22 24 24-14 14H42z"></path><path d="M60 78h16"></path><path d="M50 40l10-10 24 24-10 10"></path></svg>'
      },
      fill: {
        id: "fill",
        label: "Fill",
        use: "Pour color",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 54l22-24 18 18-22 24z"></path><path d="M66 64c0-6 5-11 11-11s11 5 11 11c0 7-6 12-11 16-5-4-11-9-11-16z"></path><path d="M20 76h34"></path></svg>'
      },
      crop: {
        id: "crop",
        label: "Crop",
        use: "Trim edges",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M34 18v44c0 8 6 14 14 14h34"></path><path d="M18 34h44c8 0 14 6 14 14v34"></path><path d="M26 74l48-48"></path></svg>'
      },
      text: {
        id: "text",
        label: "Text",
        use: "Add words",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 26h56"></path><path d="M50 26v48"></path><path d="M34 74h32"></path></svg>'
      },
      move: {
        id: "move",
        label: "Move",
        use: "Reposition items",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 18v64"></path><path d="M50 18l-10 10"></path><path d="M50 18l10 10"></path><path d="M18 50h64"></path><path d="M18 50l10-10"></path><path d="M18 50l10 10"></path><path d="M82 50l-10-10"></path><path d="M82 50l-10 10"></path><path d="M50 82l-10-10"></path><path d="M50 82l10-10"></path></svg>'
      },
      eyedropper: {
        id: "eyedropper",
        label: "Eyedropper",
        use: "Pick a color",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M62 24l14 14"></path><path d="M34 66l34-34 8 8-34 34H30V62z"></path><path d="M46 54l10 10"></path></svg>'
      },
      shape: {
        id: "shape",
        label: "Shape",
        use: "Add geometry",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="30" cy="30" r="10"></circle><rect x="48" y="20" width="24" height="24" rx="4"></rect><path d="M34 74l14-22 14 22z"></path></svg>'
      }
    },
    items: [
      {
        id: "brush-clue",
        prompt: "Paint freehand lines.",
        answerId: "brush",
        distractorIds: ["eraser", "fill", "text"],
        detail: "Brush tools let you draw marks and strokes by hand."
      },
      {
        id: "eraser-clue",
        prompt: "Remove part of the picture.",
        answerId: "eraser",
        distractorIds: ["brush", "move", "shape"],
        detail: "The eraser takes away marks you do not want to keep."
      },
      {
        id: "fill-clue",
        prompt: "Color a closed area quickly.",
        answerId: "fill",
        distractorIds: ["brush", "eyedropper", "crop"],
        detail: "Fill tools pour one color into a whole space at once."
      },
      {
        id: "crop-clue",
        prompt: "Trim away the outside edges.",
        answerId: "crop",
        distractorIds: ["move", "text", "shape"],
        detail: "Crop keeps the part you want and cuts away the rest."
      },
      {
        id: "text-clue",
        prompt: "Add words to the page.",
        answerId: "text",
        distractorIds: ["brush", "crop", "move"],
        detail: "Text tools place letters and words into your design."
      },
      {
        id: "move-clue",
        prompt: "Drag an object to a new spot.",
        answerId: "move",
        distractorIds: ["crop", "fill", "eraser"],
        detail: "Move tools reposition shapes, layers, and selected objects."
      },
      {
        id: "eyedropper-clue",
        prompt: "Pick a color that is already in the picture.",
        answerId: "eyedropper",
        distractorIds: ["fill", "brush", "shape"],
        detail: "An eyedropper samples a color so you can use the same one again."
      },
      {
        id: "shape-clue",
        prompt: "Add a basic circle, square, or triangle.",
        answerId: "shape",
        distractorIds: ["text", "move", "eyedropper"],
        detail: "Shape tools quickly place clean geometric forms."
      }
    ]
  };
})();
