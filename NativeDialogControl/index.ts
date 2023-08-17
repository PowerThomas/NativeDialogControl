import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { IControlEvent } from "./IControlEvent";

export class NativeDialogControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
    private _notifyOutputChanged: () => void;

    // Reference to the event that will be fired.
    private _event: IControlEvent;

    // Reference to the div element that hold together all the HTML elements that we are creating as part of this control
    //private _container: HTMLDivElement;

    // Reference to ComponentFramework Context object
    //private _context: ComponentFramework.Context<IInputs>;

    // Reference to the current open state of the dialog
    private _dialogIsVisible: boolean;


    /**
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._dialogIsVisible = false
        this._event = {
            eventName: undefined,
            eventValue: undefined,
        };
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const p = context.parameters;
        console.debug("-----------------------------");
        console.debug("Properties have been updated:");
        console.debug("context.mode.isVisible:" + context.mode.isVisible);
        console.debug("_dialogIsVisible:" + this._dialogIsVisible);

        if (context.mode.isVisible) {
            console.debug("Component is visible, continue...");
            if (this._event.eventName === undefined) {
                console.debug("No event available, continue...");
                if (!this._dialogIsVisible) {
                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'true'...");
                    this._dialogIsVisible = true;
                    console.debug("_dialogIsVisible:" + this._dialogIsVisible);
                    switch (p.type.raw) {
                        case "0": // Alert dialog
                            console.debug("Dialog type is 'Alert'. Opening Alert Dialog...");
                            context.navigation.openAlertDialog(
                                {
                                    text: defaultIfEmpty(p.text, ''),
                                    confirmButtonLabel: defaultIfEmpty(p.confirmButtonLabel, ''),
                                },
                                {
                                    height: undefinedIfZero(p.dialogHeight),
                                    width: undefinedIfZero(p.dialogWidth),
                                }
                            ).then(
                                () => {
                                    console.debug("Alert dialog is closed.");
                                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                    this._dialogIsVisible = false;
                                    this._event = {
                                        eventName: 'OnSelect',
                                        eventValue: 'close',
                                    };
                                    console.debug("Triggering OnSelect(close) event...");
                                    this._notifyOutputChanged();
                                },
                                () => {
                                    console.debug("Error in Alert Dialog");
                                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                    this._dialogIsVisible = false;
                                },
                            );
                            break;

                        case "1": // Confirm dialog
                            console.debug("Dialog type is 'Confirm'. Opening Confirm Dialog...");
                            context.navigation.openConfirmDialog(
                                {
                                    title: defaultIfEmpty(p.title, ''),
                                    subtitle: defaultIfEmpty(p.subtitle, ''),
                                    text: defaultIfEmpty(p.text, ''),
                                    confirmButtonLabel: defaultIfEmpty(p.confirmButtonLabel, ''),
                                    cancelButtonLabel: defaultIfEmpty(p.cancelButtonLabel, ''),
                                },
                                {
                                    height: undefinedIfZero(p.dialogHeight),
                                    width: undefinedIfZero(p.dialogWidth),
                                }
                            ).then(
                                (success) => {
                                    console.debug("Confirm dialog is closed.");
                                    if (success.confirmed) {
                                        console.debug("Dialog result is: confirmed");
                                        console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                        this._dialogIsVisible = false;
                                        this._event = {
                                            eventName: 'OnSelect',
                                            eventValue: 'confirm',
                                        };
                                        console.debug("Triggering OnSelect(confirm) event...");
                                        this._notifyOutputChanged();
                                    }
                                    else {
                                        console.debug("Dialog result is: canceled");
                                        console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                        this._dialogIsVisible = false;
                                        this._event = {
                                            eventName: 'OnSelect',
                                            eventValue: 'close',
                                        };
                                        console.debug("Triggering OnSelect(close) event...");
                                        this._notifyOutputChanged();
                                    }
                                }
                            );
                            break;

                        case "2": // Error dialog
                            console.debug("Dialog type is 'Error'. Opening Error Dialog...");
                            context.navigation.openErrorDialog(
                                {
                                    message: defaultIfEmpty(p.text, ''),
                                }
                            ).then(
                                () => {
                                    console.debug("Error dialog is closed.");
                                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                    this._dialogIsVisible = false;
                                    this._event = {
                                        eventName: 'OnSelect',
                                        eventValue: 'close',
                                    };
                                    console.debug("Triggering OnSelect(close) event...");
                                    this._notifyOutputChanged();
                                },
                                () => {
                                    console.debug("Error in Error Dialog");
                                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", setting to 'false'...");
                                    this._dialogIsVisible = false;
                                },
                            );
                            break;
                    }
                } else {
                    console.debug("_dialogIsVisible:" + this._dialogIsVisible + ", no action required.");
                }
            } else {
                console.debug("Event is not cleared yet, no action required.");
            }
        } else {
            console.debug("Component is NOT visible, clearing event...");
            this._event = {
                eventName: undefined,
                eventValue: undefined,
            };
        }
        console.debug("-----------------------------");
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {

        return this._event;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}

function defaultIfEmpty<T>(property: ComponentFramework.PropertyTypes.Property, defaultValue: T) {
    return (property.raw as T) ? property.raw : defaultValue;
}

function undefinedIfZero(property: ComponentFramework.PropertyTypes.Property) {
    return property.raw && property.raw > 0 ? property.raw : undefined;
}