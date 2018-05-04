*** Settings ***
Library           Process
Suite Teardown    Terminate All Processes    kill=True

*** Test Cases ***
Check state
    ${result} =    Run Process    node test_client.js    shell=True    cwd=./
    Should Contain    ${result.stdout}  state: 'in progress'
Check basic turn functions
    ${result} =    Run Process    node test_client.js    shell=True    cwd=./
    Should Contain    ${result.stdout}  turnBuf: [ 0, 25, 81, 23, 0, 0, 0 ] }
Check turnBuf after the turn
    ${result} =    Run Process    node test_client.js    shell=True    cwd=./
    #${gamemodel}=  evaluate  json.loads('''${result.stdout}''')  json
    #Should be equal     ${gamemodel[turnBuf]} [ 0, 0, 0, 0, 0, 0, 0 ]
    Should Contain    ${result.stdout}  turnBuf: [ 0, 0, 0, 0, 0, 0, 0 ] }