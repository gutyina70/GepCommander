export class KeyboardEventHandler
{
  public static handleTextboxNavigation(event: KeyboardEvent): boolean
  {
    if(event.ctrlKey)
    {
      switch(event.code)
      {
        case 'A':
        case 'ArrowLeft':
        case 'ArrowRight':
          return true;
      }
    }
    if(event.shiftKey)
    {
      switch(event.code)
      {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'End':
        case 'Home':
          return true;
      }
    }
    return false;
  }
}
