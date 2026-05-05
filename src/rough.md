# Edit the following content in the head
- The title of the Page
- Put a description in the head
- Include SEO meta content in the head
- Change favicon to brand logo in the head


# Add an header section in the marketing page
- send signal to the left side  and send signal logo
- add  naigaton links; features, use cases, log in and get started button in the right side of the header setion
- Place the navigation menu in the center
- remove the dark gray color from the upper part of the marketing page
- use the header background color for the background of the marketing page
- remove the border line below the header line
- remove the login link from the header and only have the get started button
- confirm that the typography in the header is making use of roboto family font
- confirm that the on primary color is in color system and ask the agent to use it on all primary button text
- add horizontal padding of 6 rem in the header
- ask the agent to configure box-sizing: border-box in the global settin of the page
Ask AI agent to use body large text for the nav links

# Hero Section
- remove every section below the hero section including the footer section
- remove the learn more button from the hero section and center the get started free button
- change te text button from get started free to get started for free
- ask the agent to go to color system and pick a not very black color for the hero description text
- ask the agent to use `0vh for the height of the whole marketing page

# Signup Page
- add a home link on the page. You can use the logo of the app to represent that
- navigation: add a home link on the page. You can use the logo of the app to represent that.
- input fields need hover interaction state

# Signup Page-Ui problem
- the buton label is not using the on primary color
- remove form border
- reduce the blackness of the label text
- reduce default border blackness of the input fields
- change the label text from "create account" to "Sign up"
- remove all place holder
- remove form description text
- change the form text and button text to create account
- change the background color of the header to the  background color of the signup form
- add a margin of 32px between form title and form
- add animation to input focus

# Form State
- Empty input states

# Company Name Field
- prevent special characters
- minimumof 2 characters
- if a user goes into focus mode and leaves the input without typng their company name, display an error using the error color from the design system saying "Field must not be empty". Remove the error only when they start typing in the input field.

-display "enter a valid company email address" the moment the user starts typing in the email field. Remove the error message only when the extension in the email address that does not end with "gmail.com" or "yahoo.com".

- for the password requirements display this in real time as the user types in the password field. If the requirements are not met, display an error using the error color from the design system.

* password must be 8 characters
* password must contain a number
* password must contain a special character

