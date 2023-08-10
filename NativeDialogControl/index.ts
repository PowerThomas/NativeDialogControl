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
    private _context: ComponentFramework.Context<IInputs>;

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
        this._context = context;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        const p = this._context.parameters;

        if (this._context.mode.isVisible && !this._dialogIsVisible) {
            switch (p.type.raw) {
                case "0": // Alert dialog
                    this._dialogIsVisible = true;
                    this._context.navigation.openAlertDialog(
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
                            console.log("Alert dialog closed");
                            this._event = {
                                eventName: 'OnSelect',
                                eventValue: 'close',
                            };
                            this._notifyOutputChanged();
                        },
                        () => {
                            console.log("Error in Alert Dialog");
                            this._dialogIsVisible = false;
                        },
                    );
                    break;

                case "1": //Confirm dialog
                    this._dialogIsVisible = true;
                    this._context.navigation.openConfirmDialog(
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
                            console.log(success);
                            if (success.confirmed) {
                                console.log("Ok button clicked.");
                                this._event = {
                                    eventName: 'OnSelect',
                                    eventValue: 'confirm',
                                };
                                this._notifyOutputChanged();
                            }
                            else {
                                console.log("Cancel or X button clicked.");
                                this._event = {
                                    eventName: 'OnSelect',
                                    eventValue: 'close',
                                };
                                this._notifyOutputChanged();
                            }
                        }
                    );
                    break;

                case "2": //Error dialog
                    this._dialogIsVisible = true;
                    this._context.navigation.openErrorDialog(
                        {
                            message: defaultIfEmpty(p.text, ''),
                        }
                    ).then(
                        () => {
                            console.log("Error dialog closed");
                            this._event = {
                                eventName: 'OnSelect',
                                eventValue: 'close',
                            };
                            this._notifyOutputChanged();
                        },
                        () => {
                            console.log("Error in Error Dialog");
                            this._dialogIsVisible = false;
                        },
                    );
                    break;
            }
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        this._dialogIsVisible = false;
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