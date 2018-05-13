*** Settings ***
Library           Process
Suite Teardown    Terminate All Processes    kill=True

*** comments *** //TODO fix square ids used for testing
Check initial state and small funcs
    ${result} =    Run Process    node ./tests/test_checkturn.js 1   shell=True    cwd=./
    Should Contain    ${result.stdout}  state: 'in progress',
    Should Contain    ${result.stdout}  turnCounter: 1,
    Should Contain    ${result.stdout}  small: {},

Check small world funcs
    ${result} =    Run Process    node ./tests/test_checkturn.js 1   shell=True    cwd=./
    Should Contain  ${result.stdout}    { '0': [ 28, 29, 30 ], X: [ 19, 20, 21 ] }
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'X', '0', 'E', 'E', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    small: { '19': 'X', '20': 'X', '21': 'X', '28': '0', '29': '0', '30': '0' },

Check small world 0 collision
    ${result} =    Run Process    node ./tests/test_checkturn.js 2   shell=True    cwd=./
    Should Contain  ${result.stdout}    turnCounter: 2,
    Should Contain  ${result.stdout}    small: { '23': 'X', '25': 'C', '31': '0', '56': '0', '81': 'X' },
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],

Check big check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 1   shell=True    cwd=./
    Should Contain  ${result.stdout}  big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    changes: { '0': [ 28, 29, 30 ], X: [ 19, 20, 21 ] }
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'X', '0', 'E', 'E', 'E', 'E', 'E' ],

Check won check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 3   shell=True    cwd=./
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Not Contain  ${result.stdout}    big: { '0': [ 5 ], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'X', 'X', 'X', '0', 'E', '0', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    big: { '0': [ 6 ], X: [ 2 ] }
    Should Contain  ${result.stdout}    winner: 'X'

Check draw check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 4   shell=True    cwd=./
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Contain  ${result.stdout}    big: { '0': [ 5 ], X: [ 1 ] }
    Should Not Contain  ${result.stdout}    big: { '0': [], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'X', 'X', 'X', '0', '0', '0', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    big: { '0': [ 6 ], X: [ 2 ] }
    Should Contain  ${result.stdout}    winner: 'draw'

Check menu player id functions
    ${result} =    Run Process    node ./tests/test_menu.js 1   shell=True    cwd=./
    Should Contain  ${result.stdout}    { playerid: 1 }
    Should Contain  ${result.stdout}    { playerid: 2 }
    Should Contain  ${result.stdout}    { playerid: 3 }
    Should Contain  ${result.stdout}    { playerid: 4 }
    Should Contain  ${result.stdout}    { playerid: 5 }
    Should Contain  ${result.stdout}    { playerid: 6 }
    Should Contain  ${result.stdout}    { playerid: 0 }

*** Test cases ***
Check initial state
    ${result} =    Run Process    node ./tests/test_checkturn.js 6   shell=True    cwd=./
    Should Contain  ${result.stdout}    state: 'stopped'
    Should Not Contain  ${result.stdout}    state: 'in progress'
    Should Not Contain  ${result.stdout}    { playerid: 5 }
    Should Not Contain  ${result.stdout}    { playerid: 1 }
    Should Contain  ${result.stdout}    usedSlots: [ 1 ]

Check game start conditions
    ${result} =    Run Process    node ./tests/test_checkturn.js 7   shell=True    cwd=./
    Should Contain  ${result.stdout}    state: 'in progress'
    Should Contain  ${result.stdout}    usedSlots: [ 1, 2, 3, 4, 5, 6 ]
    Should Contain  ${result.stdout}    playerid received 0
    Should Contain  ${result.stdout}    { playerid: 1 }
    Should Contain  ${result.stdout}    { begin: true }