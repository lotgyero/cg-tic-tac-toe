*** Settings ***
Library           Process
Suite Teardown    Terminate All Processes    kill=True

*** Test cases ***
Check initial state
    ${result} =    Run Process    node ./tests/test_checkturn.js 6   shell=True    cwd=./
    Should Contain  ${result.stdout}    state: 'stopped'
    Should Not Contain  ${result.stdout}    state: 'in progress'
    Should Not Contain  ${result.stdout}    { playerid: 5 }
    Should Not Contain  ${result.stdout}    { playerid: 1 }
    Should Contain  ${result.stdout}    usedSlots: [ 1 ]

Check simple turn
    ${result} =    Run Process    node ./tests/test_checkturn.js 1   shell=True    cwd=./
    Should Contain    ${result.stdout}  state: 'in progress',
    Should Contain    ${result.stdout}  turnCounter: 2,
    Should Contain    ${result.stdout}  { '3': 'X', '10': 'X', '20': 'X', '33': '0', '40': '0', '50': '0' },

Check small world total collision
    ${result} =    Run Process    node ./tests/test_checkturn.js 2   shell=True    cwd=./
    Should Contain  ${result.stdout}    turnCounter: 2,
    Should Contain  ${result.stdout}    small: { '3': 'C', '10': 'C', '20': 'C' },
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],

Check small world total singular collision
    ${result} =    Run Process    node ./tests/test_checkturn.js 12   shell=True    cwd=./
    Should Contain  ${result.stdout}    turnCounter: 2,
    Should Contain  ${result.stdout}    small: { '3': 'X', '4': '0', '10': 'C', '20': 'X', '29': '0' },
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],

Check big check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 3   shell=True    cwd=./
    Should Not Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 2 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'X', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],

Check semi-win check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 13   shell=True    cwd=./
    Should Not Contain  ${result.stdout}    big: { '0': [], X: [ 1 ] },
    Should Not Contain  ${result.stdout}    big: { '0': [], X: [ 2 ] },
    Should Not Contain  ${result.stdout}    big: { '0': [], X: [ 3 ] },
    Should Not Contain  ${result.stdout}    big: { '0': [ 5 ], X: [ 1 ] }
    Should Not Contain  ${result.stdout}    big: [ 'E', 'X', 'X', 'X', 'E', 'E', 'E', 'E', 'E', 'E' ],
    Should Not Contain  ${result.stdout}    winner: 'X'

Check won check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 113   shell=True    cwd=./
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 1 ] },
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 2 ] },
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 3 ] },
    Should Not Contain  ${result.stdout}    big: { '0': [ 5 ], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'X', 'X', 'X', 'E', 'E', 'E', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    winner: 'X'

Check game start conditions
    ${result} =    Run Process    node ./tests/test_checkturn.js 7   shell=True    cwd=./
    Should Contain  ${result.stdout}    state: 'in progress'
    Should Contain  ${result.stdout}    usedSlots: [ 1, 2, 3, 4, 5, 6 ]
    Should Contain  ${result.stdout}    playerid received 0
    Should Contain  ${result.stdout}    { playerid: 1 }
    Should Contain  ${result.stdout}    { begin: true }

Check player status functions
    ${result} =    Run Process    node ./tests/test_checkturn.js 9   shell=True    cwd=./
    Should Contain  ${result.stdout}    state: 'in progress'
    Should Contain  ${result.stdout}    usedSlots: [ 1, 2, 3, 4 ]
    Should Contain  ${result.stdout}    2, 2 ],
    Should Contain  ${result.stdout}    3, 3 ],
    Should Contain  ${result.stdout}    disconnected players 5,6