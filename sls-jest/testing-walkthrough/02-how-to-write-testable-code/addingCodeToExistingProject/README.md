# Adding features with tests to an existing legacy codebase

In this section, we will demonstrate how to add a new feature with tests to an existing legacy code base. The codebase is an example, it is not a real project. 

The example function we will be working with does the following:
- takes a user from the app as an input, from now on referred to as friend
- determines the currently logged in user
- determines if the friend passed in as an input is a friend of the logged in user
- if so, the function will get the trips belonging to the friend
- all trips have the following attributes:
    - id
    - location
    - startDate

Our task in this example scenario is to calculate the days left before the startDate of each trip, and add a `daysLeft` property to each trip.

The task also requires that we return `NA` for `daysLeft` if there is no `startDate` property on the trip


## Videos
...coming soon
