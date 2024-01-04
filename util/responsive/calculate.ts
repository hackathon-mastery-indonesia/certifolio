export const calculateFontSize = (defaultFontSize: number, parentWidth: number | null): number => {
    if (parentWidth) {
      const fontSize = (defaultFontSize * 100) / parentWidth;
      return fontSize;
    }
    return defaultFontSize; // Ukuran font default jika parentWidth belum dihitung
  };

export const calculateRelativePositionFromParent = (old: number, parentSize: number) =>{
    return old / parentSize;
    
  }

export const parseRelativePositionToFixed = (old : number, parentSize : number ) => {
    return old * parentSize;
  }






