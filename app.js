document.addEventListener("DOMContentLoaded", () => {
  
  // Safe shadowed localStorage wrapper with In-Memory fallback for private/incognito modes
  const localStorage = (() => {
    let isSupported = false;
    try {
      const testKey = "__storage_test__";
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      isSupported = true;
    } catch (e) {
      isSupported = false;
    }

    const inMemoryStorage = {};

    return {
      getItem(key) {
        if (isSupported) {
          try {
            return window.localStorage.getItem(key);
          } catch (e) {}
        }
        return inMemoryStorage.hasOwnProperty(key) ? inMemoryStorage[key] : null;
      },
      setItem(key, value) {
        if (isSupported) {
          try {
            window.localStorage.setItem(key, value);
            return;
          } catch (e) {}
        }
        inMemoryStorage[key] = String(value);
      },
      removeItem(key) {
        if (isSupported) {
          try {
            window.localStorage.removeItem(key);
            return;
          } catch (e) {}
        }
        delete inMemoryStorage[key];
      },
      clear() {
        if (isSupported) {
          try {
            window.localStorage.clear();
            return;
          } catch (e) {}
        }
        for (const key in inMemoryStorage) {
          delete inMemoryStorage[key];
        }
      }
    };
  })();
  
  // 1. STATE INITIALIZATION
  let program = [];
  let loggedStats = {};
  let notesData = {};
  let currentWeekIndex = 0;
  let activeDay = "Day 1";
  
  const LOCAL_STORAGE_PROGRAM = "shivansh_workout_program_v2";
  const LOCAL_STORAGE_LOGS = "shivansh_workout_logs_v2";
  const LOCAL_STORAGE_NOTES = "shivansh_workout_notes_v2";
  const LOCAL_STORAGE_ACTIVE_WEEK = "shivansh_workout_active_week_v2";
  const LOCAL_STORAGE_ACTIVE_DAY = "shivansh_workout_active_day_v2";
  
  // Load data from localStorage or fall back to defaultProgram (from data.js)
  function initData() {
    const savedProgram = localStorage.getItem(LOCAL_STORAGE_PROGRAM);
    const savedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS);
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_NOTES);
    
    if (savedProgram && savedProgram !== "null" && savedProgram !== "undefined") {
      try {
        program = JSON.parse(savedProgram);
        if (!Array.isArray(program) || program.length === 0) {
          program = [...defaultProgram];
        }
      } catch (e) {
        program = [...defaultProgram];
      }
    } else {
      program = [...defaultProgram];
      localStorage.setItem(LOCAL_STORAGE_PROGRAM, JSON.stringify(program));
    }
    
    if (savedLogs && savedLogs !== "null" && savedLogs !== "undefined") {
      try {
        loggedStats = JSON.parse(savedLogs);
        if (typeof loggedStats !== "object" || loggedStats === null) {
          loggedStats = {};
        }
      } catch (e) {
        loggedStats = {};
      }
    } else {
      loggedStats = {};
    }
    
    if (savedNotes && savedNotes !== "null" && savedNotes !== "undefined") {
      try {
        notesData = JSON.parse(savedNotes);
        if (typeof notesData !== "object" || notesData === null) {
          notesData = {};
        }
      } catch (e) {
        notesData = {};
      }
    } else {
      notesData = {};
    }
    
    // Auto-select week based on date (May 20, 2026 falls in Week 1: 5/18/2026)
    const savedActiveWeek = localStorage.getItem(LOCAL_STORAGE_ACTIVE_WEEK);
    if (savedActiveWeek !== null && savedActiveWeek !== "null" && savedActiveWeek !== "undefined") {
      currentWeekIndex = parseInt(savedActiveWeek);
      if (isNaN(currentWeekIndex) || currentWeekIndex < 0 || !program || currentWeekIndex >= program.length) {
        currentWeekIndex = 0;
      }
    } else {
      currentWeekIndex = determineCurrentWeek();
    }
    
    const savedActiveDay = localStorage.getItem(LOCAL_STORAGE_ACTIVE_DAY);
    if (savedActiveDay && savedActiveDay !== "null" && savedActiveDay !== "undefined") {
      activeDay = savedActiveDay;
    } else {
      activeDay = "Day 1";
    }
  }
  
  // Helper to determine the week index based on today's date
  function determineCurrentWeek() {
    // Current local time: 2026-05-20 (May 20, 2026)
    const today = new Date("2026-05-20");
    if (!program || !Array.isArray(program)) return 0;
    
    for (let i = 0; i < program.length; i++) {
      const weekDateStr = program[i].week;
      const weekDate = new Date(weekDateStr);
      
      // Calculate start of next week date
      const nextWeekDate = new Date(weekDate);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      
      if (today >= weekDate && today < nextWeekDate) {
        return i;
      }
    }
    return 0; // Default to Week 1
  }

  // 2. DOM ELEMENTS
  const weekTabsContainer = document.getElementById("week-tabs");
  const dayTabs = document.querySelectorAll(".day-tab");
  const selectedWeekTitle = document.getElementById("selected-week-title");
  const selectedWeekGoal = document.getElementById("selected-week-goal");
  const workoutContentArea = document.getElementById("workout-content-area");
  const emptyStateView = document.getElementById("empty-state-view");
  const notesTextarea = document.getElementById("week-notes-textarea");
  const notesSaveStatus = document.getElementById("notes-save-status");
  const overallPercentageEl = document.getElementById("overall-percentage");
  const overallProgressCircle = document.getElementById("overall-progress-circle");
  const csvFileInput = document.getElementById("csv-file-input");
  const csvDropZone = document.getElementById("csv-drop-zone");
  const uploadStatusIndicator = document.getElementById("upload-status-indicator");
  const uploadStatusMsg = document.getElementById("upload-status-msg");
  const btnResetData = document.getElementById("btn-reset-data");
  
  // 3. CORE RENDERING ENGINE
  
  // Render Week Timeline Tabs
  function renderWeekTabs() {
    weekTabsContainer.innerHTML = "";
    program.forEach((w, index) => {
      const tabButton = document.createElement("button");
      tabButton.className = `week-tab ${index === currentWeekIndex ? "active" : ""}`;
      
      // Calculate completion rate of this week
      const completionRate = calculateWeekCompletionRate(w);
      const isCompleted = completionRate === 100;
      
      tabButton.innerHTML = `
        <span class="week-num">W${index + 1}</span>
        <span class="week-date">${w.week.split('/')[0]}/${w.week.split('/')[1]}</span>
        ${isCompleted ? '<span class="week-complete-badge">✓</span>' : `<span class="week-progress-indicator">${Math.round(completionRate)}%</span>`}
      `;
      
      tabButton.addEventListener("click", () => {
        currentWeekIndex = index;
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_WEEK, currentWeekIndex);
        
        // Refresh view
        updateActiveWeekUI();
      });
      
      weekTabsContainer.appendChild(tabButton);
    });
  }
  
  // Calculate completion percentage for a specific week
  function calculateWeekCompletionRate(weekObj) {
    let totalSets = 0;
    let completedSets = 0;
    const weekDate = weekObj.week;
    
    const days = ["Day 1", "Day 2", "Day 3"];
    days.forEach(day => {
      const exercises = weekObj.workouts[day] || [];
      exercises.forEach(ex => {
        totalSets += ex.sets;
        const setLogs = loggedStats[weekDate]?.[day]?.[ex.id] || [];
        setLogs.forEach(set => {
          if (set && set.completed) {
            completedSets++;
          }
        });
      });
    });
    
    if (totalSets === 0) return 0;
    return (completedSets / totalSets) * 100;
  }
  
  // Update UI for the Active Week
  function updateActiveWeekUI() {
    // 1. Highlight active week tab
    const tabs = document.querySelectorAll(".week-tab");
    tabs.forEach((tab, index) => {
      if (index === currentWeekIndex) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
    
    const currentWeekData = program[currentWeekIndex];
    selectedWeekTitle.innerText = `Week ${currentWeekIndex + 1} (${currentWeekData.week})`;
    selectedWeekGoal.innerText = `Goal: ${currentWeekData.goal || 'No goal set'}`;
    
    // 2. Load custom notes for this week
    const savedNotes = notesData[currentWeekData.week];
    if (savedNotes !== undefined) {
      notesTextarea.value = savedNotes;
    } else {
      notesTextarea.value = currentWeekData.notes || "";
    }
    
    // 3. Render the workout day logging view
    renderWorkoutDay();
    
    // 4. Update overall metrics
    updateOverallProgress();
  }
  
  // Render Workout for the active Day (Day 1 / 2 / 3)
  function renderWorkoutDay() {
    const currentWeekData = program[currentWeekIndex];
    const exercises = currentWeekData.workouts[activeDay] || [];
    const weekDate = currentWeekData.week;
    
    workoutContentArea.innerHTML = "";
    
    if (exercises.length === 0) {
      workoutContentArea.classList.add("hidden");
      emptyStateView.classList.remove("hidden");
      return;
    }
    
    workoutContentArea.classList.remove("hidden");
    emptyStateView.classList.add("hidden");
    
    exercises.forEach(ex => {
      const exerciseCard = document.createElement("div");
      exerciseCard.className = "exercise-card";
      
      // Instructions parser (subtle bold text for letter prefixes)
      let formattedInstructions = ex.instructions || "";
      if (formattedInstructions.startsWith("A:") || formattedInstructions.startsWith("B:")) {
        formattedInstructions = formattedInstructions.substring(2).trim();
      }
      
      exerciseCard.innerHTML = `
        <div class="ex-header">
          <span class="ex-badge">${ex.letter}</span>
          <div class="ex-meta">
            <h3>${ex.name}</h3>
            <p class="ex-target">${ex.sets} sets x ${ex.reps} ${ex.type ? `• ${ex.type.toUpperCase()}` : ""}</p>
          </div>
        </div>
        <p class="ex-instructions">${formattedInstructions}</p>
        
        <div class="sets-table" id="sets-container-${ex.id}">
          <!-- Sets rows go here -->
        </div>
      `;
      
      workoutContentArea.appendChild(exerciseCard);
      
      // Populate sets rows
      const setsContainer = document.getElementById(`sets-container-${ex.id}`);
      const setLogs = loggedStats[weekDate]?.[activeDay]?.[ex.id] || [];
      
      for (let s = 0; s < ex.sets; s++) {
        const setRow = document.createElement("div");
        setRow.className = "set-row";
        
        const setLog = setLogs[s] || { completed: false, reps: "", weight: "", band: "" };
        const isChecked = setLog.completed;
        
        setRow.innerHTML = `
          <div class="set-meta-check">
            <button class="btn-check-circle ${isChecked ? "checked" : ""}" data-ex-id="${ex.id}" data-set-idx="${s}">
              <svg class="check-mark" viewBox="0 0 24 24" width="16" height="16">
                <path fill="none" stroke="currentColor" stroke-width="3" d="M5 12l5 5L20 7"/>
              </svg>
            </button>
            <span class="set-label">Set ${s + 1}</span>
          </div>
          
          <div class="set-inputs">
            ${getInputFieldsForType(ex.type, ex.id, s, setLog)}
          </div>
        `;
        
        setsContainer.appendChild(setRow);
      }
    });
    
    // Attach event listeners for checkoff buttons & inputs inside workout cards
    attachWorkoutEvents();
  }
  
  // Helper to generate custom inputs based on type
  function getInputFieldsForType(type, exId, setIdx, setLog) {
    if (type === "weight") {
      return `
        <div class="input-wrapper">
          <input type="number" class="set-field-input" data-field="weight" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.weight || ''}" placeholder="--">
          <span class="field-unit">lbs</span>
        </div>
        <div class="input-wrapper">
          <input type="number" class="set-field-input" data-field="reps" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.reps || ''}" placeholder="--">
          <span class="field-unit">reps</span>
        </div>
      `;
    } else if (type === "band") {
      return `
        <div class="input-wrapper band-wrapper">
          <input type="text" class="set-field-input text-input" data-field="band" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.band || ''}" placeholder="Band color/ tension">
        </div>
        <div class="input-wrapper">
          <input type="number" class="set-field-input" data-field="reps" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.reps || ''}" placeholder="--">
          <span class="field-unit">reps</span>
        </div>
      `;
    } else if (type === "hold") {
      return `
        <div class="input-wrapper">
          <input type="number" class="set-field-input" data-field="reps" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.reps || ''}" placeholder="--">
          <span class="field-unit">sec</span>
        </div>
        <div class="input-wrapper reps-wrapper">
          <span class="single-label">Hold</span>
        </div>
      `;
    } else {
      // Default: reps and optional notes
      return `
        <div class="input-wrapper">
          <input type="text" class="set-field-input text-input" data-field="reps" data-ex-id="${exId}" data-set-idx="${setIdx}" value="${setLog.reps || ''}" placeholder="Reps / Notes">
        </div>
      `;
    }
  }
  
  // Attach events to active checkoff buttons & log inputs
  function attachWorkoutEvents() {
    const currentWeekData = program[currentWeekIndex];
    const weekDate = currentWeekData.week;
    
    // Checkoff buttons
    const checkBtns = document.querySelectorAll(".btn-check-circle");
    checkBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const exId = btn.getAttribute("data-ex-id");
        const setIdx = parseInt(btn.getAttribute("data-set-idx"));
        
        btn.classList.toggle("checked");
        const isChecked = btn.classList.contains("checked");
        
        // Update state
        ensureLogPath(weekDate, activeDay, exId);
        if (!loggedStats[weekDate][activeDay][exId][setIdx]) {
          loggedStats[weekDate][activeDay][exId][setIdx] = { completed: false, reps: "", weight: "", band: "" };
        }
        
        loggedStats[weekDate][activeDay][exId][setIdx].completed = isChecked;
        
        // Save & Sync Progress UI
        saveLogs();
        updateOverallProgress();
        renderWeekTabs(); // Refresh completion stats on tabs
      });
    });
    
    // Input Fields
    const fieldInputs = document.querySelectorAll(".set-field-input");
    fieldInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        const field = input.getAttribute("data-field");
        const exId = input.getAttribute("data-ex-id");
        const setIdx = parseInt(input.getAttribute("data-set-idx"));
        const val = input.value;
        
        ensureLogPath(weekDate, activeDay, exId);
        if (!loggedStats[weekDate][activeDay][exId][setIdx]) {
          loggedStats[weekDate][activeDay][exId][setIdx] = { completed: false, reps: "", weight: "", band: "" };
        }
        
        loggedStats[weekDate][activeDay][exId][setIdx][field] = val;
        
        // Auto-check set if they type performance but haven't checked it yet (convenience)
        if (val && !loggedStats[weekDate][activeDay][exId][setIdx].completed) {
          loggedStats[weekDate][activeDay][exId][setIdx].completed = true;
          const correspondingCheckBtn = document.querySelector(`.btn-check-circle[data-ex-id="${exId}"][data-set-idx="${setIdx}"]`);
          if (correspondingCheckBtn) {
            correspondingCheckBtn.classList.add("checked");
          }
        }
        
        saveLogs();
        updateOverallProgress();
        renderWeekTabs();
      });
    });
  }
  
  // Safe helper to build log object paths
  function ensureLogPath(weekDate, day, exId) {
    if (!loggedStats[weekDate]) loggedStats[weekDate] = {};
    if (!loggedStats[weekDate][day]) loggedStats[weekDate][day] = {};
    if (!loggedStats[weekDate][day][exId]) loggedStats[weekDate][day][exId] = [];
  }
  
  // 4. OVERALL METRICS CALCULATIONS
  function updateOverallProgress() {
    let grandTotalSets = 0;
    let grandCompletedSets = 0;
    
    program.forEach(w => {
      const weekDate = w.week;
      const days = ["Day 1", "Day 2", "Day 3"];
      days.forEach(day => {
        const exercises = w.workouts[day] || [];
        exercises.forEach(ex => {
          grandTotalSets += ex.sets;
          const setLogs = loggedStats[weekDate]?.[day]?.[ex.id] || [];
          setLogs.forEach(set => {
            if (set && set.completed) {
              grandCompletedSets++;
            }
          });
        });
      });
    });
    
    let percentage = 0;
    if (grandTotalSets > 0) {
      percentage = Math.round((grandCompletedSets / grandTotalSets) * 100);
    }
    
    // Update text
    overallPercentageEl.innerText = `${percentage}%`;
    
    // Update SVG Circle Path (Circumference ~ 213.6)
    const circumference = 213.6;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    overallProgressCircle.style.strokeDashoffset = strokeDashoffset;
  }
  
  // Save logged stats
  function saveLogs() {
    localStorage.setItem(LOCAL_STORAGE_LOGS, JSON.stringify(loggedStats));
    triggerCloudSave();
  }
  
  // Notes auto-saving engine (Debounced on keystrokes)
  let notesSaveTimeout = null;
  notesTextarea.addEventListener("input", () => {
    notesSaveStatus.innerText = "Saving...";
    notesSaveStatus.classList.add("saving");
    
    clearTimeout(notesSaveTimeout);
    notesSaveTimeout = setTimeout(() => {
      const weekDate = program[currentWeekIndex].week;
      notesData[weekDate] = notesTextarea.value;
      localStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(notesData));
      triggerCloudSave();
      
      notesSaveStatus.innerText = "Saved";
      notesSaveStatus.classList.remove("saving");
    }, 800); // 800ms debounce
  });
  
  // Day tabs clicking
  dayTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      dayTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      activeDay = tab.getAttribute("data-day");
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_DAY, activeDay);
      
      renderWorkoutDay();
    });
  });
  
  // Reset program data button
  btnResetData.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all your workout completion logs, notes, and uploaded CSV? This cannot be undone.")) {
      localStorage.clear();
      initData();
      renderWeekTabs();
      updateActiveWeekUI();
      
      uploadStatusIndicator.classList.add("hidden");
      
      // Let it flash green success
      alert("All training data successfully reset!");
    }
  });

  // 5. DRAG AND DROP SPREADSHEET PARSER (Dynamic CSV Uploads)
  
  // Trigger file browser click
  csvDropZone.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") {
      csvFileInput.click();
    }
  });
  
  // Drag highlight effects
  ["dragenter", "dragover"].forEach(eventName => {
    csvDropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      csvDropZone.classList.add("drag-hover");
    }, false);
  });
  
  ["dragleave", "drop"].forEach(eventName => {
    csvDropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      csvDropZone.classList.remove("drag-hover");
    }, false);
  });
  
  // Drop CSV handling
  csvDropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0 && files[0].name.endsWith(".csv")) {
      handleCSVFile(files[0]);
    } else {
      showUploadStatus("Please upload a valid .csv file!", false);
    }
  });
  
  // File Input Selection
  csvFileInput.addEventListener("change", (e) => {
    const files = csvFileInput.files;
    if (files.length > 0) {
      handleCSVFile(files[0]);
    }
  });
  
  // Process the uploaded CSV
  function handleCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const csvText = e.target.result;
      try {
        const parsedProgram = parseCSVToProgram(csvText);
        
        if (parsedProgram && parsedProgram.length > 0) {
          // Success! Update local state
          program = parsedProgram;
          localStorage.setItem(LOCAL_STORAGE_PROGRAM, JSON.stringify(program));
          
          // Re-initialize Active Week to first week
          currentWeekIndex = 0;
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_WEEK, 0);
          
          triggerCloudSave();
          
          // Rerender layout
          renderWeekTabs();
          updateActiveWeekUI();
          
          showUploadStatus("Spreadsheet synced successfully!", true);
        } else {
          showUploadStatus("Could not parse schedule. Check file format.", false);
        }
      } catch (err) {
        showUploadStatus("Parsing error: " + err.message, false);
      }
    };
    reader.readAsText(file);
  }
  
  function showUploadStatus(msg, isSuccess) {
    uploadStatusIndicator.classList.remove("hidden");
    const statusDot = uploadStatusIndicator.querySelector(".status-dot");
    
    if (isSuccess) {
      statusDot.className = "status-dot green";
      uploadStatusMsg.innerText = msg;
    } else {
      statusDot.className = "status-dot red";
      uploadStatusMsg.innerText = msg;
    }
    
    // Auto-hide error status after 5 seconds, keep success
    if (!isSuccess) {
      setTimeout(() => {
        uploadStatusIndicator.classList.add("hidden");
      }, 5000);
    }
  }

  // Robust parsing of CSV text to create custom workout schedule data structure
  function parseCSVToProgram(csvText) {
    let parsedResult;
    
    // Use PapaParse if loaded
    if (typeof Papa !== "undefined") {
      parsedResult = Papa.parse(csvText, { skipEmptyLines: true });
    } else {
      // Fallback simple manual line parser
      const lines = csvText.split(/\r?\n/);
      const data = lines.map(line => {
        // Basic split by commas that handles double quotes roughly
        const result = [];
        let currentCell = "";
        let inQuotes = false;
        for (let idx = 0; idx < line.length; idx++) {
          const char = line[idx];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(currentCell);
            currentCell = "";
          } else {
            currentCell += char;
          }
        }
        result.push(currentCell);
        return result;
      });
      parsedResult = { data };
    }
    
    const rows = parsedResult.data;
    const newProgram = [];
    
    for (let i = 0; i < rows.length; i++) {
      const firstCell = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (firstCell.toLowerCase().includes("week")) {
        // Found Week row
        const weekDate = rows[i][1] ? rows[i][1].toString().trim() : "";
        if (!weekDate) continue;
        
        const weekObj = {
          week: weekDate,
          goal: "",
          workouts: { "Day 1": [], "Day 2": [], "Day 3": [] },
          notes: ""
        };
        
        // Scan next rows to populate this week
        let j = i + 1;
        while (j < rows.length) {
          const nextFirstCell = rows[j][0] ? rows[j][0].toString().trim() : "";
          
          // Stop if next week row is hit
          if (nextFirstCell.toLowerCase().includes("week")) {
            break;
          }
          
          if (nextFirstCell.toLowerCase().includes("pull up program")) {
            weekObj.goal = rows[j][1] ? rows[j][1].toString().trim() : "";
            
            // Read Day 1, Day 2, Day 3 workouts from columns 2, 3, 4
            const days = ["Day 1", "Day 2", "Day 3"];
            for (let dayIdx = 0; dayIdx < 3; dayIdx++) {
              const workoutText = rows[j][dayIdx + 2];
              if (workoutText) {
                weekObj.workouts[days[dayIdx]] = parseWorkoutCellText(workoutText, weekDate, days[dayIdx]);
              }
            }
          } else if (nextFirstCell.toLowerCase().includes("notes")) {
            weekObj.notes = rows[j][2] ? rows[j][2].toString().trim() : "";
          }
          
          j++;
        }
        
        newProgram.push(weekObj);
        i = j - 1; // Advance outer loop
      }
    }
    
    return newProgram;
  }
  
  // Parses a workout string (e.g. Day 1: "A: Bent Row... \n\n B: Pull Up...") into separate exercise objects
  function parseWorkoutCellText(cellText, weekDate, dayName) {
    const exercises = [];
    if (!cellText) return exercises;
    
    cellText = cellText.toString().replace(/\r\n/g, "\n");
    
    // Find index markers of A: and B:
    const aIndex = cellText.search(/[Aa][:\.]/);
    const bIndex = cellText.search(/[Bb][:\.]/);
    
    let aText = "";
    let bText = "";
    
    if (aIndex !== -1 && bIndex !== -1) {
      aText = cellText.substring(aIndex + 2, bIndex).trim();
      bText = cellText.substring(bIndex + 2).trim();
    } else if (aIndex !== -1) {
      aText = cellText.substring(aIndex + 2).trim();
    } else {
      // Fallback: Split by double newlines
      const parts = cellText.split(/\n\n+/);
      aText = parts[0] ? parts[0].trim() : "";
      bText = parts[1] ? parts[1].trim() : "";
    }
    
    // Unique base ID for exercises
    const weekClean = weekDate.replace(/\//g, "");
    const dayClean = dayName.replace(/\s+/g, "").toLowerCase();
    
    if (aText) {
      exercises.push(interpretWorkoutSentence(aText, "A", `${weekClean}_${dayClean}_a`));
    }
    if (bText) {
      exercises.push(interpretWorkoutSentence(bText, "B", `${weekClean}_${dayClean}_b`));
    }
    
    return exercises;
  }
  
  // Interprets a single exercise text sentence to extract name, sets count, reps, and instructions
  function interpretWorkoutSentence(text, letter, exId) {
    let sets = 3; // Default sets count
    let reps = "8 reps"; // Default reps description
    let type = "weight"; // Default exercise category
    
    // Extract sets count
    let setsMatch = text.match(/(\d+)\s*sets?/i);
    if (setsMatch) {
      sets = parseInt(setsMatch[1]);
    } else {
      // Check for e.g. "3 x 5" structure
      let xMatch = text.match(/(\d+)\s*x\s*(\d+)/i);
      if (xMatch) {
        sets = parseInt(xMatch[1]);
        reps = xMatch[2] + " reps";
      }
    }
    
    // Extract reps/hold values
    let repsMatch = text.match(/(\d+)\s*reps?/i) || text.match(/(\d+)\s*s\b/i) || text.match(/near\s*failure/i);
    if (repsMatch) {
      reps = repsMatch[0];
    }
    
    // Determine category type
    const lowerText = text.toLowerCase();
    if (lowerText.includes("band") || lowerText.includes("assist")) {
      type = "band";
    } else if (lowerText.includes("hold") || lowerText.includes("active hang") || lowerText.includes("plank")) {
      type = "hold";
    } else if (lowerText.includes("row") || lowerText.includes("dumbbell") || lowerText.includes("barbell")) {
      type = "weight";
    } else {
      type = "reps";
    }
    
    // Clean up exercise name by removing set/rep numbers
    let name = text;
    name = name.replace(/\d+\s*sets?\s*(of)?\s*\d+\s*reps?/i, "");
    name = name.replace(/\d+\s*sets?\s*each\s*of\s*\d+\s*reps?/i, "");
    name = name.replace(/\d+\s*sets?,\s*\d+\s*reps?\s*per\s*set/i, "");
    name = name.replace(/\d+\s*sets?\s*of\s*\d+s\s*active\s*hang/i, "Active hang");
    name = name.replace(/\(\d+\s*x\s*\d+\)/g, "");
    name = name.replace(/^\s*\d+\s*sets?\s*each\s*of\s*\d+\s*reps?\s*each\s*of\s*/i, "");
    name = name.replace(/^\s*three\s*sets\s*of\s*/i, "");
    name = name.replace(/^\s*four\s*sets\s*of\s*/i, "");
    name = name.replace(/^\s*\d+\s*sets?\s*of\s*/i, "");
    
    const sentences = name.split(/[\.\n]/);
    let cleanName = sentences[0].trim();
    let instructions = sentences.slice(1).join(".").trim();
    
    if (cleanName.toLowerCase().startsWith("of ")) {
      cleanName = cleanName.substring(3).trim();
    }
    
    if (cleanName) {
      cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    } else {
      cleanName = "Exercise " + letter;
    }
    
    // If name contains sets info that wasn't stripped, fall back cleanly
    if (cleanName.length > 60) {
      // Split by commas
      const commaParts = cleanName.split(",");
      if (commaParts.length > 1 && (commaParts[0].includes("set") || commaParts[0].includes("x"))) {
        cleanName = commaParts.slice(1).join(",").trim();
      }
    }
    
    return {
      id: exId,
      letter: letter,
      name: cleanName,
      sets: sets,
      reps: reps,
      instructions: instructions || text,
      type: type
    };
  }

  // 5.5 GITHUB GIST CLOUD SYNC ENGINE
  const LOCAL_STORAGE_GITHUB_TOKEN = "shivansh_github_token";
  const LOCAL_STORAGE_GIST_ID = "shivansh_gist_id";
  const GIST_FILE_NAME = "pullup_progressor_sync.json";

  const githubTokenInput = document.getElementById("github-token-input");
  const btnToggleTokenVisibility = document.getElementById("btn-toggle-token-visibility");
  const btnSaveToken = document.getElementById("btn-save-token");
  const cloudSyncStatusBadge = document.getElementById("cloud-sync-status-badge");
  const cloudStatusIndicator = document.getElementById("cloud-status-indicator");
  const cloudStatusDot = document.getElementById("cloud-status-dot");
  const cloudStatusMsg = document.getElementById("cloud-status-msg");

  let githubToken = localStorage.getItem(LOCAL_STORAGE_GITHUB_TOKEN) || "";
  let gistId = localStorage.getItem(LOCAL_STORAGE_GIST_ID) || "";
  let cloudSyncTimeout = null;

  // Initialize UI with saved token if available
  if (githubToken && githubTokenInput) {
    githubTokenInput.value = githubToken;
  }

  // Toggle Visibility of the Token Input
  if (btnToggleTokenVisibility && githubTokenInput) {
    btnToggleTokenVisibility.addEventListener("click", () => {
      if (githubTokenInput.type === "password") {
        githubTokenInput.type = "text";
      } else {
        githubTokenInput.type = "password";
      }
    });
  }

  // Connect/Save Token Action
  if (btnSaveToken) {
    btnSaveToken.addEventListener("click", () => {
      const enteredToken = githubTokenInput.value.trim();
      if (!enteredToken) {
        // Disconnect
        localStorage.removeItem(LOCAL_STORAGE_GITHUB_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_GIST_ID);
        githubToken = "";
        gistId = "";
        updateCloudStatusBadge("Disconnected", "disconnected");
        showCloudStatus("Disconnected from cloud", false);
        return;
      }
      
      githubToken = enteredToken;
      localStorage.setItem(LOCAL_STORAGE_GITHUB_TOKEN, githubToken);
      showCloudStatus("Connecting to GitHub...", null);
      updateCloudStatusBadge("Connecting...", "syncing");
      
      discoverOrCreateGist();
    });
  }

  // Helper to update the top status badge
  function updateCloudStatusBadge(text, className) {
    if (!cloudSyncStatusBadge) return;
    cloudSyncStatusBadge.innerText = text;
    cloudSyncStatusBadge.className = `status-badge ${className}`;
  }

  // Helper to show status logs in the sync card
  function showCloudStatus(msg, isSuccess) {
    if (!cloudStatusIndicator) return;
    cloudStatusIndicator.classList.remove("hidden");
    
    if (isSuccess === null) {
      cloudStatusDot.className = "status-dot orange"; // Loading
    } else if (isSuccess) {
      cloudStatusDot.className = "status-dot green";  // Success
    } else {
      cloudStatusDot.className = "status-dot red";    // Error
    }
    cloudStatusMsg.innerText = msg;

    // Auto-hide only if it's a static success/error state
    if (isSuccess !== null) {
      setTimeout(() => {
        cloudStatusIndicator.classList.add("hidden");
      }, 5000);
    }
  }

  // Discover if a sync Gist exists or create a new private one
  async function discoverOrCreateGist() {
    if (!githubToken) return;

    try {
      // Fetch user's Gists
      const response = await fetch("https://api.github.com/gists", {
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (!response.ok) {
        throw new Error("Invalid GitHub token or authentication failed.");
      }

      const gists = await response.json();
      
      // Look for our specific file in existing gists
      let foundGist = gists.find(gist => gist.files && gist.files[GIST_FILE_NAME]);

      if (foundGist) {
        // Found existing Gist! Save ID and pull data
        gistId = foundGist.id;
        localStorage.setItem(LOCAL_STORAGE_GIST_ID, gistId);
        showCloudStatus("Gist found! Pulling cloud logs...", null);
        await pullCloudData();
      } else {
        // None found, create a new private Gist
        showCloudStatus("Creating private Gist for sync...", null);
        await createNewGist();
      }
    } catch (err) {
      updateCloudStatusBadge("Sync Error", "error");
      showCloudStatus(err.message, false);
    }
  }

  // Create a new private Gist with initial local state
  async function createNewGist() {
    try {
      const initialPayload = gatherLocalState();
      
      const payload = {
        description: "Pull Up Progressor Sync File (Shivansh)",
        public: false, // Private Gist
        files: {
          [GIST_FILE_NAME]: {
            content: JSON.stringify(initialPayload, null, 2)
          }
        }
      };

      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to create Gist on GitHub.");
      }

      const createdGist = await response.json();
      gistId = createdGist.id;
      localStorage.setItem(LOCAL_STORAGE_GIST_ID, gistId);
      
      updateCloudStatusBadge("Connected", "connected");
      showCloudStatus("Cloud connected & synchronized!", true);
    } catch (err) {
      updateCloudStatusBadge("Sync Error", "error");
      showCloudStatus(err.message, false);
    }
  }

  // Pull cloud data from the Gist and load into app
  async function pullCloudData() {
    if (!githubToken || !gistId) return;

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve Gist data.");
      }

      const gist = await response.json();
      const rawContent = gist.files[GIST_FILE_NAME]?.content;
      
      if (!rawContent) {
        throw new Error("Gist sync file is empty.");
      }

      const cloudState = JSON.parse(rawContent);

      // Restore states to localStorage with safety checks
      if (cloudState.program && cloudState.program !== "null" && cloudState.program !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_PROGRAM, cloudState.program);
      }
      if (cloudState.logs && cloudState.logs !== "null" && cloudState.logs !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_LOGS, cloudState.logs);
      }
      if (cloudState.notes && cloudState.notes !== "null" && cloudState.notes !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_NOTES, cloudState.notes);
      }
      if (cloudState.activeWeek !== undefined && cloudState.activeWeek !== null && cloudState.activeWeek !== "null" && cloudState.activeWeek !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_WEEK, cloudState.activeWeek);
      }
      if (cloudState.activeDay && cloudState.activeDay !== "null" && cloudState.activeDay !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_DAY, cloudState.activeDay);
      }

      // Re-initialize local runtime states
      initData();
      renderWeekTabs();
      updateActiveWeekUI();

      updateCloudStatusBadge("Connected", "connected");
      showCloudStatus("Progress synced from Cloud!", true);
    } catch (err) {
      updateCloudStatusBadge("Sync Error", "error");
      showCloudStatus("Failed to sync from cloud: " + err.message, false);
    }
  }

  // Gathers current localStorage tracking states
  function gatherLocalState() {
    return {
      version: "shivansh_workout_v2_backup",
      timestamp: new Date().toISOString(),
      program: localStorage.getItem(LOCAL_STORAGE_PROGRAM),
      logs: localStorage.getItem(LOCAL_STORAGE_LOGS),
      notes: localStorage.getItem(LOCAL_STORAGE_NOTES),
      activeWeek: localStorage.getItem(LOCAL_STORAGE_ACTIVE_WEEK),
      activeDay: localStorage.getItem(LOCAL_STORAGE_ACTIVE_DAY)
    };
  }

  // Pushes current state up to Gist (Background Sync)
  async function pushCloudData() {
    if (!githubToken || !gistId) return;

    try {
      const activePayload = gatherLocalState();
      
      const payload = {
        files: {
          [GIST_FILE_NAME]: {
            content: JSON.stringify(activePayload, null, 2)
          }
        }
      };

      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Network save failed.");
      }

      updateCloudStatusBadge("Connected", "connected");
      showCloudStatus("Cloud auto-saved!", true);
    } catch (err) {
      updateCloudStatusBadge("Sync Error", "error");
      showCloudStatus("Cloud auto-save failed: " + err.message, false);
    }
  }

  // Debounced cloud saving trigger
  function triggerCloudSave() {
    if (!githubToken || !gistId) return; // Silent if offline

    updateCloudStatusBadge("Saving...", "syncing");
    
    clearTimeout(cloudSyncTimeout);
    cloudSyncTimeout = setTimeout(() => {
      pushCloudData();
    }, 1200); // 1.2s debounce to aggregate quick checkoff taps
  }

  // Auto-connect on page boot if token is already stored
  if (githubToken) {
    updateCloudStatusBadge("Syncing...", "syncing");
    if (gistId) {
      pullCloudData();
    } else {
      discoverOrCreateGist();
    }
  }

  // Focus-Activated Auto-Sync: automatically pull latest changes when tab gains focus or phone unlocks
  let lastFocusPullTime = Date.now();
  function triggerFocusPull() {
    if (!githubToken || !gistId) return;
    
    // Throttle pulls to once every 10 seconds to conserve battery and GitHub API rate limits
    if (Date.now() - lastFocusPullTime < 10000) return;
    lastFocusPullTime = Date.now();
    
    updateCloudStatusBadge("Syncing...", "syncing");
    pullCloudData();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      triggerFocusPull();
    }
  });

  window.addEventListener("focus", () => {
    triggerFocusPull();
  });

  // 6. INITIALIZATION TRIGGER
  initData();
  renderWeekTabs();
  updateActiveWeekUI();
});
