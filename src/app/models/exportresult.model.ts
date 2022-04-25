export class ExportResult {
    sentence: string
    aQuery: string
    templateType: string
    matchType: string
    dictFromSentence: any

  constructor(
    sentence: string, 
    aQuery: string, 
    templateType: string, 
    matchType: string, 
    dictFromSentence: any
) {
    this.sentence = sentence
    this.aQuery = aQuery
    this.templateType = templateType
    this.matchType = matchType
    this.dictFromSentence = dictFromSentence
  }
  
}