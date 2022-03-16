import { Attribute } from "./attribute.model"

export interface Scenario {
    datasetName: string
    pk: Attribute
    fds: Array<[Attribute[], string[]]>
    compositeKeys: Array<Attribute[]>
    ambiguousAttribute: any[]
    attributes: Attribute[]
    nameToAttribute: object
}