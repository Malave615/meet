Feature: Specify number of events

    Scenario: When user hasn’t specified a number, 32 event is shown by default
        Given the user hasn’t specified a number
        When the user opens the app
        Then the user should see 32 events

    Scenario: User can change the number of events displayed
        Given the main page is open
        When the user changes the number of events displayed
        Then the user should see the specified number of events