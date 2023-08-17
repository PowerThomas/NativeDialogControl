# Native Dialog Control

## Description
Native Dialog Control is a Power Apps PCF control designed specifically for Custom Pages in Model-driven apps. By leveraging the Navigation API, it enables the use of native model-driven dialogs to enhance user interaction. Currently, the following dialog types are supported:
- Alert
- Confirmation
- Error

## Installation

1. Navigate to the Releases section of this repository and download the managed solution.
2. Import the downloaded managed solution into your Power Apps environment.
3. Ensure that the 'code components' feature is enabled in your environment settings.

## Usage

Once installed, you can utilize the control in your Model-driven app custom pages to invoke native dialog functionalities. 

### Setup

1. **Adding the Control to a Screen**: Include the control on the desired screen. Note that the control itself doesn't possess any UI elements.
2. **Selecting the Dialog Type**: Choose among the available types: Alert Dialog, Confirm Dialog, or Error Dialog.
3. **Setting Key Properties**: Each dialog type requires certain properties to be set:

    **Alert Dialog**:
    - `Text`: The main text displayed on the dialog.
    - `ConfirmButtonLabel`: Label text of the dialog's single button.

    **Confirm Dialog**:
    - `Title`: The main title of the dialog.
    - `Subtitle`: The subtitle of the dialog.
    - `Text`: The main text displayed on the dialog.
    - `ConfirmButtonLabel`: The button text for the confirmation button.
    - `CancelButtonLabel`: The button text for the cancel button.

    **Error Dialog**:
    - `Text`: The main text displayed on the dialog.

    **General Properties for All Dialogs**:
    - `Height`: The dialog height in pixels.
    - `Width`: The dialog width in pixels.
    - `Visible`: Used to control the visibility of the native dialog.

### Behavior Configuration

**Configuring Dialog Visibility**:
To toggle the visibility of the dialog control, use a Boolean (true/false) type variable. For instance:

To **open** the dialog, use the following Power Fx formula in an action formula elsewhere in your app (like the `OnSelect` property of a button):
  ```Power Apps
  UpdateContext({ showHideDialog: true })
  ```

To **close** the dialog, set the OnChange property of the dialog to:
```Power Apps
UpdateContext({ showHideDialog: false })
```

Assign the variable to the `Visible` property of the dialog:
```Power Apps
showHideDialog
```

**Configuring Button Actions**
For dialog button actions, use the `OnChange` property of the dialog. By leveraging the `If()` or `Switch()` functions, you can define actions based on the `Self.eventValue` text value. Depending on the action, you might also want to close the dialog post completion. For instance:
The `eventValue` can either be `close` or `confirm`. The value `confirm` is returned when the confirm button is selected in the confirm dialog. For all other cases, the value is `close`.
```Power Apps
If( Self.eventValue = "close", 
    Notify("Email Sent")
);
UpdateContext({ showHideDialog: false })
```
This ensures the dialog closes after the desired action is executed.

## Contribution

We welcome contributions from the community. If you'd like to contribute:
1. Fork this repository.
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a new Pull Request against this repository.

Please ensure that your code adheres to the established standards and that all tests pass before submitting a Pull Request.

## License
A license for thos project will be added soon.
//This project is licensed under the [Your License Here] - see the LICENSE.md file for details. *(Please specify your license)*

## Screenshots

Screenshots showcasing the functionality and UI of the control will be added soon. Stay tuned!

## Authors

- **PowerThomas** - *Initial work* - [GitHub Profile]([(https://github.com/PowerThomas])

## Acknowledgements

Special thanks to:
- My colleague Jeroen van Knotsenburg for his invaluable assistance and guidance in creating my first PCF project.
