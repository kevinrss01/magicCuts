export interface Utterance {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  speaker: number;
  id: string;
  words: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker: number;
  speaker_confidence: number;
  punctuated_word: string;
}

export interface FormattedSegment {
  start: number;
  end: number;
  transcript: string;
  speaker: number;
}
