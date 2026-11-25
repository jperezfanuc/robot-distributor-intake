(function () {
  "use strict";

  var cfg = window.READINESS_CONFIG;

  var form = document.getElementById("intake-form");
  var thanks = document.getElementById("thanks");
  var submitBtn = document.getElementById("submit-btn");
  var statusEl = document.getElementById("status");
  var errorEl = document.getElementById("form-error");
  var progressFill = document.getElementById("progress-fill");

  var cards = {
    Sales: document.getElementById("scorecard-sales"),
    Technical: document.getElementById("scorecard-technical")
  };

  /* ---------- Show the scorecard that matches the chosen role ---------- */

  function currentRole() {
    var checked = form.querySelector('input[name="role"]:checked');
    return checked ? checked.value : null;
  }

  function syncScorecards() {
    var role = currentRole();
    Object.keys(cards).forEach(function (key) {
      var on = key === role;
      cards[key].hidden = !on;
      // A disabled fieldset is skipped by validation and by FormData,
      // so answers from the hidden scorecard are never submitted.
      cards[key].disabled = !on;
    });
  }

  /* ---------- Progress ---------- */

  function updateProgress() {
    var required = form.querySelectorAll("input[required]:not(:disabled)");
    var seen = {};
    var total = 0;
    var answered = 0;

    required.forEach(function (el) {
      var key = el.type === "radio" ? "r:" + el.name : "t:" + el.name;
      if (seen[key]) return;
      seen[key] = true;
      total += 1;

      if (el.type === "radio") {
        if (form.querySelector('input[name="' + el.name + '"]:checked')) answered += 1;
      } else if (el.value.trim() !== "") {
        answered += 1;
      }
    });

    var pct = total ? Math.round((answered / total) * 100) : 0;
    progressFill.style.width = pct + "%";
    statusEl.textContent = answered + " of " + total + " answered";
  }

  /* ---------- Scoring ---------- */

  function scoreCard(card) {
    var points = 0;
    var max = 0;

    card.querySelectorAll(".q").forEach(function (q) {
      var weight = Number(q.dataset.weight) || 0;
      max += weight;

      var checked = q.querySelector("input:checked");
      if (!checked) return;

      if (q.dataset.type === "yesno") {
        if (checked.value === "Yes") points += weight;
      } else {
        // band: tier 0 = nothing, 1 = half, 2 = full weight
        points += weight * (Number(checked.dataset.tier) / 2);
      }
    });

    var percent = max ? points / max : 0;
    var level = Math.min(cfg.levelCount, Math.floor(percent * cfg.levelCount) + 1);
    return { points: points, max: max, percent: percent, level: level };
  }

  function labelFor(type, level) {
    var list = cfg.labels[type] || [];
    for (var i = 0; i < list.length; i++) {
      if (level <= list[i].upTo) return list[i].label;
    }
    return "";
  }

  function fillHiddenFields(role) {
    var card = cards[role];
    var type = card.dataset.card; // "RSRL" or "RTRL"
    var s = scoreCard(card);
    var label = labelFor(type, s.level);

    document.getElementById("readiness_type").value = type;
    document.getElementById("readiness_points").value = s.points;
    document.getElementById("readiness_max").value = s.max;
    document.getElementById("readiness_percent").value = Math.round(s.percent * 100);
    document.getElementById("readiness_level").value = s.level;
    document.getElementById("readiness_label").value = label;

    return { type: type, level: s.level, label: label };
  }

  /* ---------- Submit ---------- */

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function showThanks(result) {
    var firstName = form.elements["name"].value.trim().split(/\s+/)[0];
    document.getElementById("thanks-title").textContent =
      firstName ? "Thanks, " + firstName + ". Your intake is in." : "Thanks. Your intake is in.";

    var resultBox = document.getElementById("thanks-result");
    if (cfg.showResultToRespondent) {
      document.getElementById("thanks-level").textContent = result.type + " level " + result.level + " of " + cfg.levelCount;
      document.getElementById("thanks-label").textContent = result.label;
      resultBox.hidden = false;
    } else {
      resultBox.hidden = true;
    }

    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isLocalPreview() {
    return location.protocol === "file:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorEl.hidden = true;

    if (!form.reportValidity()) return;

    var result = fillHiddenFields(currentRole());
    var body = new URLSearchParams(new FormData(form)).toString();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Status " + res.status);
        showThanks(result);
      })
      .catch(function (err) {
        if (isLocalPreview()) {
          // Netlify is not running locally, so show the result page
          // and log what would have been sent.
          console.info("Local preview: form not sent. Payload:", body);
          showThanks(result);
          return;
        }
        console.error(err);
        showError("Your intake was not sent. Check your connection and select Submit intake again.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit intake";
      });
  });

  /* ---------- Start another ---------- */

  document.getElementById("reset-btn").addEventListener("click", function () {
    form.reset();
    syncScorecards();
    updateProgress();
    thanks.hidden = true;
    form.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Wire up ---------- */

  form.addEventListener("change", function (event) {
    if (event.target.name === "role") syncScorecards();
    updateProgress();
  });
  form.addEventListener("input", updateProgress);

  syncScorecards();
  updateProgress();
})();
