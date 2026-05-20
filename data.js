// Initial default program data parsed from "Shivansh Pull Up Program - Sheet1.csv"
const defaultProgram = [
  {
    week: "5/18/2026",
    goal: "Build familiarity with the pull up and set a baseline for consistency.",
    workouts: {
      "Day 1": [
        {
          id: "w1d1a",
          letter: "A",
          name: "Bent over row (dumbbell or barbell)",
          sets: 3,
          reps: "8 reps",
          instructions: "Moderate challenge",
          type: "weight"
        },
        {
          id: "w1d1b",
          letter: "B",
          name: "Banded pull ups",
          sets: 3,
          reps: "5 reps",
          instructions: "Use sufficient band tension that the last rep is challenging, but you can get full range of motion.",
          type: "band"
        }
      ],
      "Day 2": [
        {
          id: "w1d2a",
          letter: "A",
          name: "Banded face pulls and pull downs",
          sets: 2,
          reps: "15 reps",
          instructions: "2 sets of 15 reps each of banded face pulls and pull downs",
          type: "band"
        },
        {
          id: "w1d2b",
          letter: "B",
          name: "Top of pull up hold & negative",
          sets: 3,
          reps: "3 reps",
          instructions: "Top of pull up hold for 3 seconds then 2 second negative. Stand on a box for support but try to use your legs as little as possible as you hold your chin over the bar for the entire three seconds, then a slow negative. Stand back up and repeat three times.",
          type: "hold"
        }
      ],
      "Day 3": [
        {
          id: "w1d3a",
          letter: "A",
          name: "Active hang",
          sets: 2,
          reps: "30s hold",
          instructions: "Pull down with the scaps, feel the activation in the back of your shoulder.",
          type: "hold"
        },
        {
          id: "w1d3b",
          letter: "B",
          name: "Rings rows",
          sets: 3,
          reps: "Near failure",
          instructions: "Near failure (1 rep in reserve). Between sets, hold a 30s plank, then rest another 30s to 1min.",
          type: "reps"
        }
      ]
    },
    notes: "Used 2 Red bands for assistance."
  },
  {
    week: "5/25/2026",
    goal: "Starting to ramp up pulling volume, locking in consistency with hitting three days per week.",
    workouts: {
      "Day 1": [
        {
          id: "w2d1a",
          letter: "A",
          name: "Bent over row (dumbbell or barbell)",
          sets: 3,
          reps: "8 reps",
          instructions: "Go up 5-10# from last week.",
          type: "weight"
        },
        {
          id: "w2d1b",
          letter: "B",
          name: "Banded pull ups",
          sets: 3,
          reps: "6 reps",
          instructions: "Same band tension as last week.",
          type: "band"
        }
      ],
      "Day 2": [
        {
          id: "w2d2a",
          letter: "A",
          name: "Banded face pulls and pull downs",
          sets: 2,
          reps: "15 reps",
          instructions: "2 sets of 15 reps each of banded face pulls and pull downs",
          type: "band"
        },
        {
          id: "w2d2b",
          letter: "B",
          name: "Top of pull up hold & negative",
          sets: 3,
          reps: "3 reps",
          instructions: "Top of pull up hold for 3 seconds then 3 second negative.",
          type: "hold"
        }
      ],
      "Day 3": [
        {
          id: "w2d3a",
          letter: "A",
          name: "Active hang",
          sets: 2,
          reps: "35s hold",
          instructions: "Pull down with the scaps, feel the activation in the back of your shoulder.",
          type: "hold"
        },
        {
          id: "w2d3b",
          letter: "B",
          name: "Rings rows",
          sets: 3,
          reps: "Near failure",
          instructions: "Near failure (1 rep in reserve). Between sets, hold a 35s plank, then rest another 30s to 1min.",
          type: "reps"
        }
      ]
    },
    notes: ""
  },
  {
    week: "6/1/2026",
    goal: "Balance continuing to increase pulling volume with starting to touch more difficult, less rep pulls.",
    workouts: {
      "Day 1": [
        {
          id: "w3d1a",
          letter: "A",
          name: "Bent over row (dumbbell or barbell)",
          sets: 4,
          reps: "5 reps",
          instructions: "Same moderate challenge, but with higher weight.",
          type: "weight"
        },
        {
          id: "w3d1b",
          letter: "B",
          name: "Banded pull ups",
          sets: 3,
          reps: "3 reps",
          instructions: "Less band tension - make these difficult.",
          type: "band"
        }
      ],
      "Day 2": [
        {
          id: "w3d2a",
          letter: "A",
          name: "Banded face pulls and pull downs",
          sets: 2,
          reps: "15 reps",
          instructions: "2 sets of 15 reps each of banded face pulls and pull downs",
          type: "band"
        },
        {
          id: "w3d2b",
          letter: "B",
          name: "Top of pull up hold & negative",
          sets: 3,
          reps: "3 reps",
          instructions: "Top of pull up hold for 4 seconds then 3 second negative.",
          type: "hold"
        }
      ],
      "Day 3": [
        {
          id: "w3d3a",
          letter: "A",
          name: "Active hang",
          sets: 1,
          reps: "45s hold",
          instructions: "Pull down with the scaps, feel the activation in the back of your shoulder.",
          type: "hold"
        },
        {
          id: "w3d3b",
          letter: "B",
          name: "Rings rows",
          sets: 4,
          reps: "Reps",
          instructions: "Four sets of rings rows to less than failure (2-3 reps in reserve). Between sets, hold a 30s plank, then rest another 30s to 1min.",
          type: "reps"
        }
      ]
    },
    notes: ""
  },
  {
    week: "6/8/2026",
    goal: "Balance continuing to increase pulling volume with starting to touch more difficult, less rep pulls.",
    workouts: {
      "Day 1": [
        {
          id: "w4d1a",
          letter: "A",
          name: "Bent over row (dumbbell or barbell)",
          sets: 4,
          reps: "5 reps",
          instructions: "Go up 5-10# from last week.",
          type: "weight"
        },
        {
          id: "w4d1b",
          letter: "B",
          name: "Banded pull ups",
          sets: 3,
          reps: "3 reps",
          instructions: "Less band tension - make these difficult.",
          type: "band"
        }
      ],
      "Day 2": [
        {
          id: "w4d2a",
          letter: "A",
          name: "Banded face pulls and pull downs",
          sets: 2,
          reps: "15 reps",
          instructions: "2 sets of 15 reps each of banded face pulls and pull downs",
          type: "band"
        },
        {
          id: "w4d2b",
          letter: "B",
          name: "Top of pull up hold & negative",
          sets: 3,
          reps: "3 reps",
          instructions: "Top of pull up hold for 4 seconds then 3 second negative.",
          type: "hold"
        }
      ],
      "Day 3": [
        {
          id: "w4d3a",
          letter: "A",
          name: "Active hang",
          sets: 1,
          reps: "50s hold",
          instructions: "Pull down with the scaps, feel the activation in the back of your shoulder.",
          type: "hold"
        },
        {
          id: "w4d3b",
          letter: "B",
          name: "Rings rows",
          sets: 4,
          reps: "Reps",
          instructions: "Four sets of rings rows to less than failure (2-3 reps in reserve). Between sets, hold a 30s plank, then rest another 30s to 1min.",
          type: "reps"
        }
      ]
    },
    notes: ""
  },
  {
    week: "6/15/2026",
    goal: "Check in and retest",
    workouts: {
      "Day 1": [],
      "Day 2": [],
      "Day 3": []
    },
    notes: ""
  }
];
