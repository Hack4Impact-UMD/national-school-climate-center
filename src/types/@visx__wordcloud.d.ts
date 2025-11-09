declare module '@visx/wordcloud' {
  import * as React from 'react';

  export type Spiral = 'archimedean' | 'rectangular';

  export interface CloudWord<T = any> {
    text: string;
    value: number;
    x: number;
    y: number;
    size: number;
    rotate: number;
    datum: T;
  }

  export interface WordcloudProps<T = any> {
    words: T[];
    width: number;
    height: number;
    padding?: number;
    spiral?: Spiral;
    random?: () => number;

    font?: string;
    fontStyle?: string;
    fontWeight?: string | number;
    fontSize?: number | ((word: T) => number);

    rotate?: (word: T, index: number) => number;

    wordAccessor?: (d: T) => string;
    valueAccessor?: (d: T) => number;

    className?: string;
    style?: React.CSSProperties;
    children?: (cloudWords: CloudWord<T>[]) => React.ReactNode;
  }

  const Wordcloud: React.FC<WordcloudProps>;
  export default Wordcloud;
}

