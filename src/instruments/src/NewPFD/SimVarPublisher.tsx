import { EventBus, SimVarDefinition, SimVarValueType, SimVarPublisher } from "msfssdk";

export interface PFDSimvars {
    pitch: number;
    roll: number;
}

export enum PFDVars {
    pitch = "PLANE PITCH DEGREES",
    roll = "PLANE BANK DEGREES",
}

/** A publisher to poll and publish nav/com simvars. */
export class PFDSimvarPublisher extends SimVarPublisher<PFDSimvars> {
    private static simvars = new Map<keyof PFDSimvars, SimVarDefinition>([
        ["pitch", { name: PFDVars.pitch, type: SimVarValueType.Degree }],
        ["roll", { name: PFDVars.roll, type: SimVarValueType.Degree }],
    ]);

    public constructor(bus: EventBus) {
        super(PFDSimvarPublisher.simvars, bus);
    }
}
