(function () {
  window.KEADigiDecks = window.KEADigiDecks || {};

  window.KEADigiDecks.fileCabinet = {
    id: "file-cabinet",
    type: "sorting",
    rounds: [
      {
        id: "basic-file-types",
        promptTitle: "Sort The Files",
        promptText: "Place each file into the folder where it belongs.",
        folders: [
          { id: "pictures", label: "Pictures", hint: "Photos and image files", mark: "PIC" },
          { id: "school", label: "School", hint: "Writing and class work", mark: "DOC" },
          { id: "audio", label: "Audio", hint: "Songs and sound clips", mark: "AUD" }
        ],
        files: [
          { id: "sunset-png", name: "sunset.png", type: "PNG image", folderId: "pictures", detail: "PNG files are pictures." },
          { id: "class-notes-txt", name: "class-notes.txt", type: "Text note", folderId: "school", detail: "TXT files are writing and notes." },
          { id: "drum-loop-mp3", name: "drum-loop.mp3", type: "Audio clip", folderId: "audio", detail: "MP3 files are sound files." },
          { id: "portrait-jpg", name: "portrait.jpg", type: "Photo", folderId: "pictures", detail: "JPG files are photos and pictures." },
          { id: "book-report-doc", name: "book-report.doc", type: "School document", folderId: "school", detail: "DOC files usually hold typed work." },
          { id: "bell-ring-wav", name: "bell-ring.wav", type: "Sound effect", folderId: "audio", detail: "WAV files store recorded sound." }
        ]
      },
      {
        id: "creative-projects",
        promptTitle: "File Types",
        promptText: "Keep art, writing, and sounds in the right folders.",
        folders: [
          { id: "art", label: "Art", hint: "Drawings and graphics", mark: "ART" },
          { id: "writing", label: "Writing", hint: "Stories and notes", mark: "TXT" },
          { id: "sounds", label: "Sounds", hint: "Recorded audio", mark: "SND" }
        ],
        files: [
          { id: "robot-sketch-svg", name: "robot-sketch.svg", type: "Vector drawing", folderId: "art", detail: "SVG files are drawings and graphics." },
          { id: "story-idea-rtf", name: "story-idea.rtf", type: "Writing file", folderId: "writing", detail: "RTF files hold formatted writing." },
          { id: "rainy-day-ogg", name: "rainy-day.ogg", type: "Audio recording", folderId: "sounds", detail: "OGG files are sound recordings." },
          { id: "poster-design-png", name: "poster-design.png", type: "Poster image", folderId: "art", detail: "PNG files can hold graphics and posters." },
          { id: "reading-log-docx", name: "reading-log.docx", type: "School writing", folderId: "writing", detail: "DOCX files usually contain writing." },
          { id: "choir-practice-mp3", name: "choir-practice.mp3", type: "Music file", folderId: "sounds", detail: "MP3 files play sound and music." }
        ]
      },
      {
        id: "project-cleanup",
        promptTitle: "Tidy The Computer",
        promptText: "Sort the project files into the best folders.",
        folders: [
          { id: "photos", label: "Photos", hint: "Camera pictures", mark: "JPG" },
          { id: "projects", label: "Projects", hint: "Work files", mark: "PRJ" },
          { id: "music", label: "Music", hint: "Songs and tunes", mark: "MUS" }
        ],
        files: [
          { id: "field-trip-jpg", name: "field-trip.jpg", type: "Camera photo", folderId: "photos", detail: "JPG files belong with photos." },
          { id: "science-fair-ppt", name: "science-fair.ppt", type: "Project slides", folderId: "projects", detail: "Presentation files belong with project work." },
          { id: "theme-song-mp3", name: "theme-song.mp3", type: "Song file", folderId: "music", detail: "MP3 files belong in music folders." },
          { id: "pet-photo-png", name: "pet-photo.png", type: "Saved image", folderId: "photos", detail: "PNG files can store pictures and photos." },
          { id: "model-plan-pdf", name: "model-plan.pdf", type: "Project plan", folderId: "projects", detail: "PDF files often store project sheets and plans." },
          { id: "practice-beat-wav", name: "practice-beat.wav", type: "Sound file", folderId: "music", detail: "WAV files belong with sound and music." }
        ]
      }
    ]
  };
})();
