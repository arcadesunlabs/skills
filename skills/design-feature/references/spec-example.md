# Feature spec — filled-in example

A complete product spec following the structure in [spec.md](spec.md).

## Example — Password Reset

```md
# Feature Specification: Password Reset

## 1. Context

Users who forget their password currently need to contact support to recover access. This creates friction for users and increases support workload.

## 2. Objective

Allow users to securely reset their password without contacting support.

## 3. Target users

- Existing users who forgot their password.
- Support team, indirectly, by reducing manual recovery requests.

## 4. Scope

- Add a "Forgot password?" option to the login screen.
- Allow the user to request a password reset link by email.
- Send a secure reset link.
- Allow the user to create a new password.
- Show success and error messages.

## 5. Out of scope

- Password reset by SMS.
- Account recovery without email access.
- Admin-forced password reset.
- Multi-factor authentication changes.

## 6. Proposed solution

The user will request a password reset from the login screen. The system will send a secure reset link to the registered email address. After opening the link, the user can define a new password.

## 7. User flow

1. User opens the login screen.
2. User clicks "Forgot password?".
3. User enters their email address.
4. System validates the email format.
5. System sends a password reset link if the email exists.
6. User opens the link.
7. User enters a new password.
8. System validates and saves the new password.
9. User sees a success message and can log in.

## 8. Use cases

### Use case: Request password reset with valid email

Given the user is on the password reset screen  
When the user enters a valid registered email  
Then the system should send a password reset link  
And show a confirmation message.

### Use case: Request password reset with invalid email format

Given the user is on the password reset screen  
When the user enters an invalid email format  
Then the system should show a validation error  
And should not submit the request.

### Use case: Use expired reset link

Given the reset link has expired  
When the user opens the link  
Then the system should show an expired link message  
And provide an option to request a new link.

## 9. Business rules

- Reset links must expire after a defined period.
- A reset link can only be used once.
- The system should not reveal whether an email is registered.
- The new password must follow the password policy.
- The user must be able to request a new reset link if the previous one expired.

## 10. Acceptance criteria

- [ ] The login screen displays a "Forgot password?" option.
- [ ] The user can access the password reset request screen.
- [ ] The system validates the email format before submitting.
- [ ] The system shows a generic confirmation message after submission.
- [ ] The system sends a reset link to registered users.
- [ ] The reset link opens the password creation screen.
- [ ] The system rejects expired reset links.
- [ ] The system rejects already used reset links.
- [ ] The system validates the new password using the password policy.
- [ ] The user can log in with the new password after a successful reset.
- [ ] The system shows clear error messages when something fails.

## 11. Edge cases and error states

- Invalid email format.
- Email not registered.
- Expired reset link.
- Already used reset link.
- Weak password.
- Network failure.
- Email delivery failure.
- User submits the form multiple times.
- User opens the link on a different device.

## 12. Analytics and metrics

- Password reset requests started.
- Password reset emails sent.
- Password reset links opened.
- Password reset completed.
- Password reset failed.
- Expired link attempts.

## 13. Dependencies

- Email delivery service.
- Authentication service.
- Password policy definition.
- UI copy for success and error messages.

## 14. Open questions

- How long should the reset link remain valid?
- Should users receive a notification after the password is changed?
- Should there be rate limiting by email or IP address?

## 15. Assumptions

- Users have a registered email address.
- The authentication service supports secure password reset tokens.
- The email service is already available in the system.
```
