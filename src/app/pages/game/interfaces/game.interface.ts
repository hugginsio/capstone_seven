export interface ClickEvent {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  type: string;
  target: {
    className: string;
    id: string;
  }
}