declare module '@isoterik/react-word-cloud' {
  import * as React from 'react';

  export type Word = { text: string; value: number };

  export interface GradientStop {
    offset: string; // e.g. '0%', '100%'
    color: string;  // CSS color
    opacity?: number;
  }

  export interface Gradient {
    id: string;
    type: 'linear' | 'radial';
    angle?: number; // for linear
    stops: GradientStop[];
  }

  export interface WordCloudProps {
    words: Word[];
    width?: number;
    height?: number;
    padding?: number;
    gradients?: Gradient[];
    fill?: (word: Word, index: number) => string;
    fontFamily?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export const WordCloud: React.FC<WordCloudProps>;
}

