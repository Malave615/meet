Project Overview:
This project is going to be an Events App with the objective of building a serverless, progressive web application (PWA) with React using a test-driven development (TDD) technique. The app uses the Google Calender API to fetch the upcoming events.

Project Dependencies: React

FEATURE #1: Filter Events by City : As a user, I should be able to filter events by the city I am in or near.

    Scenario #1: When user hasn't searched for a city, show upcoming events from all cities Given I am on the events page And I have not specified a city in the search When I view the list of upcoming events Then I should see upcoming events from all cities

    Scenario #2: User should see a list of suggestions when they search for a city Given I am on the events page When I start typing a city name in the search field Then I should see a list of city suggestions based on my input

    Scenario #3: User can select a city from the suggested list Given I am on the events page And I see a list of city suggestions in the search field When I select a city from the suggested list Then the events should be filtered to show only those from the selected city

FEATURE #2: Show/Hide Event Details : As a user, I should be able to show or hide event details, so that I can view more information about an event when needed and keep my interface clean and focused.

    Scenario #1: An event element is collapsed by default Given I am on the events page When I view the list of events Then each event element should be collapsed by default

    Scenario #2: User can expand an event to see details Given I am on the events page And an event element is collapsed When I click on the event element to expand it Then I should see the event details displayed

    Scenario #3: User can collapse an event to hide details Given I am on the events page And an event element is expanded When I click on the event element to collapse it Then the event details should be hidden

FEATURE #3: Specify Number of Events : As a user, I should be able to specify the number of events to display, so that I can customize my view according to my preferences and see only the relevant events.

    Scenario #1: When user hasn't specified a number, 32 events are shown by default Given I am on the events page And I have not specified a number of events to display When the events are loaded Then I should see 32 events displayed by default

    Scenario #2: User can change the number of events displayed Given I am on the events page And I see the current number of events displayed When I specify a new number of events to display And I apply the change Then the number of events displayed should update to the new number

FEATURE #4: Use the App When Offline : As a user, I should be able to use the app when offline so that I can access and manage my information without needing an active internet connection.

    Scenario #1: Show cached data when there's no internet connection Given I am using the app And there is no internet connection When I access the app to view data Then I should see the cached data displayed

    Scenario #2: Show error when user changes search settings (city, number of events) Given I am using the app without an internet connection And I have cached data available When I attempt to change search settings, such as city or number of events Then I should see an error message indicating that changes cannot be applied offline

FEATURE #5: Add an App Shortcut to the Home Screen : As a user, I should be able to add an app shortcut to the home screen so that I can quickly access the app without navigating through menus.

    Scenario #1: User can install the app as a shortcut on their device home screen Given I am using the app on my device When I choose to add the app as a shortcut to my home screen Then the app shortcut should be installed on my device home screen

FEATURE #6: Display Charts Visualizing Event Details : As a user, I should be able to view charts visualizing event details so that I can easily understand and analyze the data at a glance.

    Scenario #1: Show a chart with the number of upcoming events in each city Given I am on the event details page When I view the chart visualizations Then I should see a chart displaying the number of upcoming events in each city
