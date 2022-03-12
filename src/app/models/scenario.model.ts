import { Attribute } from "./attribute.model"

export interface Scenario {
    datasetName: string
    pk: Attribute
    fds: any[]
    compositeKeys: any[]
    ambiguousAttribute: any[]
    attributes: Attribute[]
    nameToAttribute: object
}