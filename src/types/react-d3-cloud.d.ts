declare module 'react-d3-cloud' {
  import * as React from 'react';

  export interface Word {
    text: string;
    value: number;
  }

  export type Spiral = 'archimedean' | 'rectangular';

  export interface WordCloudProps {
    data: Word[];
    width?: number;
    height?: number;
    padding?: number;
    spiral?: Spiral;
    random?: () => number;

    // font configuration
    font?: string;
    fontStyle?: string;
    fontWeight?: string | number;

    // sizing: library versions differ; support both shapes
    fontSize?: number | ((word: Word) => number);
    fontSizeMapper?: (word: Word) => number;

    // rotation mapper
    rotate?: (word: Word, index: number) => number;

    // events (loosely typed to avoid coupling)
    onWordClick?: (event: unknown, d: Word) => void;
    onWordMouseOver?: (event: unknown, d: Word) => void;
    onWordMouseOut?: (event: unknown, d: Word) => void;
  }

  const WordCloud: React.FC<WordCloudProps>;
  export default WordCloud;
}

