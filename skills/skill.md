# General skills rules
This file defines baseline engineering & product standards applied across this repository

## Code organization
Readable and maintainable code is prioritized

Large files are avoided. Features are organized into modules.

- leads
- templates
- campaigns
- analytics
- settings

## Naming conventions

- files are named in kebab-case
- components are named in PascalCase
- functions are named in camelCase
- constants are named in UPPER_SNAKE_CASE
- variables are named in camelCase 


## Data validation
client input is treated as untrusstworth. All input is validated and sanitized befor use

Validation occur on the server-side befor that becomes persistent or before message is sent out to users

phone numbers are normalized before storage

messaging operationns include idempotency safeguards

## Compliance enforcement
messaging operations must respect opt-in and unsubscribe requirements

unsubscribe keywords are to be recognized and enforced 

duplicate message are to be prevented

## User Interface Rule
UI styling follows the design token defined in design-token.token.json

color usage must reference tokens defined in designtoken.css

typography must reference tokens defined in design-token.css

spacing, border, radii, shadow will make use of tailwind css utility classes

color and typography must reference tokens defined in design-tokens.css and not use tailwind css utility classes

direct hex color usage is prohibited

Arbitrary font size are prohibited. All font sizes must be defined in design-token.css


## Product Safety Rules
Large message sends must require user confirmation

Campaign execution will have controls for
- pause
- stop
- resume
- cancel
- see progress review

## Testing Expectations
Each feature includes verification of

- successful primary workflow
- invalid input behaviour
- compliance behavior
- edgecase behaviour