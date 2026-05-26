// Initial default program data parsed from "Shivansh Pull Up Program - Sheet1.csv"
const defaultProgram = [
  {
    "week": "5/18/2026",
    "goal": "Build familiarity with the pull up and set a baseline for consistency.",
    "nutrition": "Track grams of fruits and vegetables each day to get an average daily intake for the week.",
    "workouts": {
      "Day 1": [
        {
          "id": "w1d1a",
          "letter": "A",
          "name": "Bent over row (dumbbell or barbell)",
          "sets": 3,
          "reps": "8 reps",
          "instructions": "Moderate challenge",
          "type": "weight"
        },
        {
          "id": "w1d1b",
          "letter": "B",
          "name": "Banded pull ups",
          "sets": 3,
          "reps": "5 reps",
          "instructions": "Use sufficient band tension that the last rep is challenging, but you can get full range of motion.",
          "type": "band"
        }
      ],
      "Day 2": [
        {
          "id": "w1d2a",
          "letter": "A",
          "name": "Each of banded face pulls and pull downs",
          "sets": 2,
          "reps": "15 reps",
          "instructions": "A: 2 sets of 15 reps each of banded face pulls and pull downs",
          "type": "band"
        },
        {
          "id": "w1d2b",
          "letter": "B",
          "name": "then a slow negative",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "Stand back up and repeat three times)",
          "type": "hold"
        }
      ],
      "Day 3": [
        {
          "id": "w1d3a",
          "letter": "A",
          "name": "Active hang (pull down with the scaps, feel the activation in the back of your shoulder",
          "sets": 2,
          "reps": "30s hold",
          "instructions": "A: 2 sets of 30s active hang (pull down with the scaps, feel the activation in the back of your shoulder.",
          "type": "hold"
        },
        {
          "id": "w1d3b",
          "letter": "B",
          "name": "Three sets of rings rows to near failure (1 rep in reserve)",
          "sets": 3,
          "reps": "1 reps",
          "instructions": "Between sets, hold a 30s plank, then rest another 30s to 1min.",
          "type": "hold"
        }
      ]
    },
    "notes": "Used 2 Red bands for assistance."
  },
  {
    "week": "5/25/2026",
    "goal": "Starting to ramp up pulling volume, locking in consistency with hitting three days per week.",
    "nutrition": "Try and add 100g of fruits and vegetables compared to last week. This is especially helpful in the morning for breakfast (i.e. eat an apple, a large banana, etc. before leaving for work).",
    "workouts": {
      "Day 1": [
        {
          "id": "w2d1a",
          "letter": "A",
          "name": "Bent over row (dumbbell or barbell)",
          "sets": 3,
          "reps": "8 reps",
          "instructions": "Go up 5-10# from last week.",
          "type": "weight"
        },
        {
          "id": "w2d1b",
          "letter": "B",
          "name": "3 x 6 banded pull ups",
          "sets": 3,
          "reps": "6 reps",
          "instructions": "Same band tension as last week.",
          "type": "band"
        }
      ],
      "Day 2": [
        {
          "id": "w2d2a",
          "letter": "A",
          "name": "Each of banded face pulls and pull downs",
          "sets": 2,
          "reps": "15 reps",
          "instructions": "A: 2 sets of 15 reps each of banded face pulls and pull downs",
          "type": "band"
        },
        {
          "id": "w2d2b",
          "letter": "B",
          "name": ": Top of pull up hold for 3 seconds then 3 second negative",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "B: 3 sets of 3 reps: Top of pull up hold for 3 seconds then 3 second negative.",
          "type": "hold"
        }
      ],
      "Day 3": [
        {
          "id": "w2d3a",
          "letter": "A",
          "name": "Active hang (pull down with the scaps, feel the activation in the back of your shoulder",
          "sets": 2,
          "reps": "35s hold",
          "instructions": "A: 2 sets of 35s active hang (pull down with the scaps, feel the activation in the back of your shoulder.",
          "type": "hold"
        },
        {
          "id": "w2d3b",
          "letter": "B",
          "name": "Three sets of rings rows to near failure (1 rep in reserve)",
          "sets": 3,
          "reps": "1 reps",
          "instructions": "Between sets, hold a 35s plank, then rest another 30s to 1min.",
          "type": "hold"
        }
      ]
    },
    "notes": ""
  },
  {
    "week": "6/1/2026",
    "goal": "Balance continuing to increase pulling volume with starting to touch more difficult, less rep pulls.",
    "nutrition": "",
    "workouts": {
      "Day 1": [
        {
          "id": "w3d1a",
          "letter": "A",
          "name": "Bent over row (dumbbell or barbell)",
          "sets": 4,
          "reps": "5 reps",
          "instructions": "Same moderate challenge, but with higher weight.",
          "type": "weight"
        },
        {
          "id": "w3d1b",
          "letter": "B",
          "name": "3 x 3 banded pull ups",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "Less band tension - make these difficult",
          "type": "band"
        }
      ],
      "Day 2": [
        {
          "id": "w3d2a",
          "letter": "A",
          "name": "Each of banded face pulls and pull downs",
          "sets": 2,
          "reps": "15 reps",
          "instructions": "A: 2 sets of 15 reps each of banded face pulls and pull downs",
          "type": "band"
        },
        {
          "id": "w3d2b",
          "letter": "B",
          "name": ": Top of pull up hold for 4 seconds then 3 second negative",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "B: 3 sets of 3 reps: Top of pull up hold for 4 seconds then 3 second negative.",
          "type": "hold"
        }
      ],
      "Day 3": [
        {
          "id": "w3d3a",
          "letter": "A",
          "name": "Active hang (pull down with the scaps, feel the activation in the back of your shoulder",
          "sets": 1,
          "reps": "45s hold",
          "instructions": "A: 1 sets of 45s active hang (pull down with the scaps, feel the activation in the back of your shoulder.",
          "type": "hold"
        },
        {
          "id": "w3d3b",
          "letter": "B",
          "name": "Four sets of rings rows to less than failure (2-3 reps in reserve)",
          "sets": 4,
          "reps": "3 reps",
          "instructions": "Between sets, hold a 30s plank, then rest another 30s to 1min.",
          "type": "hold"
        }
      ]
    },
    "notes": ""
  },
  {
    "week": "6/8/2026",
    "goal": "Balance continuing to increase pulling volume with starting to touch more difficult, less rep pulls.",
    "nutrition": "",
    "workouts": {
      "Day 1": [
        {
          "id": "w4d1a",
          "letter": "A",
          "name": "Bent over row (dumbbell or barbell)",
          "sets": 4,
          "reps": "5 reps",
          "instructions": "Go up 5-10# from last week.",
          "type": "weight"
        },
        {
          "id": "w4d1b",
          "letter": "B",
          "name": "3 x 3 banded pull ups",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "Less band tension - make these difficult",
          "type": "band"
        }
      ],
      "Day 2": [
        {
          "id": "w4d2a",
          "letter": "A",
          "name": "Each of banded face pulls and pull downs",
          "sets": 2,
          "reps": "15 reps",
          "instructions": "A: 2 sets of 15 reps each of banded face pulls and pull downs",
          "type": "band"
        },
        {
          "id": "w4d2b",
          "letter": "B",
          "name": ": Top of pull up hold for 4 seconds then 3 second negative",
          "sets": 3,
          "reps": "3 reps",
          "instructions": "B: 3 sets of 3 reps: Top of pull up hold for 4 seconds then 3 second negative.",
          "type": "hold"
        }
      ],
      "Day 3": [
        {
          "id": "w4d3a",
          "letter": "A",
          "name": "Active hang (pull down with the scaps, feel the activation in the back of your shoulder",
          "sets": 1,
          "reps": "50s hold",
          "instructions": "A: 1 sets of 50s active hang (pull down with the scaps, feel the activation in the back of your shoulder.",
          "type": "hold"
        },
        {
          "id": "w4d3b",
          "letter": "B",
          "name": "Four sets of rings rows to less than failure (2-3 reps in reserve)",
          "sets": 4,
          "reps": "3 reps",
          "instructions": "Between sets, hold a 30s plank, then rest another 30s to 1min.",
          "type": "hold"
        }
      ]
    },
    "notes": ""
  },
  {
    "week": "6/15/2026",
    "goal": "Check in and retest",
    "nutrition": "",
    "workouts": {
      "Day 1": [],
      "Day 2": [],
      "Day 3": []
    },
    "notes": ""
  }
];
