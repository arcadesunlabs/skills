```md
# Reset password

## Goal

Users who forget their password regain access without contacting support.

## Scope

- Request a reset link by email.
- Define a new password from a valid link.

## Out of scope

- Recovery by SMS or without the registered email.
- Changes to multi-factor authentication.

## User flow

1. The user requests a reset link from the login screen.
2. The product shows a confirmation and, from a valid link, lets the user set
   a new password.
3. The product confirms success and allows login with the new password.

## Rules

- [ ] The confirmation never reveals whether the email is registered.
- [ ] A link expires after the configured period and works only once.
- [ ] An expired or used link is rejected and offers a new request.
- [ ] The new password must satisfy the password policy.
- [ ] An invalid email format blocks the request.
- [ ] A delivery failure shows an error and keeps the entered email.
- [ ] Repeated requests do not send duplicate links within a short interval.

## Open questions

- How long should the link remain valid?
- Should a successful password change trigger a security notification?
```
