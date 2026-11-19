(() => {
  window.KEADigiDecks = window.KEADigiDecks || {};
  window.KEADigiDecks.toolMatchEditing = {
    id: "tool-match-editing",
    readyBody: "Choose the tool that edits or arranges the artwork.",
    choicesById: {
      select: {
        id: "select",
        label: "Select",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="22" y="22" width="56" height="56" stroke-dasharray="7 6"></rect></svg>'
      },
      rotate: {
        id: "rotate",
        label: "Rotate",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 47a27 27 0 1 1 8 23M24 30v17h18"></path></svg>'
      },
      flip: {
        id: "flip",
        label: "Flip",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 18v64M36 30 14 70h22zM64 30l22 40H64z"></path></svg>'
      },
      duplicate: {
        id: "duplicate",
        label: "Duplicate",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 61H20V20h41v10"></path><rect x="38" y="38" width="42" height="42" rx="3"></rect></svg>'
      }
    },
    items: [
      {
        id: "select-area",
        prompt: "Mark an area of the image so you can edit just that part.",
        answerId: "select",
        distractorIds: ["rotate", "flip", "duplicate"],
        detail: "Select marks the part of the image you want to work on."
      },
      {
        id: "rotate-object",
        prompt: "Turn a sideways drawing a quarter turn.",
        answerId: "rotate",
        distractorIds: ["select", "flip", "duplicate"],
        detail: "Rotate turns the drawing around a point."
      },
      {
        id: "flip-object",
        prompt: "Make a left-facing drawing face right as if you held it up to a mirror.",
        answerId: "flip",
        distractorIds: ["select", "rotate", "duplicate"],
        detail: "Flip mirrors the drawing along an axis."
      },
      {
        id: "duplicate-object",
        prompt: "Make another copy of an object while keeping the original.",
        answerId: "duplicate",
        distractorIds: ["select", "rotate", "flip"],
        detail: "Duplicate gives you a second copy to move or edit."
      }
    ]
  };
})();
