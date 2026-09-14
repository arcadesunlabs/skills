```md
# Reset password

## Problem

Users who forget their password must contact support to recover access.

## Objective

Allow users to securely regain access without support assistance.

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

## Business rules

- A reset link expires after the configured period and can be used only once.
- The request must not reveal whether an email is registered.
- The new password must satisfy the password policy.

## Acceptance criteria

- [ ] A user can request a reset link with a valid email format.
- [ ] The confirmation does not reveal whether the account exists.
- [ ] A valid, unused link allows the user to set a compliant password and log in.
- [ ] Expired or used links are rejected and offer a new request.

## Edge cases and error states

- Invalid email format.
- Weak password.
- Network or email delivery failure.
- Repeated submission.

## Open questions

- How long should the link remain valid?
- Should a successful password change trigger a security notification?
```
