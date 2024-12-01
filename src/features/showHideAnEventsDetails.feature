Feature: Show/Hide event details
    Scenario: An event element is collapsed by default
        Given the main page is open
        When the user sees the list of upcoming events
        Then the user should see a collapsed event element for each event

    Scenario: User can expand an event to see its details
        Given the main page is open
        When the user sees the list of upcoming events
        And the user clicks on an event
        Then the user should see the details of that event

    Scenario: User can collapse an event to hide its details
        Given the main page is open
        When the user sees the details of an event
        And the user clicks on the event again
        Then the user should see the collapsed event element for that event