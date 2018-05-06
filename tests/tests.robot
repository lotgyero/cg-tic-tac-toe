*** Settings ***
Library           Process
Suite Teardown    Terminate All Processes    kill=True

*** Test Cases ***
Check initial state
        ${result} =    Run Process    node ./tests/test_checkturn.js    shell=True    cwd=./
        #${gamemodel}=  evaluate  json.loads('''${result.stdout}''')  json
        #Should be equal     ${gamemodel[turnBuf]} [ 0, 0, 0, 0, 0, 0, 0 ]
        Should Contain    ${result.stdout}  small: {},
        Should Contain    ${result.stdout}  big: [ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ],

Check small and big check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js    shell=True    cwd=./
    Should Contain  ${result.stdout}    { '0': [], X: [] },
    Should Contain  ${result.stdout}    changes: { '0': [ 28, 29, 30 ], X: [ 19, 20, 21 ] } }
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'E', 'E', 'X', '0', 'E', 'E', 'E', 'E', 'E' ],

Check won check functions
    ${result} =    Run Process    node ./tests/test_checkturn.js    shell=True    cwd=./
    Should Contain  ${result.stdout}    big: { '0': [ 4 ], X: [ 3 ] }
    Should Contain  ${result.stdout}    big: { '0': [ 5 ], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: { '0': [], X: [ 1 ] }
    Should Contain  ${result.stdout}    big: [ 'E', 'X', 'X', 'X', '0', '0', '0', 'E', 'E', 'E' ],
    Should Contain  ${result.stdout}    big: { '0': [ 6 ], X: [ 2 ] }
    Should Contain  ${result.stdout}    winner: 'X'
