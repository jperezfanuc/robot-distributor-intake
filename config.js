/* ==========================================================
   Settings you are likely to edit.

   Question weights live in index.html, as data-weight on each
   ".q" block. Here you control the level labels and whether the
   person filling in the form sees their result.
   ========================================================== */

window.READINESS_CONFIG = {

  // false = the respondent only sees a thank-you message.
  // true  = they also see their level (1 to 9) and label.
  // Either way, the score is always saved with the submission.
  showResultToRespondent: false,

  // Percent of available points -> level 1 to 9 (like a TRL scale).
  // Levels are evenly spaced: level 1 is 0 to 11%, level 9 is 89 to 100%.
  levelCount: 9,

  // Labels are picked by the highest "upTo" level that fits.
  labels: {
    RSRL: [
      { upTo: 3, label: "Not yet ready to sell robots" },
      { upTo: 6, label: "Ready to sell robots with coaching" },
      { upTo: 9, label: "Ready to sell robots" }
    ],
    RTRL: [
      { upTo: 3, label: "Not yet ready to support robots" },
      { upTo: 6, label: "Ready to support robots with mentoring" },
      { upTo: 9, label: "Ready to assess robot applications" }
    ]
  }
};
